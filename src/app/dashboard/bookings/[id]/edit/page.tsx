'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import Loading from '@/app/loading';
import { useGetBookingByIdQuery, useUpdateBookingMutation } from '@/redux/api/bookingApi';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import {
     CalendarCheck,
     BedDouble,
     User,
     DollarSign,
     Sparkles,
     ArrowLeft,
     Save,
     Loader2,
     Sliders,
     Shield,
     Clock,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const BOOKING_STATUSES = [
     { label: 'Confirmed Stay', value: 'CONFIRMED' },
     { label: 'Checked In (Active)', value: 'CHECKED_IN' },
     { label: 'Checked Out (Departed)', value: 'CHECKED_OUT' },
     { label: 'Completed', value: 'COMPLETED' },
     { label: 'Cancelled', value: 'CANCELLED' },
     { label: 'Pending Verification', value: 'PENDING' },
];

const PAYMENT_STATUSES = [
     { label: 'Paid in Full', value: 'PAID' },
     { label: 'Unpaid / Pending Folio', value: 'UNPAID' },
     { label: 'Refunded', value: 'REFUNDED' },
];

export default function EditBookingPage() {
     const params = useParams();
     const bookingId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const router = useRouter();
     const { isStaff, isAdmin, isSuperAdmin } = useAuth();
     const isManagement = isStaff || isAdmin || isSuperAdmin;

     const { data: booking, isLoading: isFetching } = useGetBookingByIdQuery(bookingId, { skip: !bookingId });
     const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

     const [formData, setFormData] = useState({
          date: '',
          userName: '',
          userEmail: '',
          userPhone: '',
          guests: 1,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          price: 0,
          totalAmount: 0,
          specialRequests: '',
          cancellationReason: '',
     });

     useEffect(() => {
          if (booking) {
               setFormData({
                    date: booking.date || '',
                    userName: booking.userName || booking.name || booking.user?.fullName || '',
                    userEmail: booking.userEmail || booking.email || booking.user?.email || '',
                    userPhone: booking.userPhone || '',
                    guests: booking.guests || 1,
                    status: booking.status || 'CONFIRMED',
                    paymentStatus: booking.paymentStatus || 'PAID',
                    price: Number(booking.price || 0),
                    totalAmount: Number(booking.totalAmount || booking.price || 0),
                    specialRequests: booking.specialRequests || '',
                    cancellationReason: booking.cancellationReason || '',
               });
          }
     }, [booking]);

     if (isFetching) return <Loading />;

     if (!booking) {
          return (
               <div className="p-12 text-center bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 font-semibold">Reservation record not found.</p>
                    <Link href="/dashboard/bookings" className="text-xs text-[#b99d75] font-bold underline mt-2 block">
                         Return to Reservations
                    </Link>
               </div>
          );
     }

     const handleSubmit = async (e) => {
          e.preventDefault();

          const payload = {
               id: booking.id || bookingId,
               date: formData.date,
               userName: formData.userName,
               userEmail: formData.userEmail,
               userPhone: formData.userPhone || null,
               guests: Number(formData.guests),
               status: formData.status,
               paymentStatus: formData.paymentStatus,
               price: Number(formData.price),
               totalAmount: Number(formData.totalAmount),
               specialRequests: formData.specialRequests || null,
               cancellationReason: formData.status === 'CANCELLED' ? (formData.cancellationReason || 'Cancelled via management portal') : null,
          };

          try {
               await updateBooking(payload).unwrap();
               toast.success('Reservation updated successfully!');
               router.push('/dashboard/bookings');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update reservation');
          }
     };

     return (
          <div className="space-y-6 max-w-4xl">
               <PageHeader
                    title={`Manage Reservation #${booking.bookingNumber || booking.id?.slice(-8)}`}
                    description="Update scheduled stay dates, transition operational stay status, adjust folio pricing, and update guest records."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reservations', href: '/dashboard/bookings' },
                         { label: `Edit #${booking.bookingNumber || booking.id?.slice(-6)}` },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/bookings"
                              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Suite Summary Header Card */}
                    <div className="p-5 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-4">
                              <div className="w-16 h-12 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                   <img
                                        src={booking.image || '/images/suite-placeholder.jpg'}
                                        alt={booking.title}
                                        className="w-full h-full object-cover"
                                   />
                              </div>
                              <div>
                                   <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                        {booking.title || booking.room?.title}
                                   </h3>
                                   <span className="text-[11px] text-gray-500">
                                        Suite #{booking.room?.roomNumber || 'N/A'} • {booking.room?.type || 'Deluxe'}
                                   </span>
                              </div>
                         </div>
                         <div className="text-right">
                              <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Status</span>
                              <StatusBadge status={booking.status} />
                         </div>
                    </div>

                    {/* Operational Status & Schedule */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Sliders className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Stay Schedule & Status Lifecycle
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Scheduled Stay Date *
                                   </label>
                                   <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Operational Stay Status
                                   </label>
                                   <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                   >
                                        {BOOKING_STATUSES.map((s) => (
                                             <option key={s.value} value={s.value}>
                                                  {s.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Payment Folio Status
                                   </label>
                                   <select
                                        value={formData.paymentStatus}
                                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                   >
                                        {PAYMENT_STATUSES.map((p) => (
                                             <option key={p.value} value={p.value}>
                                                  {p.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Party Size (Guests)
                                   </label>
                                   <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Total Folio Amount ($)
                                   </label>
                                   <input
                                        type="number"
                                        min="0"
                                        value={formData.totalAmount}
                                        onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) || 0, price: Number(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono font-bold"
                                   />
                              </div>

                              {formData.status === 'CANCELLED' && (
                                   <div className="space-y-1 sm:col-span-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                             Cancellation Reason
                                        </label>
                                        <input
                                             type="text"
                                             value={formData.cancellationReason}
                                             onChange={(e) => setFormData({ ...formData, cancellationReason: e.target.value })}
                                             placeholder="e.g. Guest requested schedule change or emergency"
                                             className="w-full px-3 py-2 text-xs border border-rose-300 dark:border-rose-900 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-rose-500 focus:outline-none"
                                        />
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Guest Information & Preferences */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <User className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Guest Profile & Notes
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Guest Full Name *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Guest Email *
                                   </label>
                                   <input
                                        type="email"
                                        required
                                        value={formData.userEmail}
                                        onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Phone Number
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.userPhone}
                                        onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1 sm:col-span-3">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Concierge Directives & Special Requests
                                   </label>
                                   <textarea
                                        rows={3}
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                         <Link
                              href="/dashboard/bookings"
                              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              Cancel
                         </Link>

                         <button
                              type="submit"
                              disabled={isUpdating}
                              className="flex items-center gap-2 px-8 py-3 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-md font-serif"
                         >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Save Reservation Changes</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
