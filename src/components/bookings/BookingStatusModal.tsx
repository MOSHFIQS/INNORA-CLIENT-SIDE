'use client';

import React, { useState, useEffect } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import { useUpdateBookingStatusMutation } from '@/redux/api/bookingApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BOOKING_STATUSES = ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED', 'CANCELLED', 'PENDING'];
const PAYMENT_STATUSES = ['PAID', 'UNPAID', 'REFUNDED'];

export default function BookingStatusModal({ isOpen, onClose, booking }) {
     const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();
     const [status, setStatus] = useState('CONFIRMED');
     const [paymentStatus, setPaymentStatus] = useState('PAID');
     const [cancellationReason, setCancellationReason] = useState('');

     useEffect(() => {
          if (booking) {
               setStatus(booking.status || 'CONFIRMED');
               setPaymentStatus(booking.paymentStatus || 'PAID');
               setCancellationReason('');
          }
     }, [booking, isOpen]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!booking) return;

          try {
               await updateStatus({
                    id: booking.id || booking._id,
                    status,
                    paymentStatus,
                    cancellationReason: status === 'CANCELLED' ? cancellationReason : undefined,
               }).unwrap();
               toast.success(`Booking status updated to ${status}`);
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update booking status');
          }
     };

     if (!booking) return null;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Update Reservation Status"
               description={`Reservation #${booking.bookingNumber || booking.id?.slice(-8)} — ${booking.title || 'Suite'}`}
               maxWidth="max-w-md"
          >
               <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Booking Lifecycle Status
                         </label>
                         <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-semibold"
                         >
                              {BOOKING_STATUSES.map((s) => (
                                   <option key={s} value={s}>
                                        {s.replace('_', ' ')}
                                   </option>
                              ))}
                         </select>
                    </div>

                    <div className="space-y-1.5">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Payment Settlement Status
                         </label>
                         <select
                              value={paymentStatus}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-semibold"
                         >
                              {PAYMENT_STATUSES.map((ps) => (
                                   <option key={ps} value={ps}>
                                        {ps}
                                   </option>
                              ))}
                         </select>
                    </div>

                    {status === 'CANCELLED' && (
                         <div className="space-y-1.5 animate-fadeIn">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Reason for Cancellation
                              </label>
                              <textarea
                                   rows={2}
                                   value={cancellationReason}
                                   onChange={(e) => setCancellationReason(e.target.value)}
                                   placeholder="Specify guest request or administrative reason..."
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    )}

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <button
                              type="button"
                              onClick={onClose}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#b99d75] hover:bg-[#a68c65] text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Save Status</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
