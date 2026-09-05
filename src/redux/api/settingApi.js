import { baseApi } from './baseApi';

export const settingApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getSettings: builder.query({
               query: () => '/settings',
               providesTags: ['Setting'],
          }),

          updateSettings: builder.mutation({
               query: (data) => ({
                    url: '/settings',
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Setting'],
          }),

          getBanners: builder.query({
               query: () => '/settings/banners',
               providesTags: ['Banner'],
          }),

          createBanner: builder.mutation({
               query: (data) => ({
                    url: '/settings/banners',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Banner'],
          }),

          updateBanner: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/settings/banners/${id}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['Banner'],
          }),

          deleteBanner: builder.mutation({
               query: (id) => ({
                    url: `/settings/banners/${id}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['Banner'],
          }),

          getHotelServices: builder.query({
               query: () => '/settings/services',
               providesTags: ['Setting'],
          }),
     }),
});

export const {
     useGetSettingsQuery,
     useUpdateSettingsMutation,
     useGetBannersQuery,
     useCreateBannerMutation,
     useUpdateBannerMutation,
     useDeleteBannerMutation,
     useGetHotelServicesQuery,
} = settingApi;
