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
     MessageSquare,
     PlusCircle,
     Star,
     Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AdminDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetAdminDashboardQuery();

     if (isLoading) {
          return <Loading />;
     }

     const stats = data?.stats || {
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          occupancyRate: 0,
          totalReviews: 0,
          pendingInquiries: 0,
     };

     const recentBookings = data?.recentBookings || [];
     const recentReviews = data?.recentReviews || [];

     return (
          <div className="space-y-8">
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#202020] p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div>
                         <p className="text-xs font-bold uppercase tracking-widest text-[#b99d75]">
                              Hotel Operations Dashboard
                         </p>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white mt-1">
                              Welcome, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-500 mt-1">
                              Manage daily reservations, suite occupancy, guest feedback, and front-desk workflows.
                         </p>
                    </div>
                    <div className="flex gap-2">
                         <Link
                              href="/dashboard/rooms"
                              className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs border-none font-bold"
                         >
                              <PlusCircle className="w-3.5 h-3.5 mr-1" />
                              Manage Suites
                         </Link>
                         <Link
                              href="/dashboard/bookings"
                              className="btn btn-sm rounded-none bg-black dark:bg-white/10 hover:bg-gray-800 text-white uppercase text-xs"
                         >
                              <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                              View Bookings
                         </Link>
                    </div>
               </div>

               {/* Metrics Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         title="Active Reservations"
                         value={stats.confirmedBookings || 0}
                         icon={CalendarCheck}
                         trend={`${stats.completedBookings || 0} completed bookings`}
                         color="blue"
                    />
                    <StatCard
                         title="Available Suites"
                         value={stats.availableRooms || 0}
                         icon={BedDouble}
                         trend={`Out of ${stats.totalRooms || 0} total rooms`}
                         color="gold"
                    />
                    <StatCard
                         title="Occupancy Rate"
                         value={`${stats.occupancyRate || 0}%`}
                         icon={Clock}
                         trend={`${stats.occupiedRooms || 0} currently occupied`}
                         color="green"
                    />
                    <StatCard
                         title="Guest Inquiries"
                         value={stats.pendingInquiries || 0}
                         icon={MessageSquare}
                         trend="Pending responses"
                         color="purple"
                    />
               </div>

               {/* Reservations & Reviews */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   Recent Suite Reservations
                              </h2>
                              <Link
                                   href="/dashboard/bookings"
                                   className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                              >
                                   Reservations Center →
                              </Link>
                         </div>

                         <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                   <thead className="bg-gray-50 dark:bg-[#282828] text-gray-500 uppercase tracking-wider">
                                        <tr>
                                             <th className="p-3">Room</th>
                                             <th className="p-3">Guest</th>
                                             <th className="p-3">Stay Dates</th>
                                             <th className="p-3">Status</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {recentBookings.length === 0 ? (
                                             <tr>
                                                  <td colSpan={4} className="p-4 text-center text-gray-400">
                                                       No recent reservations
                                                  </td>
                                             </tr>
                                        ) : (
                                             recentBookings.map((b) => (
                                                  <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-[#252525]">
                                                       <td className="p-3 font-bold text-gray-900 dark:text-white">
                                                            {b.title}
                                                       </td>
                                                       <td className="p-3 text-gray-600 dark:text-gray-300">
                                                            {b.userName || b.userEmail}
                                                       </td>
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
                                                  </tr>
                                             ))
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    </div>

                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   Guest Reviews
                              </h2>
                              <Link
                                   href="/dashboard/reviews"
                                   className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                              >
                                   View All ({stats.totalReviews || 0})
                              </Link>
                         </div>

                         <div className="space-y-3">
                              {recentReviews.length === 0 ? (
                                   <p className="text-xs text-gray-400 text-center py-6">No guest reviews yet.</p>
                              ) : (
                                   recentReviews.slice(0, 4).map((r) => (
                                        <div
                                             key={r.id}
                                             className="p-3 bg-gray-50 dark:bg-[#282828] border border-gray-100 dark:border-gray-800"
                                        >
                                             <div className="flex items-center justify-between mb-1">
                                                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                       {r.userName}
                                                  </span>
                                                  <div className="flex items-center text-amber-500 text-xs">
                                                       <Star className="w-3 h-3 fill-amber-500 mr-1" />
                                                       <span>{r.rating}/5</span>
                                                  </div>
                                             </div>
                                             <p className="text-xs text-gray-500 italic line-clamp-2">
                                                  &ldquo;{r.comment}&rdquo;
                                             </p>
                                        </div>
                                   ))
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}
