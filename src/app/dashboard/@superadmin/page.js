'use client';

import Loading from '@/app/loading';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetAdminDashboardQuery } from '@/redux/api/dashboardApi';
import {
     BedDouble,
     CalendarCheck,
     CheckCircle,
     DollarSign,
     MessageSquare,
     Percent,
     PlusCircle,
     Settings,
     Shield,
     Star,
     Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function SuperAdminDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetAdminDashboardQuery();

     if (isLoading) {
          return <Loading />;
     }

     const stats = data?.stats || {
          totalRevenue: 0,
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          occupancyRate: 0,
          totalCustomers: 0,
          totalReviews: 0,
          pendingInquiries: 0,
     };

     const revenueChartData = data?.revenueChartData || [];
     const recentBookings = data?.recentBookings || [];
     const recentReviews = data?.recentReviews || [];

     const maxRev = Math.max(...revenueChartData.map((d) => d.revenue || 0), 1);

     return (
          <div className="space-y-8">
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-neutral-900 to-[#1e1a14] p-6 border border-[#b99d75]/30 text-white shadow-xl">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                              <Shield className="w-5 h-5 text-[#b99d75]" />
                              <span className="text-xs uppercase font-bold tracking-widest text-[#b99d75]">
                                   Super Administrator Command Center
                              </span>
                         </div>
                         <h1 className="text-2xl md:text-3xl font-extrabold font-serif uppercase tracking-wider">
                              Welcome back, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-400 mt-1">
                              Executive overview of global hotel revenue, occupancy rates, and platform operations.
                         </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                         <Link
                              href="/dashboard/rooms"
                              className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs border-none font-bold"
                         >
                              <PlusCircle className="w-3.5 h-3.5 mr-1" />
                              Add New Suite
                         </Link>
                         <Link
                              href="/dashboard/users"
                              className="btn btn-sm rounded-none bg-white/10 hover:bg-white/20 text-white uppercase text-xs border-white/20"
                         >
                              <Users className="w-3.5 h-3.5 mr-1" />
                              Manage Roles
                         </Link>
                    </div>
               </div>

               {/* Key Performance Indicators */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         title="Total Revenue"
                         value={`$${Number(stats.totalRevenue || 0).toLocaleString()}`}
                         icon={DollarSign}
                         trend="+18.4% from last month"
                         color="gold"
                    />
                    <StatCard
                         title="Total Reservations"
                         value={stats.totalBookings}
                         icon={CalendarCheck}
                         trend={`${stats.confirmedBookings || 0} active / ${stats.completedBookings || 0} completed`}
                         color="blue"
                    />
                    <StatCard
                         title="Suite Occupancy"
                         value={`${stats.occupancyRate || 0}%`}
                         icon={Percent}
                         trend={`${stats.occupiedRooms || 0} booked / ${stats.totalRooms || 0} total`}
                         color="green"
                    />
                    <StatCard
                         title="Total Guests"
                         value={stats.totalCustomers}
                         icon={Users}
                         trend={`${stats.pendingInquiries || 0} pending inquiries`}
                         color="purple"
                    />
               </div>

               {/* Secondary Stats Row */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-4">
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Available Suites</p>
                         <p className="text-2xl font-bold font-serif text-[#b99d75] mt-1">{stats.availableRooms}</p>
                    </div>
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-4">
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Total Reviews</p>
                         <p className="text-2xl font-bold font-serif text-blue-500 mt-1">{stats.totalReviews}</p>
                    </div>
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-4">
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Pending Inquiries</p>
                         <p className="text-2xl font-bold font-serif text-amber-500 mt-1">{stats.pendingInquiries}</p>
                    </div>
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-4">
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Cancellations</p>
                         <p className="text-2xl font-bold font-serif text-rose-500 mt-1">{stats.cancelledBookings}</p>
                    </div>
               </div>

               {/* Revenue Trends Chart & Quick Navigation */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 6-Month Revenue Trend */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-6">
                              <div>
                                   <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                        6-Month Revenue Analytics
                                   </h2>
                                   <p className="text-xs text-gray-500">Historical performance by month</p>
                              </div>
                              <span className="text-xs font-bold text-[#b99d75] uppercase tracking-wider">
                                   USD ($)
                              </span>
                         </div>

                         <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 border-b border-gray-100 dark:border-gray-800">
                              {revenueChartData.map((item, idx) => {
                                   const heightPercent = Math.max(10, Math.round((item.revenue / maxRev) * 100));
                                   return (
                                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition duration-200 mb-1">
                                                  ${item.revenue.toLocaleString()}
                                             </span>
                                             <div
                                                  style={{ height: `${heightPercent}%` }}
                                                  className="w-full max-w-[48px] bg-gradient-to-t from-[#8f7551] to-[#b99d75] rounded-t hover:brightness-110 transition-all duration-300 relative"
                                             />
                                             <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-2 uppercase">
                                                  {item.month}
                                             </span>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>

                    {/* Quick Management Actions */}
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
                         <div>
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white mb-1">
                                   Executive Shortcuts
                              </h2>
                              <p className="text-xs text-gray-500 mb-4">Direct control over hotel modules</p>

                              <div className="space-y-2">
                                   <Link
                                        href="/dashboard/rooms"
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#282828] hover:bg-[#b99d75]/10 border border-transparent hover:border-[#b99d75]/30 transition group"
                                   >
                                        <div className="flex items-center gap-3">
                                             <BedDouble className="w-4 h-4 text-[#b99d75]" />
                                             <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                                                  Suites Inventory
                                             </span>
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-[#b99d75]">→</span>
                                   </Link>

                                   <Link
                                        href="/dashboard/bookings"
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#282828] hover:bg-[#b99d75]/10 border border-transparent hover:border-[#b99d75]/30 transition group"
                                   >
                                        <div className="flex items-center gap-3">
                                             <CalendarCheck className="w-4 h-4 text-blue-500" />
                                             <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                                                  Reservations Center
                                             </span>
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-blue-500">→</span>
                                   </Link>

                                   <Link
                                        href="/dashboard/users"
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#282828] hover:bg-[#b99d75]/10 border border-transparent hover:border-[#b99d75]/30 transition group"
                                   >
                                        <div className="flex items-center gap-3">
                                             <Users className="w-4 h-4 text-purple-500" />
                                             <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                                                  Staff & Permissions
                                             </span>
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-purple-500">→</span>
                                   </Link>

                                   <Link
                                        href="/dashboard/settings"
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#282828] hover:bg-[#b99d75]/10 border border-transparent hover:border-[#b99d75]/30 transition group"
                                   >
                                        <div className="flex items-center gap-3">
                                             <Settings className="w-4 h-4 text-emerald-500" />
                                             <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                                                  Site Branding & Banners
                                             </span>
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-emerald-500">→</span>
                                   </Link>
                              </div>
                         </div>

                         <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex items-center justify-between">
                              <span>System Status</span>
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                   <CheckCircle className="w-3.5 h-3.5" /> Operational
                              </span>
                         </div>
                    </div>
               </div>

               {/* Recent Bookings & Reviews */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Bookings Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   Recent Suite Reservations
                              </h2>
                              <Link
                                   href="/dashboard/bookings"
                                   className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                              >
                                   View All
                              </Link>
                         </div>

                         <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                   <thead className="bg-gray-50 dark:bg-[#282828] text-gray-500 uppercase tracking-wider">
                                        <tr>
                                             <th className="p-3">Reservation</th>
                                             <th className="p-3">Guest</th>
                                             <th className="p-3">Dates</th>
                                             <th className="p-3">Amount</th>
                                             <th className="p-3">Status</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {recentBookings.length === 0 ? (
                                             <tr>
                                                  <td colSpan={5} className="p-4 text-center text-gray-400">
                                                       No recent bookings found
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
                                                       <td className="p-3 text-gray-500">
                                                            {b.date}
                                                       </td>
                                                       <td className="p-3 font-bold text-[#b99d75]">
                                                            ${b.totalAmount || b.price}
                                                       </td>
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

                    {/* Latest Guest Reviews */}
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   Latest Guest Feedback
                              </h2>
                              <Link
                                   href="/dashboard/reviews"
                                   className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                              >
                                   Moderate
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
