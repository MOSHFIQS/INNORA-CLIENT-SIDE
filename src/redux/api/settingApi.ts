import { baseApi } from './baseApi';

export const settingApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getSettings: builder.query<any, void | Record<string, any>>({
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

          getBanners: builder.query<any, void | Record<string, any>>({
               query: () => '/settings/banners',
               providesTags: ['Banner'],
          }),

          getBannerById: builder.query<any, any>({
               query: (id) => `/settings/banners/${id}`,
               providesTags: (result, error, id) => [{ type: 'Banner', id }],
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

          getHotelServices: builder.query<any, void | Record<string, any>>({
               query: () => '/settings/services',
               providesTags: ['Setting'],
          }),
     }),
});

export const {
     useGetSettingsQuery,
     useUpdateSettingsMutation,
     useGetBannersQuery,
     useGetBannerByIdQuery,
     useCreateBannerMutation,
     useUpdateBannerMutation,
     useDeleteBannerMutation,
     useGetHotelServicesQuery,
} = settingApi;
