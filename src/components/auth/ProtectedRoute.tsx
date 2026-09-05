'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
     const { user, isAuthenticated, isLoading } = useAuth();
     const router = useRouter();

     useEffect(() => {
          if (!isLoading && !isAuthenticated) {
               router.push('/signin');
          } else if (!isLoading && isAuthenticated && allowedRoles.length > 0) {
               if (user?.role !== 'SUPER_ADMIN' && !allowedRoles.includes(user?.role)) {
                    router.push('/');
               }
          }
     }, [isAuthenticated, isLoading, user, router, allowedRoles]);

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#b99d75]" />
               </div>
          );
     }

     if (!isAuthenticated) {
          return null;
     }

     if (allowedRoles.length > 0 && user?.role !== 'SUPER_ADMIN' && !allowedRoles.includes(user?.role)) {
          return (
               <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Access Restricted</h2>
                    <p className="text-gray-600 dark:text-gray-300">You do not have permission to access this area.</p>
               </div>
          );
     }

     return <>{children}</>;
}
