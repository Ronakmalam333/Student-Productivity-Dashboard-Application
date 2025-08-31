const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
  getOverdueTasks
} = require('../controllers/task.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Special routes
router.get('/upcoming', protect, getUpcomingTasks);
router.get('/overdue', protect, getOverdueTasks);

// Standard CRUD routes
router
  .route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;