import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: async (headers, { getState }) => {
    // Get token from Redux state or localStorage as fallback
    const token = getState().auth?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
  credentials: 'include',
});

// Base query with automatic token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token might be expired, clear auth state
    api.dispatch({ type: 'auth/logout' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Task', 'Event', 'Note', 'Pomodoro'],
  endpoints: () => ({}),
});