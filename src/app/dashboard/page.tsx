'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SuperAdminDashboardPage from './@superadmin/page';
import AdminDashboardPage from './@admin/page';
import StaffDashboardPage from './@staff/page';
import CustomerDashboardPage from './@customer/page';
import Loading from '@/app/loading';

export default function DashboardRootPage() {
     const { user, isSuperAdmin, isAdmin, isStaff, isLoading } = useAuth();

     if (isLoading) {
          return <Loading />;
     }

     if (isSuperAdmin) {
          return <SuperAdminDashboardPage />;
     }

     if (isAdmin) {
          return <AdminDashboardPage />;
     }

     if (isStaff) {
          return <StaffDashboardPage />;
     }

     return <CustomerDashboardPage />;
}
