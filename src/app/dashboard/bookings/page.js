'use client';

import React, { useState } from 'react';
import {
     useGetAllBookingsQuery,
     useUpdateBookingStatusMutation,
     useCancelBookingMutation,
} from '@/redux/api/bookingApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Search, CheckCircle, Clock, XCircle, LogIn, LogOut, Trash2 } from 'lucide-react';

export default function BookingsManagementPage() {
     const [search, setSearch] = useState('');
     const [statusFilter, setStatusFilter] = useState('');

     const { data: bookingsData, isLoading } = useGetAllBookingsQuery({
          search: search || undefined,
          status: statusFilter || undefined,
     });

     const [updateBookingStatus] = useUpdateBookingStatusMutation();
     const [cancelBooking] = useCancelBookingMutation();

     const bookings = bookingsData?.data || [];

     const handleStatusChange = async (booking, newStatus) => {
          try {
               await updateBookingStatus({ id: booking.id || booking._id, status: newStatus }).unwrap();
               toast.success(`Booking #${booking.bookingNumber} updated to ${newStatus}`);
          } catch (err) {
               toast.error('Failed to update status');
          }
     };

     const handleCancel = async (booking) => {
          if (!confirm(`Are you sure you want to cancel reservation #${booking.bookingNumber}?`)) return;
          try {
               await cancelBooking({ idOrEmail: booking.id || booking._id }).unwrap();
               toast.success('Reservation cancelled');
          } catch (err) {
               toast.error('Failed to cancel reservation');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                         Reservations & Guest Stays
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                         Monitor guest bookings, handle check-in, check-out, and status workflows
                    </p>
               </div>

               {/* Filter bar */}
               <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#202020] p-4 border border-gray-200 dark:border-gray-800">
                    <div className="relative flex-1 min-w-[220px]">
                         <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                         <input
                              type="text"
                              placeholder="Search by reservation #, guest name, or email..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                         />
                    </div>
                    <select
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                    >
                         <option value="">All Statuses</option>
                         <option value="CONFIRMED">Confirmed</option>
                         <option value="CHECKED_IN">Checked In</option>
                         <option value="CHECKED_OUT">Checked Out</option>
                         <option value="COMPLETED">Completed</option>
                         <option value="CANCELLED">Cancelled</option>
                    </select>
               </div>

               {/* Bookings Table */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">Reservation #</th>
                                        <th className="p-3">Guest</th>
                                        <th className="p-3">Suite Reserved</th>
                                        <th className="p-3">Arrival Date</th>
                                        <th className="p-3">Total Amount</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Guest Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {bookings.length === 0 ? (
                                        <tr>
                                             <td colSpan="7" className="text-center py-8 text-xs text-gray-500">
                                                  No reservations match the search filters.
                                             </td>
                                        </tr>
                                   ) : (
                                        bookings.map((b) => (
                                             <tr key={b.id || b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                  <td className="p-3 font-bold text-[#b99d75]">{b.bookingNumber}</td>
                                                  <td className="p-3">
                                                       <div className="font-bold text-gray-900 dark:text-white">{b.userName}</div>
                                                       <div className="text-[10px] text-gray-400">{b.userEmail} {b.userPhone && `• ${b.userPhone}`}</div>
                                                  </td>
                                                  <td className="p-3">
                                                       <span className="font-semibold">{b.title}</span>
                                                       {b.specialRequests && (
                                                            <div className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                                                                 Req: {b.specialRequests}
                                                            </div>
                                                       )}
                                                  </td>
                                                  <td className="p-3 font-semibold">{b.date}</td>
                                                  <td className="p-3 font-bold">${b.price || b.totalAmount}</td>
                                                  <td className="p-3">
                                                       <span
                                                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                                                 b.status === 'CONFIRMED'
                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                                      : b.status === 'CHECKED_IN'
                                                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                      : b.status === 'CHECKED_OUT' || b.status === 'COMPLETED'
                                                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                                                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                                            }`}
                                                       >
                                                            {b.status}
                                                       </span>
                                                  </td>
                                                  <td className="p-3 text-right space-x-1.5">
                                                       {b.status === 'CONFIRMED' && (
                                                            <button
                                                                 onClick={() => handleStatusChange(b, 'CHECKED_IN')}
                                                                 className="btn btn-xs rounded-none bg-emerald-600 hover:bg-emerald-700 text-white uppercase"
                                                                 title="Check In Guest"
                                                            >
                                                                 <LogIn className="w-3 h-3" /> Check In
                                                            </button>
                                                       )}
                                                       {b.status === 'CHECKED_IN' && (
                                                            <button
                                                                 onClick={() => handleStatusChange(b, 'CHECKED_OUT')}
                                                                 className="btn btn-xs rounded-none bg-purple-600 hover:bg-purple-700 text-white uppercase"
                                                                 title="Check Out Guest"
                                                            >
                                                                 <LogOut className="w-3 h-3" /> Check Out
                                                            </button>
                                                       )}
                                                       {b.status !== 'CANCELLED' && (
                                                            <button
                                                                 onClick={() => handleCancel(b)}
                                                                 className="btn btn-xs rounded-none bg-red-600 hover:bg-red-700 text-white uppercase"
                                                                 title="Cancel Reservation"
                                                            >
                                                                 <Trash2 className="w-3 h-3" />
                                                            </button>
                                                       )}
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
