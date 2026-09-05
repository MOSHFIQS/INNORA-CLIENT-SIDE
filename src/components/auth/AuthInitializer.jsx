'use client';

import { useEffect } from 'react';
import { useGetMeQuery } from '@/redux/api/authApi';

export default function AuthInitializer({ children }) {
     // Automatically fetches /auth/me on app mount (with HttpOnly cookie)
     const { isLoading } = useGetMeQuery(undefined, {
          refetchOnMountOrArgChange: false,
          refetchOnFocus: false,
     });

     return <>{children}</>;
}
