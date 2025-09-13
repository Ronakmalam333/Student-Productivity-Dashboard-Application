import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  note: null,
  journalEntries: [],
  loading: false,
  error: null,
  success: false,
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    getNotesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getNotesSuccess: (state, action) => {
      state.loading = false;
      state.notes = action.payload;
      state.error = null;
    },
    getNotesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getNoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getNoteSuccess: (state, action) => {
      state.loading = false;
      state.note = action.payload;
      state.error = null;
    },
    getNoteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createNoteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createNoteSuccess: (state, action) => {
      state.loading = false;
      state.notes = [...state.notes, action.payload];
      state.success = true;
      state.error = null;
    },
    createNoteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    updateNoteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateNoteSuccess: (state, action) => {
      state.loading = false;
      state.notes = state.notes.map((note) =>
        note._id === action.payload._id ? action.payload : note
      );
      state.success = true;
      state.error = null;
    },
    updateNoteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    deleteNoteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteNoteSuccess: (state, action) => {
      state.loading = false;
      state.notes = state.notes.filter((note) => note._id !== action.payload);
      state.success = true;
      state.error = null;
    },
    deleteNoteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getJournalEntriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getJournalEntriesSuccess: (state, action) => {
      state.loading = false;
      state.journalEntries = action.payload;
      state.error = null;
    },
    getJournalEntriesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearNoteError: (state) => {
      state.error = null;
    },
    resetNoteSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  getNotesStart,
  getNotesSuccess,
  getNotesFail,
  getNoteStart,
  getNoteSuccess,
  getNoteFail,
  createNoteStart,
  createNoteSuccess,
  createNoteFail,
  updateNoteStart,
  updateNoteSuccess,
  updateNoteFail,
  deleteNoteStart,
  deleteNoteSuccess,
  deleteNoteFail,
  getJournalEntriesStart,
  getJournalEntriesSuccess,
  getJournalEntriesFail,
  clearNoteError,
  resetNoteSuccess,
} = noteSlice.actions;

export default noteSlice.reducer;