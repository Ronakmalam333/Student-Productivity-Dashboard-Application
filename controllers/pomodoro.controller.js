const { Pomodoro, PomodoroSession } = require('../models/Pomodoro');
const Task = require('../models/Task');

// @desc    Start a new pomodoro session
// @route   POST /api/pomodoro/start
// @access  Private
exports.startPomodoro = async (req, res, next) => {
  try {
    const { duration, breakDuration, taskId } = req.body;
    
    // Validate task if provided
    if (taskId) {
      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id of ${taskId}`
        });
      }
      
      // Make sure user owns the task
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to use this task'
        });
      }
    }
    
    // Create pomodoro
    const pomodoro = await Pomodoro.create({
      startTime: new Date(),
      duration: duration || 25,
      breakDuration: breakDuration || 5,
      task: taskId || null,
      user: req.user.id
    });
    
    // Update or create session stats for the day (increment total sessions)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let session = await PomodoroSession.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (session) {
      session.totalSessions += 1;
      await session.save();
    } else {
      session = await PomodoroSession.create({
        date: today,
        totalSessions: 1,
        completedSessions: 0,
        totalFocusTime: 0,
        user: req.user.id
      });
    }
    
    res.status(201).json({
      success: true,
      data: pomodoro
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete a pomodoro session
// @route   PUT /api/pomodoro/:id/complete
// @access  Private
exports.completePomodoro = async (req, res, next) => {
  try {
    let pomodoro = await Pomodoro.findById(req.params.id);
    
    if (!pomodoro) {
      return res.status(404).json({
        success: false,
        message: `Pomodoro not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user owns the pomodoro
    if (pomodoro.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this pomodoro'
      });
    }
    
    // Update pomodoro
    pomodoro = await Pomodoro.findByIdAndUpdate(
      req.params.id,
      {
        endTime: new Date(),
        completed: true
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    // Update session stats for the day (only increment completed, not total)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let session = await PomodoroSession.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (session) {
      session.completedSessions += 1;
      session.totalFocusTime += pomodoro.duration;
      await session.save();
    } else {
      // This shouldn't happen if session was created on start, but handle it
      session = await PomodoroSession.create({
        date: today,
        totalSessions: 1,
        completedSessions: 1,
        totalFocusTime: pomodoro.duration,
        user: req.user.id
      });
    }
    
    res.status(200).json({
      success: true,
      data: pomodoro
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Interrupt a pomodoro session
// @route   PUT /api/pomodoro/:id/interrupt
// @access  Private
exports.interruptPomodoro = async (req, res, next) => {
  try {
    let pomodoro = await Pomodoro.findById(req.params.id);
    
    if (!pomodoro) {
      return res.status(404).json({
        success: false,
        message: `Pomodoro not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user owns the pomodoro
    if (pomodoro.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this pomodoro'
      });
    }
    
    // Update pomodoro
    pomodoro = await Pomodoro.findByIdAndUpdate(
      req.params.id,
      {
        endTime: new Date(),
        interrupted: true
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    // Session stats already updated when started, no need to increment total again
    // Interrupted sessions don't add to completed count or focus time
    
    res.status(200).json({
      success: true,
      data: pomodoro
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pomodoro stats for a date range
// @route   GET /api/pomodoro/stats
// @access  Private
exports.getPomodoroStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 7 days
      end = new Date();
      start = new Date();
      start.setDate(end.getDate() - 7);
    }
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const sessions = await PomodoroSession.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    
    // Calculate summary stats
    const totalSessions = sessions.reduce((sum, session) => sum + session.totalSessions, 0);
    const completedSessions = sessions.reduce((sum, session) => sum + session.completedSessions, 0);
    const totalFocusTime = sessions.reduce((sum, session) => sum + session.totalFocusTime, 0);
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    res.status(200).json({
      success: true,
      data: {
        sessions,
        summary: {
          totalSessions,
          completedSessions,
          totalFocusTime,
          completionRate: Math.round(completionRate * 100) / 100
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent pomodoro sessions
// @route   GET /api/pomodoro/recent
// @access  Private
exports.getRecentPomodoros = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const pomodoros = await Pomodoro.find({ user: req.user.id })
      .sort({ startTime: -1 })
      .limit(limit)
      .populate('task', 'title');
    
    res.status(200).json({
      success: true,
      count: pomodoros.length,
      data: pomodoros
    });
  } catch (err) {
    next(err);
  }
};