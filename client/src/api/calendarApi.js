import { api } from './apiSlice';

export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.eventType) queryParams.append('eventType', params.eventType);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        
        return `/calendar?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Event', id: _id })),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
    }),
    getEvent: builder.query({
      query: (id) => `/calendar/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/calendar',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `/calendar/${id}`,
        method: 'PUT',
        body: eventData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/calendar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    getDayEvents: builder.query({
      query: (date) => `/calendar/day/${date}`,
      providesTags: [{ type: 'Event', id: 'DAY' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetDayEventsQuery,
} = calendarApi;