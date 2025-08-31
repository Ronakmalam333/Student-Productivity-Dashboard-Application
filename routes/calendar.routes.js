const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getDayEvents
} = require('../controllers/calendar.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Special routes
router.get('/day/:date', protect, getDayEvents);

// Standard CRUD routes
router
  .route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router
  .route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;