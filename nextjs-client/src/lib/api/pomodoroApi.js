import { api } from './apiSlice';

export const pomodoroApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startPomodoro: builder.mutation({
      query: (pomodoroData) => ({
        url: '/pomodoro/start',
        method: 'POST',
        body: pomodoroData,
      }),
      invalidatesTags: [{ type: 'Pomodoro', id: 'ACTIVE' }],
    }),
    completePomodoro: builder.mutation({
      query: (id) => ({
        url: `/pomodoro/${id}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'Pomodoro', id: 'ACTIVE' },
        { type: 'Pomodoro', id: 'RECENT' },
        { type: 'Pomodoro', id: 'STATS' },
      ],
    }),
    interruptPomodoro: builder.mutation({
      query: (id) => ({
        url: `/pomodoro/${id}/interrupt`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'Pomodoro', id: 'ACTIVE' },
        { type: 'Pomodoro', id: 'RECENT' },
        { type: 'Pomodoro', id: 'STATS' },
      ],
    }),
    getPomodoroStats: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        
        return `/pomodoro/stats?${queryParams.toString()}`;
      },
      providesTags: [{ type: 'Pomodoro', id: 'STATS' }],
    }),
    getRecentPomodoros: builder.query({
      query: (limit = 10) => `/pomodoro/recent?limit=${limit}`,
      providesTags: [{ type: 'Pomodoro', id: 'RECENT' }],
    }),
  }),
});

export const {
  useStartPomodoroMutation,
  useCompletePomodoroMutation,
  useInterruptPomodoroMutation,
  useGetPomodoroStatsQuery,
  useGetRecentPomodorosQuery,
} = pomodoroApi;