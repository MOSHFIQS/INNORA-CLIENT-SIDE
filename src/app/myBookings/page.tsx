'use client';

import PrivateRoute from '@/privateRoute/PrivateRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
     useGetMyBookingsQuery,
     useUpdateBookingDateMutation,
     useCancelBookingMutation,
} from '@/redux/api/bookingApi';
import Loading from '@/app/loading';
import { Calendar, Trash2, Edit, Star, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormDialog from '@/components/shared/FormDialog';

const MyBookings = () => {
     const { user } = useAuth();
     const router = useRouter();
     const { data: myBookings = [], isLoading } = useGetMyBookingsQuery();
     const [updateBookingDate, { isLoading: isUpdating }] = useUpdateBookingDateMutation();
     const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

     const [selectedBooking, setSelectedBooking] = useState(null);
     const [newDate, setNewDate] = useState('');

     const handleCancel = async (booking) => {
          if (!confirm(`Are you sure you want to cancel your reservation for ${booking.title}?`)) return;

          try {
               await cancelBooking({
                    idOrEmail: booking.id || booking._id,
                    roomId: booking.roomId,
                    date: booking.date,
               }).unwrap();
               toast.success('Reservation cancelled successfully');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to cancel reservation');
          }
     };

     const handleUpdateDate = async (e) => {
          e.preventDefault();
          if (!selectedBooking || !newDate) return;

          try {
               await updateBookingDate({
                    roomId: selectedBooking.roomId,
                    oldDate: selectedBooking.date,
                    newDate,
                    email: user?.email,
               }).unwrap();
               toast.success('Reservation date rescheduled successfully');
               setSelectedBooking(null);
               setNewDate('');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update reservation date');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <PrivateRoute>
               <div className="max-w-7xl mx-auto px-4 py-12 w-full">
                    <div className="text-center space-y-2 mb-10">
                         <p className="text-xs uppercase font-bold tracking-widest text-[#b99d75]">Your Reservation History</p>
                         <h1 className="text-3xl md:text-5xl font-extrabold font-serif uppercase text-gray-900 dark:text-white">
                              My Bookings
                         </h1>
                    </div>

                    {myBookings.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-8 text-center space-y-4 shadow-sm">
                              <Building className="w-16 h-16 text-[#b99d75]" />
                              <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white uppercase">
                                   No Active Bookings Found
                              </h2>
                              <p className="text-sm text-gray-500 max-w-md">
                                   You haven&apos;t reserved any suites yet. Discover our signature luxury suites and experience timeless hospitality.
                              </p>
                              <button
                                   onClick={() => router.push('/rooms')}
                                   className="btn rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs px-6 py-2"
                              >
                                   Browse Luxury Rooms
                              </button>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {myBookings.map((booking) => (
                                   <div
                                        key={booking.id || booking._id}
                                        className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                   >
                                        <div>
                                             <div className="relative h-52 w-full overflow-hidden">
                                                  <img
                                                       src={booking.image || '/fallback.jpg'}
                                                       alt={booking.title}
                                                       className="w-full h-full object-cover"
                                                  />
                                                  <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase">
                                                       #{booking.bookingNumber || booking.roomId}
                                                  </div>
                                                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 uppercase">
                                                       {booking.status}
                                                  </div>
                                             </div>

                                             <div className="p-6 space-y-3">
                                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase truncate">
                                                       {booking.title}
                                                  </h3>
                                                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                                                       <p className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-[#b99d75]" />
                                                            <span>Arrival Date: <strong className="text-gray-900 dark:text-white">{booking.date}</strong></span>
                                                       </p>
                                                       <p>
                                                            <span>Total Rate: <strong>${booking.price || booking.totalAmount}</strong></span>
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="p-6 pt-0 flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                             <Button
                                                  size="xs"
                                                  variant="secondary"
                                                  onClick={() => setSelectedBooking(booking)}
                                                  className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white"
                                             >
                                                  <Edit className="w-3 h-3" /> Reschedule
                                             </Button>

                                             <Button
                                                  size="xs"
                                                  variant="destructive"
                                                  onClick={() => handleCancel(booking)}
                                                  className="flex items-center gap-1"
                                             >
                                                  <Trash2 className="w-3 h-3" /> Cancel
                                             </Button>

                                             <Button
                                                  size="xs"
                                                  onClick={() => router.push(`/review/${booking.roomId}`)}
                                                  className="flex items-center gap-1 ml-auto"
                                             >
                                                  <Star className="w-3 h-3" /> Review
                                             </Button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Reschedule Date Modal */}
                    <FormDialog
                         isOpen={Boolean(selectedBooking)}
                         onClose={() => {
                              setSelectedBooking(null);
                              setNewDate('');
                         }}
                         title="Reschedule Arrival Date"
                         description={selectedBooking ? `Rescheduling reservation for ${selectedBooking.title} (Current Date: ${selectedBooking.date})` : undefined}
                         maxWidth="max-w-md"
                    >
                         <form onSubmit={handleUpdateDate} className="space-y-4">
                              <div>
                                   <label className="block text-xs font-bold uppercase mb-1">
                                        Select New Date
                                   </label>
                                   <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75] text-xs"
                                   />
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                   <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                             setSelectedBooking(null);
                                             setNewDate('');
                                        }}
                                   >
                                        Cancel
                                   </Button>
                                   <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isUpdating}
                                   >
                                        {isUpdating ? 'Updating...' : 'Save New Date'}
                                   </Button>
                              </div>
                         </form>
                    </FormDialog>
               </div>
          </PrivateRoute>
     );
};

export default MyBookings;
