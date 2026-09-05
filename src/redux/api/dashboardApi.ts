import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getAdminDashboard: builder.query<any, void | Record<string, any>>({
               query: () => '/dashboard/admin',
               providesTags: ['Dashboard'],
          }),

          getCustomerDashboard: builder.query<any, void | Record<string, any>>({
               query: () => '/dashboard/customer',
               providesTags: ['Dashboard'],
          }),
     }),
});

export const {
     useGetAdminDashboardQuery,
     useGetCustomerDashboardQuery,
} = dashboardApi;
