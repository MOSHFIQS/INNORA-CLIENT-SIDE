import { baseApi } from './baseApi';

export const reviewApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getRoomReviews: builder.query<any, any>({
               query: ({ roomId, ...params }) => ({
                    url: `/reviews/room/${roomId}`,
                    params,
               }),
               providesTags: ['Review'],
          }),

          getAllReviews: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/reviews',
                    params,
               }),
               providesTags: ['Review'],
          }),

          getMyReviews: builder.query<any, void | Record<string, any>>({
               query: () => '/reviews/my',
               providesTags: ['Review'],
          }),

          getReviewById: builder.query<any, any>({
               query: (id) => `/reviews/${id}`,
               providesTags: (result, error, id) => [{ type: 'Review', id }],
          }),

          addReview: builder.mutation({
               query: ({ roomId, ...data }) => ({
                    url: `/rooms/${roomId}/reviews`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Review', 'Room', 'Dashboard'],
          }),

          createReview: builder.mutation({
               query: (data) => ({
                    url: '/reviews',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Review', 'Room', 'Dashboard'],
          }),

          updateReview: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/reviews/${id}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => ['Review', { type: 'Review', id }, 'Room', 'Dashboard'],
          }),

          updateReviewStatus: builder.mutation({
               query: ({ id, status }) => ({
                    url: `/reviews/${id}/status`,
                    method: 'PATCH',
                    body: { status },
               }),
               invalidatesTags: ['Review', 'Room', 'Dashboard'],
          }),

          deleteReview: builder.mutation({
               query: (id) => ({
                    url: `/reviews/${id}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['Review', 'Room', 'Dashboard'],
          }),
     }),
});

export const {
     useGetRoomReviewsQuery,
     useGetAllReviewsQuery,
     useGetMyReviewsQuery,
     useGetReviewByIdQuery,
     useAddReviewMutation,
     useCreateReviewMutation,
     useUpdateReviewMutation,
     useUpdateReviewStatusMutation,
     useDeleteReviewMutation,
} = reviewApi;
