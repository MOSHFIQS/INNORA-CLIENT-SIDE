import { baseApi } from './baseApi';

export const inquiryApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getInquiries: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/inquiries',
                    params,
               }),
               providesTags: ['Inquiry'],
          }),

          getMyInquiries: builder.query<any, void | Record<string, any>>({
               query: () => '/inquiries/my',
               providesTags: ['Inquiry'],
          }),

          getInquiryById: builder.query<any, any>({
               query: (id) => `/inquiries/${id}`,
               providesTags: (result, error, id) => [{ type: 'Inquiry', id }],
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
     useGetMyInquiriesQuery,
     useGetInquiryByIdQuery,
     useCreateInquiryMutation,
     useUpdateInquiryStatusMutation,
     useDeleteInquiryMutation,
} = inquiryApi;
