import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getUsers: builder.query({
               query: (params) => ({
                    url: '/users',
                    params,
               }),
               providesTags: ['User'],
          }),

          getUserById: builder.query({
               query: (id) => `/users/${id}`,
               providesTags: (result, error, id) => [{ type: 'User', id }],
          }),

          createUser: builder.mutation({
               query: (data) => ({
                    url: '/users',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['User', 'Dashboard'],
          }),

          updateUser: builder.mutation({
               query: ({ id, ...data }) => ({
                    url: `/users/${id}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }, 'Dashboard'],
          }),

          deleteUser: builder.mutation({
               query: (id) => ({
                    url: `/users/${id}`,
                    method: 'DELETE',
               }),
               invalidatesTags: ['User', 'Dashboard'],
          }),
     }),
});

export const {
     useGetUsersQuery,
     useGetUserByIdQuery,
     useCreateUserMutation,
     useUpdateUserMutation,
     useDeleteUserMutation,
} = userApi;
