const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 25
  },
  breakDuration: {
    type: Number, // in minutes
    default: 5
  },
  completed: {
    type: Boolean,
    default: false
  },
  interrupted: {
    type: Boolean,
    default: false
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a PomodoroSession model to track daily/weekly sessions
const PomodoroSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  totalFocusTime: {
    type: Number, // in minutes
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Add index for date and user for faster queries
PomodoroSessionSchema.index({ date: 1, user: 1 });

const Pomodoro = mongoose.model('Pomodoro', PomodoroSchema);
const PomodoroSession = mongoose.model('PomodoroSession', PomodoroSessionSchema);

module.exports = { Pomodoro, PomodoroSession };