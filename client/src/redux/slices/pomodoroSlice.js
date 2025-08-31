import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSession: null,
  recentSessions: [],
  stats: null,
  loading: false,
  error: null,
  success: false,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    startPomodoroStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    startPomodoroSuccess: (state, action) => {
      state.loading = false;
      state.activeSession = action.payload;
      state.success = true;
      state.error = null;
    },
    startPomodoroFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    completePomodoroStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    completePomodoroSuccess: (state, action) => {
      state.loading = false;
      state.activeSession = null;
      state.recentSessions = [action.payload, ...state.recentSessions.slice(0, 9)];
      state.success = true;
      state.error = null;
    },
    completePomodoroFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    interruptPomodoroStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    interruptPomodoroSuccess: (state, action) => {
      state.loading = false;
      state.activeSession = null;
      state.recentSessions = [action.payload, ...state.recentSessions.slice(0, 9)];
      state.success = true;
      state.error = null;
    },
    interruptPomodoroFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getPomodoroStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPomodoroStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    },
    getPomodoroStatsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRecentPomodorosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRecentPomodorosSuccess: (state, action) => {
      state.loading = false;
      state.recentSessions = action.payload;
      state.error = null;
    },
    getRecentPomodorosFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearPomodoroError: (state) => {
      state.error = null;
    },
    resetPomodoroSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  startPomodoroStart,
  startPomodoroSuccess,
  startPomodoroFail,
  completePomodoroStart,
  completePomodoroSuccess,
  completePomodoroFail,
  interruptPomodoroStart,
  interruptPomodoroSuccess,
  interruptPomodoroFail,
  getPomodoroStatsStart,
  getPomodoroStatsSuccess,
  getPomodoroStatsFail,
  getRecentPomodorosStart,
  getRecentPomodorosSuccess,
  getRecentPomodorosFail,
  clearPomodoroError,
  resetPomodoroSuccess,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;