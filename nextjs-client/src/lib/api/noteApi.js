import { api } from './apiSlice';

export const noteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.isJournal !== undefined) queryParams.append('isJournal', params.isJournal);
        if (params?.tags) queryParams.append('tags', params.tags);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        
        return `/notes?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Note', id: _id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),
    getNote: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
    createNote: builder.mutation({
      query: (noteData) => ({
        url: '/notes',
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...noteData }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: noteData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
    getJournalEntries: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        
        return `/notes/journal?${queryParams.toString()}`;
      },
      providesTags: [{ type: 'Note', id: 'JOURNAL' }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetJournalEntriesQuery,
} = noteApi;