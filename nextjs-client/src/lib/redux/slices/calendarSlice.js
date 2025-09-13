import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  event: null,
  dayEvents: [],
  loading: false,
  error: null,
  success: false,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEventsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEventsSuccess: (state, action) => {
      state.loading = false;
      state.events = action.payload;
      state.error = null;
    },
    getEventsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEventSuccess: (state, action) => {
      state.loading = false;
      state.event = action.payload;
      state.error = null;
    },
    getEventFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createEventStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createEventSuccess: (state, action) => {
      state.loading = false;
      state.events = [...state.events, action.payload];
      state.success = true;
      state.error = null;
    },
    createEventFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    updateEventStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateEventSuccess: (state, action) => {
      state.loading = false;
      state.events = state.events.map((event) =>
        event._id === action.payload._id ? action.payload : event
      );
      state.success = true;
      state.error = null;
    },
    updateEventFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    deleteEventStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteEventSuccess: (state, action) => {
      state.loading = false;
      state.events = state.events.filter((event) => event._id !== action.payload);
      state.success = true;
      state.error = null;
    },
    deleteEventFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getDayEventsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDayEventsSuccess: (state, action) => {
      state.loading = false;
      state.dayEvents = action.payload;
      state.error = null;
    },
    getDayEventsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCalendarError: (state) => {
      state.error = null;
    },
    resetCalendarSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  getEventsStart,
  getEventsSuccess,
  getEventsFail,
  getEventStart,
  getEventSuccess,
  getEventFail,
  createEventStart,
  createEventSuccess,
  createEventFail,
  updateEventStart,
  updateEventSuccess,
  updateEventFail,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFail,
  getDayEventsStart,
  getDayEventsSuccess,
  getDayEventsFail,
  clearCalendarError,
  resetCalendarSuccess,
} = calendarSlice.actions;

export default calendarSlice.reducer;