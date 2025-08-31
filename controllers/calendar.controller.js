const Calendar = require('../models/Calendar');
const Task = require('../models/Task');

// @desc    Get all events for a user
// @route   GET /api/calendar
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    // Build query
    let query = { user: req.user.id };
    
    // Filter by event type if provided
    if (req.query.eventType) {
      query.eventType = req.query.eventType;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.$or = [
        // Events that start within the range
        {
          startDate: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
          }
        },
        // Events that end within the range
        {
          endDate: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
          }
        },
        // Events that span the entire range
        {
          startDate: { $lte: new Date(req.query.startDate) },
          endDate: { $gte: new Date(req.query.endDate) }
        }
      ];
    }
    
    // Execute query
    const events = await Calendar.find(query).sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/calendar/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Calendar.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this event'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/calendar
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // If relatedTask is provided, verify it exists and belongs to user
    if (req.body.relatedTask) {
      const task = await Task.findById(req.body.relatedTask);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id of ${req.body.relatedTask}`
        });
      }
      
      // Make sure user owns the task
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to link this task'
        });
      }
    }
    
    const event = await Calendar.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/calendar/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Calendar.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }
    
    // If relatedTask is provided, verify it exists and belongs to user
    if (req.body.relatedTask) {
      const task = await Task.findById(req.body.relatedTask);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id of ${req.body.relatedTask}`
        });
      }
      
      // Make sure user owns the task
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to link this task'
        });
      }
    }
    
    event = await Calendar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/calendar/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Calendar.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }
    
    await Calendar.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get events for a specific day
// @route   GET /api/calendar/day/:date
// @access  Private
exports.getDayEvents = async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    const events = await Calendar.find({
      user: req.user.id,
      $or: [
        // Events that start on this day
        {
          startDate: {
            $gte: date,
            $lt: nextDay
          }
        },
        // Events that end on this day
        {
          endDate: {
            $gte: date,
            $lt: nextDay
          }
        },
        // Events that span this day
        {
          startDate: { $lt: date },
          endDate: { $gt: nextDay }
        }
      ]
    }).sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};