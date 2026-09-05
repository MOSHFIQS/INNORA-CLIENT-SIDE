import { baseApi } from './baseApi';
import { setUser, clearAuth } from '../slices/authSlice';

export const authApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          login: builder.mutation({
               query: (credentials) => ({
                    url: '/auth/login',
                    method: 'POST',
                    body: credentials,
               }),
               async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                         const { data } = await queryFulfilled;
                         if (data?.user) {
                              dispatch(setUser(data.user));
                         }
                    } catch (err) {
                         // handled in component
                    }
               },
               invalidatesTags: ['User', 'Booking', 'Dashboard', 'Notification'],
          }),

          register: builder.mutation({
               query: (userData) => ({
                    url: '/auth/register',
                    method: 'POST',
                    body: userData,
               }),
               async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                         const { data } = await queryFulfilled;
                         if (data?.user) {
                              dispatch(setUser(data.user));
                         }
                    } catch (err) {
                         // handled in component
                    }
               },
               invalidatesTags: ['User'],
          }),

          logout: builder.mutation<any, void>({
               query: () => ({
                    url: '/auth/logout',
                    method: 'POST',
               }),
               async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                         await queryFulfilled;
                         dispatch(clearAuth());
                         dispatch(baseApi.util.resetApiState());
                    } catch {
                         dispatch(clearAuth());
                    }
               },
          }),

          getMe: builder.query<any, void | Record<string, any>>({
               query: () => '/auth/me',
               providesTags: ['User'],
               async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                         const { data } = await queryFulfilled;
                         if (data) {
                              dispatch(setUser(data));
                         }
                    } catch {
                         dispatch(clearAuth());
                    }
               },
          }),

          getProfile: builder.query<any, void | Record<string, any>>({
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
