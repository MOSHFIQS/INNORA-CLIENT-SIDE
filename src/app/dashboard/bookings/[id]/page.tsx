'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import Loading from '@/app/loading';
import { useGetBookingByIdQuery } from '@/redux/api/bookingApi';
import { useParams } from 'next/navigation';
import {
     CalendarCheck,
     BedDouble,
     User,
     DollarSign,
     Sparkles,
     ArrowLeft,
     Printer,
     MapPin,
     Mail,
     Phone,
     CreditCard,
     Clock,
     ShieldCheck,
     FileText,
     CheckCircle,
     Edit3,
} from 'lucide-react';
import Link from 'next/link';

export default function BookingDetailPage() {
     const params = useParams();
     const bookingId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

     const { data: booking, isLoading } = useGetBookingByIdQuery(bookingId, { skip: !bookingId });

     if (isLoading) return <Loading />;

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

     const handlePrint = () => {
          window.print();
     };

     const formattedStayDate = booking.date || (booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A');
     const amount = Number(booking.totalAmount || booking.price || 0);

     return (
          <div className="space-y-6 max-w-4xl">
               {/* Non-printable Page Header */}
               <div className="print:hidden">
                    <PageHeader
                         title={`Reservation Folio #${booking.bookingNumber || booking.id?.slice(-8)}`}
                         description="Official verified INNORA luxury hospitality stay receipt and confirmation dossier."
                         breadcrumbs={[
                              { label: 'Dashboard', href: '/dashboard' },
                              { label: 'Reservations', href: '/dashboard/bookings' },
                              { label: `#${booking.bookingNumber || booking.id?.slice(-6)}` },
                         ]}
                         actions={
                              <div className="flex items-center gap-2">
                                   <Link
                                        href="/dashboard/bookings"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                                   >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Back</span>
                                   </Link>

                                   <Link
                                        href={`/dashboard/bookings/${booking.id || bookingId}/edit`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                                   >
                                        <Edit3 className="w-4 h-4" />
                                        <span>Edit Stay</span>
                                   </Link>

                                   <button
                                        onClick={handlePrint}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#b99d75] dark:hover:bg-[#b99d75] dark:hover:text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                                   >
                                        <Printer className="w-4 h-4" />
                                        <span>Print Folio</span>
                                   </button>
                              </div>
                         }
                    />
               </div>

               {/* Printable Luxury Stay Folio / Voucher */}
               <div className="bg-white dark:bg-[#1b1b1b] border-2 border-[#b99d75]/30 p-8 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
                    {/* Brand Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                         <div className="space-y-1">
                              <h1 className="text-2xl font-black font-serif tracking-widest text-[#b99d75]">
                                   INNORA
                              </h1>
                              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                   Luxury Hotel & Panoramic Suites Resort
                              </p>
                              <p className="text-xs text-gray-500">
                                   777 Ocean View Boulevard, Coastal Haven • +1 (800) 555-4666
                              </p>
                         </div>

                         <div className="text-left sm:text-right space-y-1">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#b99d75]/15 border border-[#b99d75]/30 text-[#b99d75] text-xs font-mono font-bold uppercase">
                                   <ShieldCheck className="w-3.5 h-3.5" />
                                   <span>CONFIRMATION #{booking.bookingNumber || booking.id?.slice(-8)}</span>
                              </div>
                              <p className="text-[11px] text-gray-400">
                                   Issued: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                         </div>
                    </div>

                    {/* Status Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                         <div className="flex items-center gap-3">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Reservation Status:</span>
                              <StatusBadge status={booking.status} />
                         </div>
                         <div className="flex items-center gap-3">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Settlement:</span>
                              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase font-mono">
                                   {booking.paymentStatus || 'PAID IN FULL'}
                              </span>
                         </div>
                    </div>

                    {/* Guest & Suite Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Guest Profile */}
                         <div className="p-5 border border-gray-200 dark:border-gray-800 space-y-3">
                              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <User className="w-4 h-4 text-[#b99d75]" />
                                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                        Distinguished Guest
                                   </h3>
                              </div>
                              <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                                   <p className="text-sm font-bold text-gray-900 dark:text-white font-serif">
                                        {booking.name || booking.userName || booking.user?.fullName || 'Valued Guest'}
                                   </p>
                                   <p className="flex items-center gap-2 text-gray-500">
                                        <Mail className="w-3.5 h-3.5 text-[#b99d75]" />
                                        <span>{booking.email || booking.userEmail || booking.user?.email || 'N/A'}</span>
                                   </p>
                                   {booking.userPhone && (
                                        <p className="flex items-center gap-2 text-gray-500">
                                             <Phone className="w-3.5 h-3.5 text-[#b99d75]" />
                                             <span>{booking.userPhone}</span>
                                        </p>
                                   )}
                                   <p className="text-[11px] text-gray-400 pt-1">
                                        Party Size: <strong>{booking.guests || 1} Guest(s)</strong>
                                   </p>
                              </div>
                         </div>

                         {/* Suite Allocation */}
                         <div className="p-5 border border-gray-200 dark:border-gray-800 space-y-3">
                              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <BedDouble className="w-4 h-4 text-[#b99d75]" />
                                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                        Suite Accommodation
                                   </h3>
                              </div>
                              <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                                   <p className="text-sm font-bold text-gray-900 dark:text-white font-serif">
                                        {booking.title || booking.room?.title || 'Luxury Suite'}
                                   </p>
                                   <p className="text-gray-500">
                                        Suite #{booking.room?.roomNumber || 'Assigned on Arrival'} • Floor {booking.room?.floor || 1}
                                   </p>
                                   <p className="text-gray-500">
                                        Category: <strong>{booking.room?.type || 'Deluxe'}</strong> • {booking.room?.bedType || 'King Signature Bed'}
                                   </p>
                                   <p className="text-[11px] text-gray-400 pt-1">
                                        Stay Date: <strong className="text-gray-900 dark:text-white font-mono">{formattedStayDate}</strong>
                                   </p>
                              </div>
                         </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                         <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                                   Guest Special Requests & Concierge Directives:
                              </span>
                              <p className="italic text-gray-800 dark:text-gray-200">
                                   &ldquo;{booking.specialRequests}&rdquo;
                              </p>
                         </div>
                    )}

                    {/* Itemized Folio Table */}
                    <div className="space-y-3">
                         <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Itemized Stay Folio
                         </h3>
                         <table className="w-full text-left text-xs border border-gray-200 dark:border-gray-800">
                              <thead className="bg-gray-50 dark:bg-gray-900/70 text-gray-500 uppercase text-[10px] font-bold">
                                   <tr>
                                        <th className="p-3">Description</th>
                                        <th className="p-3 text-center">Schedule</th>
                                        <th className="p-3 text-center">Quantity</th>
                                        <th className="p-3 text-right">Amount (USD)</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   <tr>
                                        <td className="p-3 font-semibold text-gray-900 dark:text-white">
                                             {booking.title || booking.room?.title || 'Luxury Suite Stay'}
                                        </td>
                                        <td className="p-3 text-center text-gray-600 dark:text-gray-400 font-mono">
                                             {formattedStayDate}
                                        </td>
                                        <td className="p-3 text-center text-gray-600 dark:text-gray-400">
                                             1 Night
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                                             ${amount.toLocaleString()}
                                        </td>
                                   </tr>
                                   <tr className="bg-gray-50/50 dark:bg-gray-900/30 font-bold">
                                        <td colSpan={3} className="p-3 text-right uppercase text-[11px] text-gray-500">
                                             Total Stay Folio:
                                        </td>
                                        <td className="p-3 text-right font-mono text-base text-[#b99d75]">
                                             ${amount.toLocaleString()}
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>

                    {/* Footer Policies */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-400 space-y-1">
                         <p className="font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Hotel Check-in Policy & Guest Guidelines:
                         </p>
                         <p>
                              Standard check-in begins at 15:00. Check-out is scheduled by 11:00. Present this reservation voucher and government-issued identification upon arrival at the concierge desk.
                         </p>
                    </div>
               </div>
          </div>
     );
}
