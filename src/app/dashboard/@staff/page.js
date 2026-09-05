'use client';

import Loading from '@/app/loading';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetAdminDashboardQuery } from '@/redux/api/dashboardApi';
import {
     BedDouble,
     CalendarCheck,
     CheckCircle,
     Clock,
     LogOut,
     MessageSquare,
     PlusCircle,
     UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function StaffDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetAdminDashboardQuery();

     if (isLoading) {
          return <Loading />;
     }

     const stats = data?.stats || {
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          totalRooms: 0,
          pendingInquiries: 0,
     };

     const recentBookings = data?.recentBookings || [];

     return (
          <div className="space-y-8">
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#202020] p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div>
                         <p className="text-xs font-bold uppercase tracking-widest text-[#b99d75]">
                              Front-Desk Concierge Portal
                         </p>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white mt-1">
                              Staff Console — {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-500 mt-1">
                              Check-in arrivals, verify guest reservations, monitor room statuses, and assist guests.
                         </p>
                    </div>
                    <div className="flex gap-2">
                         <Link
                              href="/dashboard/bookings"
                              className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs border-none font-bold"
                         >
                              <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                              Front Desk Bookings
                         </Link>
                         <Link
                              href="/dashboard/rooms"
                              className="btn btn-sm rounded-none bg-black dark:bg-white/10 hover:bg-gray-800 text-white uppercase text-xs"
                         >
                              <BedDouble className="w-3.5 h-3.5 mr-1" />
                              Room Availability
                         </Link>
                    </div>
               </div>

               {/* Metrics */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         title="Confirmed Reservations"
                         value={stats.confirmedBookings || 0}
                         icon={CalendarCheck}
                         trend="Arrivals & active stays"
                         color="blue"
                    />
                    <StatCard
                         title="Ready for Check-In"
                         value={stats.availableRooms || 0}
                         icon={BedDouble}
                         trend={`Out of ${stats.totalRooms || 0} suites`}
                         color="green"
                    />
                    <StatCard
                         title="In-House Stays"
                         value={stats.occupiedRooms || 0}
                         icon={UserCheck}
                         trend="Occupied suites"
                         color="gold"
                    />
                    <StatCard
                         title="Guest Inquiries"
                         value={stats.pendingInquiries || 0}
                         icon={MessageSquare}
                         trend="Needs attention"
                         color="purple"
                    />
               </div>

               {/* Quick Front Desk Actions */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              Arrivals & Front-Desk Log
                         </h2>
                         <Link
                              href="/dashboard/bookings"
                              className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                         >
                              Open Full Reservations Desk →
                         </Link>
                    </div>

                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs">
                              <thead className="bg-gray-50 dark:bg-[#282828] text-gray-500 uppercase tracking-wider">
                                   <tr>
                                        <th className="p-3">Suite</th>
                                        <th className="p-3">Guest Name</th>
                                        <th className="p-3">Guest Email</th>
                                        <th className="p-3">Stay Dates</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {recentBookings.length === 0 ? (
                                        <tr>
                                             <td colSpan={6} className="p-4 text-center text-gray-400">
                                                  No pending arrivals found
                                             </td>
                                        </tr>
                                   ) : (
                                        recentBookings.map((b) => (
                                             <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-[#252525]">
                                                  <td className="p-3 font-bold text-gray-900 dark:text-white">
                                                       {b.title}
                                                  </td>
                                                  <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">
                                                       {b.userName || 'Guest'}
                                                  </td>
                                                  <td className="p-3 text-gray-500">{b.userEmail}</td>
                                                  <td className="p-3 text-gray-500">{b.date}</td>
                                                  <td className="p-3">
                                                       <span
                                                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                                                 b.status === 'CONFIRMED'
                                                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                      : b.status === 'CANCELLED'
                                                                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                                                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                            }`}
                                                       >
                                                            {b.status}
                                                       </span>
                                                  </td>
                                                  <td className="p-3 text-right">
                                                       <Link
                                                            href="/dashboard/bookings"
                                                            className="btn btn-xs rounded-none bg-gray-100 dark:bg-[#333] hover:bg-[#b99d75] hover:text-white border-none text-[10px] font-bold uppercase"
                                                       >
                                                            Manage
                                                       </Link>
                                                  </td>
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>
          </div>
     );
}
