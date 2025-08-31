const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getJournalEntries
} = require('../controllers/note.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Special routes
router.get('/journal', protect, getJournalEntries);

// Standard CRUD routes
router
  .route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router
  .route('/:id')
  .get(protect, getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;