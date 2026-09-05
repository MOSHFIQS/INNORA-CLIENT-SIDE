import { baseApi } from './baseApi';

export const roomApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getRooms: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/rooms',
                    params,
               }),
               providesTags: ['Room'],
          }),

          getFeaturedRooms: builder.query<any, void | Record<string, any>>({
               query: () => '/rooms/featured',
               providesTags: ['Room'],
          }),

          getHomePageRooms: builder.query<any, void | Record<string, any>>({
               query: () => '/rooms/homepage',
               providesTags: ['Room'],
          }),

          getRoomById: builder.query<any, any>({
               query: (id) => `/rooms/${id}`,
               providesTags: (result, error, id) => [{ type: 'Room', id }],
          }),

          createRoom: builder.mutation({
               query: (data) => ({
                    url: '/rooms',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Room', 'Dashboard'],
          }),

          updateRoom: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/rooms/${id}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => ['Room', { type: 'Room', id }, 'Dashboard'],
          }),

          toggleRoomAvailability: builder.mutation({
               query: (id) => ({
                    url: `/rooms/${id}/toggle-availability`,
                    method: 'PATCH',
               }),
               invalidatesTags: (result, error, id) => ['Room', { type: 'Room', id }, 'Dashboard'],
          }),

          deleteRoom: builder.mutation({
               query: (id) => ({
                    url: `/rooms/${id}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['Room', 'Dashboard'],
          }),
     }),
});

export const {
     useGetRoomsQuery,
     useGetFeaturedRoomsQuery,
     useGetHomePageRoomsQuery,
     useGetRoomByIdQuery,
     useCreateRoomMutation,
     useUpdateRoomMutation,
     useToggleRoomAvailabilityMutation,
     useDeleteRoomMutation,
} = roomApi;
