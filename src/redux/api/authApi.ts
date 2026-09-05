import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          login: builder.mutation({
               query: (credentials) => ({
                    url: '/auth/login',
                    method: 'POST',
                    body: credentials,
               }),
               invalidatesTags: ['User'],
          }),

          register: builder.mutation({
               query: (userData) => ({
                    url: '/auth/register',
                    method: 'POST',
                    body: userData,
               }),
          }),

          logout: builder.mutation<{ message: string }, void>({
               query: () => ({
                    url: '/auth/logout',
                    method: 'POST',
               }),
          }),

          getMe: builder.query<any, void>({
               query: () => '/auth/me',
               providesTags: ['User'],
          }),

          getProfile: builder.query<any, void>({
               query: () => '/auth/me',
               providesTags: ['User'],
          }),

          updateProfile: builder.mutation({
               query: (data) => ({
                    url: '/auth/profile',
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['User'],
          }),

          changePassword: builder.mutation({
               query: (data) => ({
                    url: '/auth/change-password',
                    method: 'PATCH',
                    body: data,
               }),
          }),
     }),
});

export const {
     useLoginMutation,
     useRegisterMutation,
     useLogoutMutation,
     useGetMeQuery,
     useGetProfileQuery,
     useUpdateProfileMutation,
     useChangePasswordMutation,
} = authApi;

