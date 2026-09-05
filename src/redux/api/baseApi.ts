import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth } from '../slices/authSlice';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const rawBaseQuery = fetchBaseQuery({
     baseUrl: API_BASE,
     credentials: 'include',
});

const baseQuery = async (args: any, api: any, extraOptions: any) => {
     let result = await rawBaseQuery(args, api, extraOptions);

     if (result.error && result.error.status === 401) {
          api.dispatch(clearAuth());
     }

     if (result.data && typeof result.data === 'object' && 'data' in result.data) {
          return { data: (result.data as any).data };
     }

     if (result.error) {
          const errorData = result.error.data as any;
          let errorMessage = errorData?.message || 'An error occurred';
          if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
               const details = errorData.errors
                    .map((e: any) => (typeof e === 'string' ? e : e?.message))
                    .filter(Boolean)
                    .join('; ');
               if (details) {
                    errorMessage = details;
               }
          }
          (result.error as any).message = errorMessage;
     }

     return result;
};

export const baseApi = createApi({
     reducerPath: 'api',
     baseQuery,
     keepUnusedDataFor: 60,
     tagTypes: [
          'User',
          'Room',
          'Booking',
          'Review',
          'Notification',
          'Inquiry',
          'Dashboard',
          'Setting',
          'Banner',
          'AuditLog',
     ],
     endpoints: () => ({}),
});
