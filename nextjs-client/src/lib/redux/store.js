import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import calendarReducer from './slices/calendarSlice';
import noteReducer from './slices/noteSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import { api } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    calendar: calendarReducer,
    notes: noteReducer,
    pomodoro: pomodoroReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store;