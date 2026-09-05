import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getAdminDashboard: builder.query({
               query: () => '/dashboard/admin',
               providesTags: ['Dashboard'],
          }),

          getCustomerDashboard: builder.query({
               query: () => '/dashboard/customer',
               providesTags: ['Dashboard'],
          }),
     }),
});

export const {
     useGetAdminDashboardQuery,
     useGetCustomerDashboardQuery,
} = dashboardApi;
