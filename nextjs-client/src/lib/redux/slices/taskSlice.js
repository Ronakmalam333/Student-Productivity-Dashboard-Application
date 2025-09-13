import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  task: null,
  upcomingTasks: [],
  overdueTasks: [],
  loading: false,
  error: null,
  success: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    getTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTasksSuccess: (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
      state.error = null;
    },
    getTasksFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getTaskStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTaskSuccess: (state, action) => {
      state.loading = false;
      state.task = action.payload;
      state.error = null;
    },
    getTaskFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createTaskSuccess: (state, action) => {
      state.loading = false;
      state.tasks = [...state.tasks, action.payload];
      state.success = true;
      state.error = null;
    },
    createTaskFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    updateTaskStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateTaskSuccess: (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
      state.success = true;
      state.error = null;
    },
    updateTaskFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    deleteTaskStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteTaskSuccess: (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      state.success = true;
      state.error = null;
    },
    deleteTaskFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getUpcomingTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUpcomingTasksSuccess: (state, action) => {
      state.loading = false;
      state.upcomingTasks = action.payload;
      state.error = null;
    },
    getUpcomingTasksFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getOverdueTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getOverdueTasksSuccess: (state, action) => {
      state.loading = false;
      state.overdueTasks = action.payload;
      state.error = null;
    },
    getOverdueTasksFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
    resetTaskSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  getTasksStart,
  getTasksSuccess,
  getTasksFail,
  getTaskStart,
  getTaskSuccess,
  getTaskFail,
  createTaskStart,
  createTaskSuccess,
  createTaskFail,
  updateTaskStart,
  updateTaskSuccess,
  updateTaskFail,
  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFail,
  getUpcomingTasksStart,
  getUpcomingTasksSuccess,
  getUpcomingTasksFail,
  getOverdueTasksStart,
  getOverdueTasksSuccess,
  getOverdueTasksFail,
  clearTaskError,
  resetTaskSuccess,
} = taskSlice.actions;

export default taskSlice.reducer;