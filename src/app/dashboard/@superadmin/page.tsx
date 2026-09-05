'use client';

import React from 'react';
import Loading from '@/app/loading';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import PageHeader from '@/components/shared/PageHeader';
import { ChartCard, AreaChart, DonutChart, RadialGauge } from '@/components/shared/DashboardCharts';
import { useAuth } from '@/hooks/useAuth';
import { useGetAdminDashboardQuery } from '@/redux/api/dashboardApi';
import { useUpdateReviewStatusMutation } from '@/redux/api/reviewApi';
import {
     BedDouble,
     CalendarCheck,
     CheckCircle,
     DollarSign,
     MessageSquare,
     PlusCircle,
     Shield,
     Star,
     Users,
     ArrowRight,
     Eye,
     Sliders,
     Edit3,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SuperAdminDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetAdminDashboardQuery();
     const [updateReviewStatus] = useUpdateReviewStatusMutation();

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
          maintenanceRooms: 0,
          occupancyRate: 0,
          totalCustomers: 0,
          totalReviews: 0,
          pendingInquiries: 0,
     };

     const revenueChartData = data?.revenueChartData || [];
     const recentBookings = data?.recentBookings || [];
     const recentReviews = data?.recentReviews || [];

     const roomStatusDonut = [
          { label: 'Available', value: stats.availableRooms || 0, color: '#10b981' },
          { label: 'Occupied', value: stats.occupiedRooms || 0, color: '#0ea5e9' },
          { label: 'Maintenance', value: stats.maintenanceRooms || 0, color: '#f59e0b' },
     ];

     const handleApproveReview = async (reviewId) => {
          try {
               await updateReviewStatus({ id: reviewId, status: 'APPROVED' }).unwrap();
               toast.success('Review approved and published');
          } catch {
               toast.error('Failed to approve review');
          }
     };

     return (
          <div className="space-y-6">
               {/* Header / Welcome Banner */}
               <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-[#181613] to-neutral-900 p-6 md:p-8 border border-[#b99d75]/30 text-white shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="space-y-1.5">
                              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#b99d75]/20 border border-[#b99d75]/40 text-[#b99d75] text-[11px] font-bold uppercase tracking-widest">
                                   <Shield className="w-3.5 h-3.5" />
                                   <span>Super Administrator Command Suite</span>
                              </div>
                              <h1 className="text-2xl md:text-3xl font-extrabold font-serif uppercase tracking-wider text-white">
                                   Welcome back, {user?.fullName || user?.firstName}
                              </h1>
                              <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                                   Global hotel analytics, occupancy management, real-time reservations, and executive controls.
                              </p>
                         </div>

                         <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                              <Link
                                   href="/dashboard/rooms/new"
                                   className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
                              >
                                   <PlusCircle className="w-4 h-4" />
                                   <span>New Suite</span>
                              </Link>
                              <Link
                                   href="/dashboard/users"
                                   className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition"
                              >
                                   <Users className="w-4 h-4" />
                                   <span>User Roles</span>
                              </Link>
                         </div>
                    </div>
               </div>

               {/* Key Performance Indicators */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                         title="Total Revenue"
                         value={`$${Number(stats.totalRevenue || 0).toLocaleString()}`}
                         subtitle="Cumulative stay revenue"
                         icon={DollarSign}
                         trend="+14.8%"
                         trendType="positive"
                         color="gold"
                    />
                    <StatsCard
                         title="Total Reservations"
                         value={stats.totalBookings}
                         subtitle={`${stats.confirmedBookings} active stays`}
                         icon={CalendarCheck}
                         trend="+8.2%"
                         trendType="positive"
                         color="blue"
                         href="/dashboard/bookings"
                    />
                    <StatsCard
                         title="Occupancy Rate"
                         value={`${stats.occupancyRate}%`}
                         subtitle={`${stats.occupiedRooms} of ${stats.totalRooms} suites occupied`}
                         icon={BedDouble}
                         color="emerald"
                         href="/dashboard/rooms"
                    />
                    <StatsCard
                         title="Pending Actions"
                         value={stats.pendingInquiries + (stats.totalReviews > 0 ? 2 : 0)}
                         subtitle={`${stats.pendingInquiries} inquiries awaiting reply`}
                         icon={MessageSquare}
                         color="amber"
                         href="/dashboard/inquiries"
                    />
               </div>

               {/* Analytics Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ChartCard
                         title="6-Month Revenue Trajectory"
                         subtitle="Gross reservation earnings over recent operating cycles"
                         className="lg:col-span-2"
                         action={
                              <span className="text-[11px] font-bold text-[#b99d75] uppercase tracking-wider">
                                   USD Currency
                              </span>
                         }
                    >
                         <AreaChart data={revenueChartData} height={220} />
                    </ChartCard>

                    <ChartCard
                         title="Suites & Inventory"
                         subtitle="Current room status distribution"
                    >
                         <DonutChart data={roomStatusDonut} size={170} />
                    </ChartCard>
               </div>

               {/* Tables & Moderation Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Bookings (2 Cols) */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
                         <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <div>
                                   <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                        Recent Reservations
                                   </h3>
                                   <p className="text-[11px] text-gray-500 mt-0.5">
                                        Latest guest booking entries & payment status
                                   </p>
                              </div>
                              <Link
                                   href="/dashboard/bookings"
                                   className="inline-flex items-center gap-1 text-xs font-bold text-[#b99d75] hover:underline uppercase tracking-wider"
                              >
                                   <span>View All ({stats.totalBookings})</span>
                                   <ArrowRight className="w-3 h-3" />
                              </Link>
                         </div>

                         <div className="overflow-x-auto flex-1">
                              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                                   <thead className="bg-gray-50 dark:bg-gray-900/60 uppercase text-[10px] font-bold text-gray-500">
                                        <tr>
                                             <th className="p-3.5">Ref #</th>
                                             <th className="p-3.5">Suite / Guest</th>
                                             <th className="p-3.5">Date</th>
                                             <th className="p-3.5">Amount</th>
                                             <th className="p-3.5">Status</th>
                                             <th className="p-3.5 text-right">Action</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {recentBookings.length === 0 ? (
                                             <tr>
                                                  <td colSpan={6} className="p-8 text-center text-gray-400">
                                                       No recent bookings recorded.
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
                                                            <strong className="text-gray-900 dark:text-white block truncate max-w-[150px]">
                                                                 {b.title || b.room?.title}
                                                            </strong>
                                                            <span className="text-[10px] text-gray-400 truncate block">
                                                                 {b.name || b.user?.email || b.email}
                                                            </span>
                                                       </td>
                                                       <td className="p-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                            {b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A')}
                                                       </td>
                                                       <td className="p-3.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                            ${b.totalAmount || b.price}
                                                       </td>
                                                       <td className="p-3.5 whitespace-nowrap">
                                                            <StatusBadge status={b.status} />
                                                       </td>
                                                       <td className="p-3.5 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                 <Link
                                                                      href={`/dashboard/bookings/${b.id || b._id}`}
                                                                      className="p-1 text-gray-500 hover:text-[#b99d75] transition cursor-pointer inline-flex items-center"
                                                                      title="View Stay Folio"
                                                                 >
                                                                      <Eye className="w-3.5 h-3.5" />
                                                                 </Link>
                                                                 <Link
                                                                      href={`/dashboard/bookings/${b.id || b._id}/edit`}
                                                                      className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer inline-flex items-center"
                                                                      title="Edit Stay Lifecycle"
                                                                 >
                                                                      <Edit3 className="w-3.5 h-3.5" />
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

                    {/* Recent Reviews Moderation (1 Col) */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-5 shadow-xs flex flex-col justify-between">
                         <div className="pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   Guest Reviews
                              </h3>
                              <Link
                                   href="/dashboard/reviews"
                                   className="text-xs font-bold text-[#b99d75] hover:underline uppercase"
                              >
                                   Manage →
                              </Link>
                         </div>

                         <div className="space-y-3.5 py-3 flex-1 overflow-y-auto max-h-[300px]">
                              {recentReviews.length === 0 ? (
                                   <div className="text-center py-10 text-xs text-gray-400">
                                        No recent guest reviews found.
                                   </div>
                              ) : (
                                   recentReviews.map((r) => (
                                        <div
                                             key={r.id || r._id}
                                             className="p-3 border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 space-y-1.5"
                                        >
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1 text-amber-500">
                                                       {Array.from({ length: r.rating || 5 }).map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-current" />
                                                       ))}
                                                  </div>
                                                  <StatusBadge status={r.status || 'APPROVED'} />
                                             </div>
                                             <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 italic">
                                                  &ldquo;{r.comment}&rdquo;
                                             </p>
                                             <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                                                  <span>{r.user?.fullName || r.userName || 'Guest'}</span>
                                                  <Link
                                                       href={`/dashboard/reviews/${r.id || r._id}`}
                                                       className="text-[#b99d75] font-bold hover:underline"
                                                  >
                                                       Moderate &rarr;
                                                  </Link>
                                             </div>
                                        </div>
                                   ))
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}
