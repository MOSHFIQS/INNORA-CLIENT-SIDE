'use client';

import React from 'react';
import Loading from '@/app/loading';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { ChartCard, DonutChart, RadialGauge } from '@/components/shared/DashboardCharts';
import { useAuth } from '@/hooks/useAuth';
import { useGetAdminDashboardQuery } from '@/redux/api/dashboardApi';
import {
     BedDouble,
     CalendarCheck,
     CheckCircle,
     Clock,
     MessageSquare,
     Sparkles,
     ArrowRight,
     Eye,
     Sliders,
     Edit3,
} from 'lucide-react';
import Link from 'next/link';

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
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          maintenanceRooms: 0,
          occupancyRate: 0,
          pendingInquiries: 0,
     };

     const recentBookings = data?.recentBookings || [];

     const roomStatusDonut = [
          { label: 'Available', value: stats.availableRooms || 0, color: '#10b981' },
          { label: 'Occupied', value: stats.occupiedRooms || 0, color: '#0ea5e9' },
          { label: 'Maintenance / Cleaning', value: stats.maintenanceRooms || 0, color: '#f59e0b' },
     ];

     return (
          <div className="space-y-6">
               {/* Welcome Banner */}
               <div className="bg-gradient-to-r from-gray-900 via-neutral-900 to-[#1e1a14] p-6 md:p-8 border border-[#b99d75]/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                         <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#b99d75]/20 border border-[#b99d75]/40 text-[#b99d75] text-[11px] font-bold uppercase tracking-widest">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Front Desk & Guest Operations</span>
                         </div>
                         <h1 className="text-2xl md:text-3xl font-bold font-serif uppercase tracking-wider">
                              Welcome on duty, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-400">
                              Manage guest arrivals, departures, suite turnover, and concierge communications.
                         </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                         <Link
                              href="/dashboard/bookings"
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition"
                         >
                              <CalendarCheck className="w-4 h-4" />
                              <span>Front Desk Check-In</span>
                         </Link>
                         <Link
                              href="/dashboard/rooms"
                              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition"
                         >
                              <BedDouble className="w-4 h-4" />
                              <span>Room Status</span>
                         </Link>
                    </div>
               </div>

               {/* Staff KPI Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                         title="Active Stays"
                         value={stats.confirmedBookings}
                         subtitle="Checked-in & confirmed"
                         icon={CalendarCheck}
                         color="emerald"
                         href="/dashboard/bookings"
                    />
                    <StatsCard
                         title="Available Suites"
                         value={stats.availableRooms}
                         subtitle={`Out of ${stats.totalRooms} total rooms`}
                         icon={BedDouble}
                         color="gold"
                         href="/dashboard/rooms"
                    />
                    <StatsCard
                         title="Turnover / Maint."
                         value={stats.maintenanceRooms}
                         subtitle="Suites requiring housekeeping"
                         icon={Clock}
                         color="amber"
                         href="/dashboard/rooms"
                    />
                    <StatsCard
                         title="Guest Inquiries"
                         value={stats.pendingInquiries}
                         subtitle="Concierge assistance requests"
                         icon={MessageSquare}
                         color="blue"
                         href="/dashboard/inquiries"
                    />
               </div>

               {/* Operations Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Front Desk Recent Bookings */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs">
                         <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <div>
                                   <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                        Today&apos;s Guest Roster
                                   </h3>
                                   <p className="text-[11px] text-gray-500 mt-0.5">
                                        Check-in, check-out, and active suite allocations
                                   </p>
                              </div>
                              <Link
                                   href="/dashboard/bookings"
                                   className="inline-flex items-center gap-1 text-xs font-bold text-[#b99d75] hover:underline uppercase tracking-wider"
                              >
                                   <span>Full Roster</span>
                                   <ArrowRight className="w-3 h-3" />
                              </Link>
                         </div>

                         <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                                   <thead className="bg-gray-50 dark:bg-gray-900/60 uppercase text-[10px] font-bold text-gray-500">
                                        <tr>
                                             <th className="p-3.5">Ref #</th>
                                             <th className="p-3.5">Guest & Suite</th>
                                             <th className="p-3.5">Scheduled Date</th>
                                             <th className="p-3.5">Status</th>
                                             <th className="p-3.5 text-right">Action</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {recentBookings.length === 0 ? (
                                             <tr>
                                                  <td colSpan={5} className="p-8 text-center text-gray-400">
                                                       No guest arrivals recorded for today.
                                                  </td>
                                             </tr>
                                        ) : (
                                             recentBookings.map((b) => (
                                                  <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                                       <td className="p-3.5 font-bold font-mono text-[#b99d75]">
                                                            <Link href={`/dashboard/bookings/${b.id || b._id}`} className="hover:underline">
                                                                 #{b.bookingNumber || (b.id || b._id).toString().slice(-6)}
                                                            </Link>
                                                       </td>
                                                       <td className="p-3.5">
                                                            <strong className="text-gray-900 dark:text-white block truncate max-w-[170px]">
                                                                 {b.name || b.user?.fullName || b.email}
                                                            </strong>
                                                            <span className="text-[10px] text-gray-400 truncate block">
                                                                 {b.title || b.room?.title}
                                                            </span>
                                                       </td>
                                                       <td className="p-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                            {b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A')}
                                                       </td>
                                                       <td className="p-3.5 whitespace-nowrap">
                                                            <StatusBadge status={b.status} />
                                                       </td>
                                                       <td className="p-3.5 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                 <Link
                                                                      href={`/dashboard/bookings/${b.id || b._id}`}
                                                                      className="p-1 text-gray-500 hover:text-[#b99d75] transition cursor-pointer inline-flex items-center"
                                                                      title="View Voucher"
                                                                 >
                                                                      <Eye className="w-3.5 h-3.5" />
                                                                 </Link>
                                                                 <Link
                                                                      href={`/dashboard/bookings/${b.id || b._id}/edit`}
                                                                      className="px-2 py-1 bg-[#b99d75]/15 hover:bg-[#b99d75] text-[#b99d75] hover:text-white text-[10px] font-bold uppercase transition cursor-pointer inline-flex items-center gap-1"
                                                                 >
                                                                      <Edit3 className="w-3 h-3" />
                                                                      <span>Update</span>
                                                                 </Link>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             ))
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    </div>

                    {/* Room Status Gauge & Breakdown */}
                    <div className="space-y-6">
                         <ChartCard
                              title="Hotel Occupancy"
                              subtitle="Live suite distribution"
                         >
                              <RadialGauge value={stats.occupancyRate} label="Occupancy Rate" color="#b99d75" />
                         </ChartCard>

                         <ChartCard
                              title="Housekeeping Status"
                              subtitle="Rooms status breakdown"
                         >
                              <DonutChart data={roomStatusDonut} size={150} />
                         </ChartCard>
                    </div>
               </div>
          </div>
     );
}
