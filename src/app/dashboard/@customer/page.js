'use client';

import Loading from '@/app/loading';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetCustomerDashboardQuery } from '@/redux/api/dashboardApi';
import {
     BedDouble,
     CalendarCheck,
     CheckCircle,
     DollarSign,
     Heart,
     MapPin,
     Sparkles,
     Star,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CustomerDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetCustomerDashboardQuery();

     if (isLoading) {
          return <Loading />;
     }

     const stats = data?.stats || {
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          totalSpent: 0,
          reviewsCount: 0,
     };

     const recentBookings = data?.recentBookings || [];

     return (
          <div className="space-y-8">
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 via-stone-900 to-[#1e1a14] p-6 border border-[#b99d75]/30 text-white shadow-xl">
                    <div>
                         <div className="flex items-center gap-2 mb-1 text-[#b99d75]">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-xs uppercase font-bold tracking-widest">
                                   INNORA Guest Hospitality Portal
                              </span>
                         </div>
                         <h1 className="text-2xl md:text-3xl font-bold font-serif uppercase tracking-wider">
                              Welcome, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-400 mt-1">
                              Manage your suite reservations, review past luxury stays, and explore tailored amenities.
                         </p>
                    </div>
                    <Link
                         href="/rooms"
                         className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs border-none font-bold shadow-lg"
                    >
                         <BedDouble className="w-3.5 h-3.5 mr-1" />
                         Browse Luxury Suites
                    </Link>
               </div>

               {/* Key Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         title="Active Bookings"
                         value={stats.confirmedBookings || 0}
                         icon={CalendarCheck}
                         trend="Upcoming hotel stays"
                         color="gold"
                    />
                    <StatCard
                         title="Completed Stays"
                         value={stats.completedBookings || 0}
                         icon={CheckCircle}
                         trend="Past memorable visits"
                         color="green"
                    />
                    <StatCard
                         title="Total Investment"
                         value={`$${Number(stats.totalSpent || 0).toLocaleString()}`}
                         icon={DollarSign}
                         trend="Lifetime stay expenditure"
                         color="blue"
                    />
                    <StatCard
                         title="Reviews Given"
                         value={stats.reviewsCount || 0}
                         icon={Star}
                         trend="Shared guest experiences"
                         color="purple"
                    />
               </div>

               {/* My Reservations Table */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                         <div>
                              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   My Recent Reservations
                              </h2>
                              <p className="text-xs text-gray-500">Track check-in dates and manage reservations</p>
                         </div>
                         <Link
                              href="/myBookings"
                              className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                         >
                              View All in Reservation History →
                         </Link>
                    </div>

                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs">
                              <thead className="bg-gray-50 dark:bg-[#282828] text-gray-500 uppercase tracking-wider">
                                   <tr>
                                        <th className="p-3">Suite Name</th>
                                        <th className="p-3">Reserved Dates</th>
                                        <th className="p-3">Total Amount</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {recentBookings.length === 0 ? (
                                        <tr>
                                             <td colSpan={5} className="p-6 text-center text-gray-400">
                                                  You have no active bookings. Discover our oceanfront suites to book your next stay!
                                             </td>
                                        </tr>
                                   ) : (
                                        recentBookings.map((b) => (
                                             <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-[#252525]">
                                                  <td className="p-3 font-bold text-gray-900 dark:text-white">
                                                       {b.title}
                                                  </td>
                                                  <td className="p-3 text-gray-500">{b.date}</td>
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
                                                  <td className="p-3 text-right">
                                                       <Link
                                                            href="/myBookings"
                                                            className="btn btn-xs rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white border-none text-[10px] uppercase font-bold"
                                                       >
                                                            Manage Booking
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
