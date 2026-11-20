'use client';

import PrivateRoute from '@/privateRoute/PrivateRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import {
     useGetMyBookingsQuery,
     useCancelBookingMutation,
} from '@/redux/api/bookingApi';
import Loading from '@/app/loading';
import {
     Calendar as CalendarIcon,
     Trash2,
     Star,
     Building,
     Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyBookings = () => {
     const { user } = useAuth();
     const router = useRouter();
     const { data: myBookings = [], isLoading } = useGetMyBookingsQuery();
     const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

     // Cancel reservation handler
     const handleCancel = async (booking: any) => {
          // Guard: Confirmed bookings cannot be cancelled!
          if (booking.status === 'CONFIRMED') {
               toast.error('Confirmed reservations cannot be cancelled directly. Please contact our front desk.');
               return;
          }

          if (!confirm(`Are you sure you want to cancel your reservation for ${booking.title}?`)) return;

          try {
               await cancelBooking({
                    idOrEmail: booking.id || booking._id,
                    roomId: booking.roomId,
                    date: booking.date,
               }).unwrap();
               toast.success('Reservation cancelled successfully');
          } catch (err: any) {
               toast.error(err?.data?.message || 'Failed to cancel reservation');
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
                                   className="btn rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs px-6 py-2 cursor-pointer"
                              >
                                   Browse Luxury Rooms
                              </button>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {myBookings.map((booking: any) => {
                                   const dateList: string[] = (booking.date || '')
                                        .split(',')
                                        .map((d: string) => d.trim())
                                        .filter(Boolean);

                                   const nights = booking.totalNights || dateList.length || 1;
                                   const rate = booking.price || (booking.room?.pricePerNight ?? 0);
                                   const total = booking.totalAmount || rate * nights;
                                   const isConfirmed = booking.status === 'CONFIRMED';
                                   const isPending = booking.status === 'PENDING';
                                   const isCancelled = booking.status === 'CANCELLED';

                                   return (
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
                                                       <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                                                            #{booking.bookingNumber || booking.roomId}
                                                       </div>
                                                       <div
                                                            className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider ${
                                                                 isConfirmed
                                                                      ? 'bg-emerald-600'
                                                                      : isPending
                                                                      ? 'bg-amber-600'
                                                                      : isCancelled
                                                                      ? 'bg-red-600'
                                                                      : 'bg-gray-700'
                                                            }`}
                                                       >
                                                            {booking.status}
                                                       </div>
                                                  </div>

                                                  <div className="p-6 space-y-3">
                                                       <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase truncate font-serif">
                                                            {booking.title}
                                                       </h3>

                                                       <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                                            {/* Dates Display */}
                                                            <div>
                                                                 <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                                                                      <CalendarIcon className="w-3.5 h-3.5 text-[#b99d75]" />
                                                                      <span>
                                                                           Reserved Date{dateList.length > 1 ? 's' : ''}:
                                                                      </span>
                                                                 </div>
                                                                 <div className="flex flex-wrap gap-1.5">
                                                                      {dateList.map((d: string, idx: number) => (
                                                                           <span
                                                                                key={idx}
                                                                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-medium text-gray-800 dark:text-gray-200"
                                                                           >
                                                                                {d}
                                                                           </span>
                                                                      ))}
                                                                 </div>
                                                            </div>

                                                            {/* Pricing & Duration Breakdown */}
                                                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                                                                 <span className="text-gray-500 dark:text-gray-400">
                                                                      Duration:{' '}
                                                                      <strong className="text-gray-900 dark:text-white">
                                                                           {nights} night{nights > 1 ? 's' : ''}
                                                                      </strong>
                                                                 </span>
                                                                 <span className="text-gray-500 dark:text-gray-400">
                                                                      Total:{' '}
                                                                      <strong className="text-sm font-bold text-[#b99d75]">
                                                                           ${Number(total).toFixed(2)}
                                                                      </strong>
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Actions Toolbar */}
                                             <div className="p-6 pt-0 flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                  {/* Cancellation handling: Locked for Confirmed bookings */}
                                                  {isConfirmed ? (
                                                       <span
                                                            title="Confirmed bookings cannot be cancelled"
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 select-none"
                                                       >
                                                            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                            Non-Cancellable
                                                       </span>
                                                  ) : isPending ? (
                                                       <Button
                                                            size="xs"
                                                            variant="destructive"
                                                            disabled={isCancelling}
                                                            onClick={() => handleCancel(booking)}
                                                            className="flex items-center gap-1 cursor-pointer font-semibold"
                                                       >
                                                            <Trash2 className="w-3 h-3" /> Cancel
                                                       </Button>
                                                  ) : isCancelled ? (
                                                       <span className="text-[11px] font-semibold text-red-500 italic px-2 py-1">
                                                            Cancelled
                                                       </span>
                                                  ) : null}

                                                  <Button
                                                       size="xs"
                                                       onClick={() => router.push(`/review/${booking.roomId}`)}
                                                       className="flex items-center gap-1 ml-auto cursor-pointer"
                                                  >
                                                       <Star className="w-3 h-3" /> Review
                                                  </Button>
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    )}
               </div>
          </PrivateRoute>
     );
};

export default MyBookings;
