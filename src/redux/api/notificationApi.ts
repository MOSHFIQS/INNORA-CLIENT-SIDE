import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getNotifications: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/notifications',
                    params,
               }),
               providesTags: ['Notification'],
          }),

          getUnreadCount: builder.query<any, void | Record<string, any>>({
               query: () => '/notifications/unread-count',
               providesTags: ['Notification'],
          }),

          markNotificationAsRead: builder.mutation({
               query: (id) => ({
                    url: `/notifications/${id}/read`,
                    method: 'PATCH',
               }),
               invalidatesTags: ['Notification'],
          }),

          markAllNotificationsAsRead: builder.mutation<any, void>({
               query: () => ({
                    url: '/notifications/read-all',
                    method: 'PATCH',
               }),
               invalidatesTags: ['Notification'],
          }),

          sendNotification: builder.mutation({
               query: (data) => ({
                    url: '/notifications',
                    method: 'POST',
                    body: data,
               }),
               invalidatesTags: ['Notification'],
          }),
     }),
});

export const {
     useGetNotificationsQuery,
     useGetUnreadCountQuery,
     useMarkNotificationAsReadMutation,
     useMarkAllNotificationsAsReadMutation,
     useSendNotificationMutation,
} = notificationApi;
