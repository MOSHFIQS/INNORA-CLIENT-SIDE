import { baseApi } from './baseApi';

export const inquiryApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getInquiries: builder.query({
               query: (params) => ({
                    url: '/inquiries',
                    params,
               }),
               providesTags: ['Inquiry'],
          }),

          createInquiry: builder.mutation({
               query: (data) => ({
                    url: '/inquiries',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Inquiry', 'Dashboard'],
          }),

          updateInquiryStatus: builder.mutation({
               query: ({ id, status, adminNotes }) => ({
                    url: `/inquiries/${id}/status`,
                    method: 'PATCH',
                    body: { status, adminNotes },
               }),
               invalidatesTags: ['Inquiry', 'Dashboard'],
          }),

          deleteInquiry: builder.mutation({
               query: (id) => ({
                    url: `/inquiries/${id}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['Inquiry', 'Dashboard'],
          }),
     }),
});

export const {
     useGetInquiriesQuery,
     useCreateInquiryMutation,
     useUpdateInquiryStatusMutation,
     useDeleteInquiryMutation,
} = inquiryApi;
