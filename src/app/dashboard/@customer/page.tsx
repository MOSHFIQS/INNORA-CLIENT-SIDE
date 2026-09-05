'use client';

import React, { useState } from 'react';
import Loading from '@/app/loading';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import { useGetCustomerDashboardQuery } from '@/redux/api/dashboardApi';
import { useCancelBookingMutation } from '@/redux/api/bookingApi';
import {
     BedDouble,
     CalendarCheck,
     DollarSign,
     Star,
     Compass,
     Sparkles,
     ArrowRight,
     Eye,
     XCircle,
     PlusCircle,
     Clock,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CustomerDashboardPage() {
     const { user } = useAuth();
     const { data, isLoading } = useGetCustomerDashboardQuery();
     const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

     const [cancellingBooking, setCancellingBooking] = useState(null);

     if (isLoading) {
          return <Loading />;
     }

     const stats = data?.stats || {
          totalBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
          reviewsCount: 0,
     };

     const recentBookings = data?.recentBookings || [];

     const handleConfirmCancel = async () => {
          if (!cancellingBooking) return;
          try {
               await cancelBooking({
                    idOrEmail: cancellingBooking.id || cancellingBooking._id || user?.email,
                    reason: 'Guest self-cancelled from dashboard portal',
               }).unwrap();
               toast.success('Reservation cancelled');
               setCancellingBooking(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to cancel reservation');
          }
     };

     return (
          <div className="space-y-6">
               {/* Welcome Banner */}
               <div className="bg-gradient-to-r from-gray-950 via-[#1c1914] to-neutral-900 p-6 md:p-8 border border-[#b99d75]/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                         <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#b99d75]/20 border border-[#b99d75]/40 text-[#b99d75] text-[11px] font-bold uppercase tracking-widest">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Distinguished Guest Portal</span>
                         </div>
                         <h1 className="text-2xl md:text-3xl font-extrabold font-serif uppercase tracking-wider">
                              Welcome, {user?.fullName || user?.firstName}
                         </h1>
                         <p className="text-xs text-gray-400">
                              Manage your luxury suite reservations, access stay receipts, and view guest privileges.
                         </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                         <Link
                              href="/rooms"
                              className="flex items-center gap-2 px-5 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
                         >
                              <Compass className="w-4 h-4" />
                              <span>Explore Suites</span>
                         </Link>
                         <Link
                              href="/dashboard/profile"
                              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition"
                         >
                              <span>My Profile</span>
                         </Link>
                    </div>
               </div>

               {/* Guest Stats Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                         title="Total Reservations"
                         value={stats.totalBookings}
                         subtitle="All past and upcoming visits"
                         icon={CalendarCheck}
                         color="gold"
                         href="/dashboard/bookings"
                    />
                    <StatsCard
                         title="Active / Upcoming"
                         value={stats.confirmedBookings}
                         subtitle="Confirmed luxury stays"
                         icon={BedDouble}
                         color="emerald"
                         href="/dashboard/bookings"
                    />
                    <StatsCard
                         title="Completed Stays"
                         value={stats.completedBookings}
                         subtitle="Memories created at INNORA"
                         icon={Clock}
                         color="blue"
                         href="/dashboard/bookings"
                    />
                    <StatsCard
                         title="Total Investment"
                         value={`$${Number(stats.totalSpent || 0).toLocaleString()}`}
                         subtitle={`${stats.reviewsCount} guest reviews submitted`}
                         icon={DollarSign}
                         color="amber"
                    />
               </div>

               {/* Recent Reservations Table */}
               <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                         <div>
                              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   My Recent Reservations
                              </h3>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                   Track arrival dates, suite arrangements, and reservation invoices
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

                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-900/60 uppercase text-[10px] font-bold text-gray-500">
                                   <tr>
                                        <th className="p-3.5">Voucher #</th>
                                        <th className="p-3.5">Suite Name</th>
                                        <th className="p-3.5">Arrival / Schedule</th>
                                        <th className="p-3.5">Investment</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Action</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {recentBookings.length === 0 ? (
                                        <tr>
                                             <td colSpan={6} className="p-10 text-center text-gray-400">
                                                  <div className="flex flex-col items-center justify-center gap-2">
                                                       <BedDouble className="w-8 h-8 text-[#b99d75] opacity-60" />
                                                       <p className="text-xs font-semibold">No reservations found yet.</p>
                                                       <Link
                                                            href="/rooms"
                                                            className="text-xs text-[#b99d75] font-bold hover:underline uppercase mt-1"
                                                       >
                                                            Book Your First Suite →
                                                       </Link>
                                                  </div>
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
                                                       <strong className="text-gray-900 dark:text-white block font-serif">
                                                            {b.title || b.room?.title || 'Luxury Suite'}
                                                       </strong>
                                                       <span className="text-[10px] text-gray-400">
                                                            Suite #{b.room?.roomNumber || 'N/A'} • {b.room?.type || 'Deluxe'}
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
                                                       <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                 href={`/dashboard/bookings/${b.id || b._id}`}
                                                                 className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-[#b99d75] text-gray-700 dark:text-gray-300 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                                            >
                                                                 <Eye className="w-3 h-3" />
                                                                 <span>Voucher</span>
                                                            </Link>

                                                            {b.status === 'CONFIRMED' && (
                                                                 <button
                                                                      onClick={() => setCancellingBooking(b)}
                                                                      className="px-2.5 py-1 text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold uppercase transition cursor-pointer"
                                                                 >
                                                                      Cancel
                                                                 </button>
                                                            )}

                                                            {b.status === 'COMPLETED' && (
                                                                 <Link
                                                                      href={`/dashboard/reviews/new?roomId=${b.roomId || b.room?.id || b.room?._id || ''}`}
                                                                      className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-600 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                                                 >
                                                                      <Star className="w-3 h-3" />
                                                                      <span>Review</span>
                                                                 </Link>
                                                            )}
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>

               {/* Delete/Cancel Dialog */}
               <DeleteConfirmationDialog
                    isOpen={Boolean(cancellingBooking)}
                    onClose={() => setCancellingBooking(null)}
                    onConfirm={handleConfirmCancel}
                    title="Cancel Suite Reservation"
                    message={`Are you sure you wish to cancel reservation #${cancellingBooking?.bookingNumber || cancellingBooking?.id?.slice(-6)}? This will release your booked suite.`}
                    confirmLabel="Confirm Cancellation"
                    isLoading={isCancelling}
               />
          </div>
     );
}
