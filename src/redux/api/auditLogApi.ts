import { baseApi } from './baseApi';

export const auditLogApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          getAuditLogs: builder.query<any, void | Record<string, any>>({
               query: (params) => ({
                    url: '/audit-logs',
                    params,
               }),
               providesTags: ['AuditLog'],
          }),

          getAuditLogById: builder.query<any, any>({
               query: (id) => `/audit-logs/${id}`,
               providesTags: (result, error, id) => [{ type: 'AuditLog', id }],
          }),
     }),
});

export const { useGetAuditLogsQuery, useGetAuditLogByIdQuery } = auditLogApi;
