'use client';

import AuthInitializer from '@/components/auth/AuthInitializer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function DashboardLayout({
     children,
     superadmin,
     admin,
     staff,
     customer,
}) {
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const { isSuperAdmin, isAdmin, isStaff } = useAuth();
     const pathname = usePathname();

     const isRootDashboard = pathname === '/dashboard';

     let roleSlot = customer;
     if (isSuperAdmin) {
          roleSlot = superadmin;
     } else if (isAdmin) {
          roleSlot = admin;
     } else if (isStaff) {
          roleSlot = staff;
     }

     const content = isRootDashboard ? (roleSlot || children) : children;

     return (
          <AuthInitializer>
               <ProtectedRoute>
                    <div className="min-h-screen bg-gray-100 dark:bg-[#151515] flex">
                         {/* Sidebar */}
                         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                         {/* Main Content Area */}
                         <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                              <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                              <main className="p-4 md:p-8 flex-1 flex flex-col">
                                   {content}
                              </main>
                         </div>
                    </div>
               </ProtectedRoute>
          </AuthInitializer>
     );
}

