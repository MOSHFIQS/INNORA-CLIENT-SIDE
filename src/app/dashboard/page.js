'use client';

import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetAdminDashboardQuery, useGetCustomerDashboardQuery } from '@/redux/api/dashboardApi';
import {
     BedDouble,
     CalendarCheck,
     DollarSign,
     Percent,
     Star,
     Users,
     MessageSquare,
     PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import Loading from '@/app/loading';

export default function DashboardOverviewPage() {
     const { user, isStaff, isAdmin, isSuperAdmin } = useAuth();
     const router = useRouter();

     const isManagement = isStaff || isAdmin || isSuperAdmin;

     const { data: adminData, isLoading: isAdminLoading } = useGetAdminDashboardQuery(undefined, {
          skip: !isManagement,
     });

     const { data: customerData, isLoading: isCustomerLoading } = useGetCustomerDashboardQuery(undefined, {
          skip: isManagement,
     });

     if (isManagement ? isAdminLoading : isCustomerLoading) {
          return <Loading />;
     }

     if (!isManagement) {
          // CUSTOMER DASHBOARD
          const stats = customerData?.stats || {
               totalBookings: 0,
               confirmedBookings: 0,
               completedBookings: 0,
               totalSpent: 0,
               reviewsCount: 0,
          };
          const recentBookings = customerData?.recentBookings || [];

          return (
               <div className="space-y-8">
                    <div>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              Welcome, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                              Guest Account Overview & Reservation History
                         </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         <StatCard
                              title="Total Reservations"
                              value={stats.totalBookings}
                              subtitle="All time bookings"
                              icon={CalendarCheck}
                         />
                         <StatCard
                              title="Active Stays"
                              value={stats.confirmedBookings}
                              subtitle="Upcoming reservations"
                              icon={BedDouble}
                              color="text-emerald-500"
                         />
                         <StatCard
                              title="Total Stays"
                              value={stats.completedBookings}
                              subtitle="Completed visits"
                              icon={Users}
                         />
                         <StatCard
                              title="Total Spent"
                              value={`$${stats.totalSpent}`}
                              subtitle="Experience investment"
                              icon={DollarSign}
                              color="text-amber-500"
                         />
                    </div>

                    {/* Recent Bookings Section */}
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
                         <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white font-serif">
                                   My Recent Reservations
                              </h2>
                              <Link href="/myBookings" className="text-xs text-[#b99d75] font-bold hover:underline uppercase">
                                   View All ({stats.totalBookings}) →
                              </Link>
                         </div>

                         {recentBookings.length === 0 ? (
                              <div className="text-center py-8 text-xs text-gray-500">
                                   No bookings found yet. Ready to experience INNORA?
                              </div>
                         ) : (
                              <div className="overflow-x-auto">
                                   <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                             <tr>
                                                  <th className="p-3">Reservation #</th>
                                                  <th className="p-3">Suite Title</th>
                                                  <th className="p-3">Arrival Date</th>
                                                  <th className="p-3">Total Amount</th>
                                                  <th className="p-3">Status</th>
                                             </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                             {recentBookings.map((b) => (
                                                  <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                       <td className="p-3 font-bold text-[#b99d75]">{b.bookingNumber}</td>
                                                       <td className="p-3 font-semibold text-gray-900 dark:text-white">{b.title}</td>
                                                       <td className="p-3">{b.date}</td>
                                                       <td className="p-3 font-bold">${b.price || b.totalAmount}</td>
                                                       <td className="p-3">
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                 {b.status}
                                                            </span>
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         )}
                    </div>
               </div>
          );
     }

     // ADMIN / STAFF DASHBOARD
     const stats = adminData?.stats || {
          totalRevenue: 0,
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          occupancyRate: 0,
          totalCustomers: 0,
          totalReviews: 0,
     };
     const revenueChart = adminData?.revenueChartData || [];
     const recentBookings = adminData?.recentBookings || [];

     return (
          <div className="space-y-8">
               {/* Header & Actions */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              Executive Dashboard
                         </h1>
                         <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                              Live Hotel Metrics, Revenue & Real-time Occupancy
                         </p>
                    </div>

                    <div className="flex gap-2">
                         <Link
                              href="/dashboard/rooms"
                              className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1"
                         >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Manage Rooms</span>
                         </Link>
                    </div>
               </div>

               {/* Stat Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         title="Total Revenue"
                         value={`$${stats.totalRevenue.toLocaleString()}`}
                         subtitle="From confirmed reservations"
                         icon={DollarSign}
                         color="text-amber-500"
                    />
                    <StatCard
                         title="Occupancy Rate"
                         value={`${stats.occupancyRate}%`}
                         subtitle={`${stats.occupiedRooms} of ${stats.totalRooms} rooms booked`}
                         icon={Percent}
                         color="text-emerald-500"
                    />
                    <StatCard
                         title="Total Bookings"
                         value={stats.totalBookings}
                         subtitle={`${stats.confirmedBookings} active confirmed`}
                         icon={CalendarCheck}
                         color="text-blue-500"
                    />
                    <StatCard
                         title="Available Suites"
                         value={stats.availableRooms}
                         subtitle="Ready for guest check-in"
                         icon={BedDouble}
                         color="text-[#b99d75]"
                    />
               </div>

               {/* Monthly Revenue Chart Breakdown */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
                         <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white font-serif">
                                   Revenue Performance (Last 6 Months)
                              </h2>
                         </div>

                         <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
                              {revenueChart.map((item, idx) => {
                                   const maxRevenue = Math.max(...revenueChart.map((r) => r.revenue), 1000);
                                   const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 10);
                                   return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                             <span className="text-[10px] font-bold text-[#b99d75]">${item.revenue}</span>
                                             <div
                                                  style={{ height: `${heightPercent}%` }}
                                                  className="w-full bg-[#b99d75] hover:bg-[#a68c65] transition-all rounded-t"
                                             ></div>
                                             <span className="text-[10px] font-bold uppercase text-gray-500">{item.month}</span>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>

                    {/* Room Status Summary */}
                    <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
                         <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white font-serif border-b border-gray-100 dark:border-gray-800 pb-3">
                              Room Inventory Status
                         </h2>
                         <div className="space-y-4 text-xs">
                              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                                   <span className="font-bold text-emerald-800 dark:text-emerald-300">Available</span>
                                   <span className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">{stats.availableRooms}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                                   <span className="font-bold text-amber-800 dark:text-amber-300">Occupied</span>
                                   <span className="font-extrabold text-sm text-amber-800 dark:text-amber-300">{stats.occupiedRooms}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                                   <span className="font-bold text-blue-800 dark:text-blue-300">Total Registered Guests</span>
                                   <span className="font-extrabold text-sm text-blue-800 dark:text-blue-300">{stats.totalCustomers}</span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Recent Bookings Table */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                         <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white font-serif">
                              Recent Hotel Reservations
                         </h2>
                         <Link href="/dashboard/bookings" className="text-xs text-[#b99d75] font-bold hover:underline uppercase">
                              Manage All Bookings →
                         </Link>
                    </div>

                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">Reservation #</th>
                                        <th className="p-3">Guest Name & Email</th>
                                        <th className="p-3">Room / Suite</th>
                                        <th className="p-3">Arrival Date</th>
                                        <th className="p-3">Total Amount</th>
                                        <th className="p-3">Status</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {recentBookings.map((b) => (
                                        <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                             <td className="p-3 font-bold text-[#b99d75]">{b.bookingNumber}</td>
                                             <td className="p-3">
                                                  <div className="font-bold text-gray-900 dark:text-white">{b.userName}</div>
                                                  <div className="text-[10px] text-gray-400">{b.userEmail}</div>
                                             </td>
                                             <td className="p-3 font-semibold">{b.title}</td>
                                             <td className="p-3">{b.date}</td>
                                             <td className="p-3 font-bold">${b.price || b.totalAmount}</td>
                                             <td className="p-3">
                                                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                       {b.status}
                                                  </span>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </div>
          </div>
     );
}
