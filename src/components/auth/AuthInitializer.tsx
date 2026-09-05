'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/redux/store';
import React, { ReactNode, useEffect, useState } from 'react';

interface AuthInitializerProps {
     children: ReactNode;
     skeleton?: ReactNode;
}

/**
 * AuthInitializer shows a skeleton loader while the app checks
 * authentication status on startup (isLoading === true || !mounted).
 *
 * This prevents UI blinking where the navbar or sidebar briefly flashes
 * unauthenticated states or guest roles before the user data is hydrated.
 */
export function AuthInitializer({ children, skeleton }: AuthInitializerProps) {
     const isLoading = useAppSelector((state) => state.auth.isLoading);
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     if (!mounted || isLoading) {
          return skeleton ?? <DashboardSkeleton />;
     }

     return <>{children}</>;
}

function DashboardSkeleton() {
     return (
          <div className="flex min-h-screen bg-gray-100 dark:bg-[#151515]">
               {/* Sidebar Skeleton */}
               <div className="hidden lg:flex w-64 flex-col border-r border-gray-800 bg-[#121212] p-4 gap-4">
                    <div className="flex items-center gap-2 px-2 h-12 border-b border-gray-800">
                         <Skeleton className="h-6 w-32 bg-gray-800" />
                    </div>
                    <div className="space-y-4 pt-2">
                         {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="space-y-2 px-2">
                                   <Skeleton className="h-3 w-20 bg-gray-800" />
                                   <div className="space-y-1.5">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                             <Skeleton key={j} className="h-9 w-full bg-gray-800/60" />
                                        ))}
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               {/* Main Content Area */}
               <div className="flex-1 flex flex-col min-w-0">
                    {/* Header Skeleton */}
                    <header className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 bg-white dark:bg-[#1a1a1a]">
                         <Skeleton className="h-5 w-40" />
                         <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-28" />
                         </div>
                    </header>

                    {/* Content Skeleton */}
                    <div className="flex-1 p-6 md:p-8 space-y-6">
                         <div className="flex justify-between items-center">
                              <Skeleton className="h-8 w-48" />
                              <Skeleton className="h-9 w-32" />
                         </div>

                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                              {Array.from({ length: 4 }).map((_, i) => (
                                   <div key={i} className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1c] space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-16" />
                                   </div>
                              ))}
                         </div>

                         <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1c] p-6 space-y-4">
                              <Skeleton className="h-6 w-36" />
                              <div className="space-y-2">
                                   {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default AuthInitializer;

