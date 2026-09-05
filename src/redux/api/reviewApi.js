import { baseApi } from './baseApi';

export const reviewApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getRoomReviews: builder.query({
               query: ({ roomId, ...params }) => ({
                    url: `/reviews/room/${roomId}`,
                    params,
               }),
               providesTags: ['Review'],
          }),

          getAllReviews: builder.query({
               query: (params) => ({
                    url: '/reviews',
                    params,
               }),
               providesTags: ['Review'],
          }),

          addReview: builder.mutation({
               query: ({ roomId, ...data }) => ({
                    url: `/rooms/${roomId}/reviews`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Review', 'Room', 'Dashboard'],
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
     useAddReviewMutation,
     useUpdateReviewStatusMutation,
     useDeleteReviewMutation,
} = reviewApi;
