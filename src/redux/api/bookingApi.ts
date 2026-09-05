import { baseApi } from './baseApi';

export const bookingApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getMyBookings: builder.query<any, void | Record<string, any>>({
               query: () => '/bookings/my',
               providesTags: ['Booking'],
          }),

          getAllBookings: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/bookings/all',
                    params,
               }),
               providesTags: ['Booking'],
          }),

          getBookingById: builder.query<any, any>({
               query: (id) => `/bookings/${id}`,
               providesTags: (result, error, id) => [{ type: 'Booking', id }],
          }),

          createBooking: builder.mutation({
               query: (data) => ({
                    url: '/bookings',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Booking', 'Room', 'Dashboard', 'Notification'],
          }),

          updateBookingDate: builder.mutation({
               query: (data) => ({
                    url: '/bookings/update',
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Booking', 'Room', 'Dashboard'],
          }),

          cancelBooking: builder.mutation({
               query: ({ idOrEmail, ...data }) => ({
                    url: `/bookings/${idOrEmail}`,
                    method: 'DELETE',
                    body: data,
               }),
               invalidatesTags: ['Booking', 'Room', 'Dashboard', 'Notification'],
          }),

          updateBookingStatus: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/bookings/${id}/status`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Booking', 'Room', 'Dashboard', 'Notification'],
          }),

          updateBooking: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/bookings/${id}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => ['Booking', { type: 'Booking', id }, 'Room', 'Dashboard'],
          }),
     }),
});

export const {
     useGetMyBookingsQuery,
     useGetAllBookingsQuery,
     useGetBookingByIdQuery,
     useCreateBookingMutation,
     useUpdateBookingDateMutation,
     useCancelBookingMutation,
     useUpdateBookingStatusMutation,
     useUpdateBookingMutation,
} = bookingApi;
