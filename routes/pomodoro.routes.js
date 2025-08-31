const express = require('express');
const {
  startPomodoro,
  completePomodoro,
  interruptPomodoro,
  getPomodoroStats,
  getRecentPomodoros
} = require('../controllers/pomodoro.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Special routes
router.post('/start', startPomodoro);
router.put('/:id/complete', completePomodoro);
router.put('/:id/interrupt', interruptPomodoro);
router.get('/stats', getPomodoroStats);
router.get('/recent', getRecentPomodoros);

module.exports = router;