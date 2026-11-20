'use client';

import PrivateRoute from '@/privateRoute/PrivateRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
     useGetMyBookingsQuery,
     useUpdateBookingDateMutation,
     useCancelBookingMutation,
} from '@/redux/api/bookingApi';
import Loading from '@/app/loading';
import {
     Calendar as CalendarIcon,
     Trash2,
     Edit,
     Star,
     Building,
     Lock,
     CheckCircle,
     ChevronLeft,
     ChevronRight,
     Check,
     X,
     AlertCircle,
     Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormDialog from '@/components/shared/FormDialog';

const MONTH_NAMES = [
     'January',
     'February',
     'March',
     'April',
     'May',
     'June',
     'July',
     'August',
     'September',
     'October',
     'November',
     'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MyBookings = () => {
     const { user } = useAuth();
     const router = useRouter();
     const { data: myBookings = [], isLoading } = useGetMyBookingsQuery();
     const [updateBookingDate, { isLoading: isUpdating }] = useUpdateBookingDateMutation();
     const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

     const [selectedBooking, setSelectedBooking] = useState<any>(null);
     const [rescheduleDates, setRescheduleDates] = useState<string[]>([]);

     // Reschedule calendar navigation state
     const [calMonthDate, setCalMonthDate] = useState<Date>(() => {
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), 1);
     });

     // Today string for comparison
     const todayStr = useMemo(() => {
          const now = new Date();
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, '0');
          const d = String(now.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
     }, []);

     // Open reschedule modal with initial state
     const openRescheduleModal = (booking: any) => {
          setSelectedBooking(booking);
          const currentDates = (booking.date || '')
               .split(',')
               .map((d: string) => d.trim())
               .filter(Boolean);
          setRescheduleDates(currentDates);

          // Focus calendar on the first existing booking date if in the future
          if (currentDates.length > 0 && currentDates[0] >= todayStr) {
               const parts = currentDates[0].split('-');
               if (parts.length === 3) {
                    setCalMonthDate(new Date(Number(parts[0]), Number(parts[1]) - 1, 1));
               }
          } else {
               const now = new Date();
               setCalMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
          }
     };

     const closeRescheduleModal = () => {
          setSelectedBooking(null);
          setRescheduleDates([]);
     };

     // Booked dates by other guests for the selected room
     const otherBookedDatesSet = useMemo(() => {
          if (!selectedBooking) return new Set<string>();
          const allRoomBooked: string[] = selectedBooking.room?.bookedDates || [];
          const myOwnDates: string[] = (selectedBooking.date || '')
               .split(',')
               .map((d: string) => d.trim())
               .filter(Boolean);

          // Exclude this booking's own dates from being marked as unavailable
          const others = allRoomBooked.filter((d) => !myOwnDates.includes(d));
          return new Set<string>(others);
     }, [selectedBooking]);

     // Calendar calculation for reschedule modal
     const currentYear = calMonthDate.getFullYear();
     const currentMonth = calMonthDate.getMonth();

     const calendarDays = useMemo(() => {
          const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
          const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

          const days: Array<{
               dayNumber: number;
               dateStr: string;
               isPast: boolean;
               isBookedByOther: boolean;
               isSelected: boolean;
          } | null> = [];

          for (let i = 0; i < firstDayOfWeek; i++) {
               days.push(null);
          }

          for (let d = 1; d <= totalDaysInMonth; d++) {
               const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
               const isPast = dateStr < todayStr;
               const isBookedByOther = otherBookedDatesSet.has(dateStr);
               const isSelected = rescheduleDates.includes(dateStr);

               days.push({
                    dayNumber: d,
                    dateStr,
                    isPast,
                    isBookedByOther,
                    isSelected,
               });
          }

          return days;
     }, [currentYear, currentMonth, todayStr, otherBookedDatesSet, rescheduleDates]);

     const isPrevDisabled = useMemo(() => {
          const now = new Date();
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return calMonthDate <= currentMonthStart;
     }, [calMonthDate]);

     const handlePrevMonth = () => {
          const now = new Date();
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const prev = new Date(currentYear, currentMonth - 1, 1);
          if (prev >= currentMonthStart) {
               setCalMonthDate(prev);
          }
     };

     const handleNextMonth = () => {
          setCalMonthDate(new Date(currentYear, currentMonth + 1, 1));
     };

     const toggleRescheduleDate = (dateStr: string) => {
          if (rescheduleDates.includes(dateStr)) {
               setRescheduleDates((prev) => prev.filter((d) => d !== dateStr));
          } else {
               setRescheduleDates((prev) => [...prev, dateStr].sort());
          }
     };

     const removeRescheduleDate = (dateStr: string) => {
          setRescheduleDates((prev) => prev.filter((d) => d !== dateStr));
     };

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

     // Reschedule submission
     const handleUpdateDate = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!selectedBooking) return;

          if (rescheduleDates.length === 0) {
               toast.error('Please select at least one available date to reschedule.');
               return;
          }

          const ratePerNight = selectedBooking.price || selectedBooking.room?.pricePerNight || 0;
          const newTotalAmount = ratePerNight * rescheduleDates.length;

          try {
               await updateBookingDate({
                    bookingId: selectedBooking.id || selectedBooking._id,
                    roomId: selectedBooking.roomId,
                    oldDate: selectedBooking.date,
                    newDate: rescheduleDates[0],
                    newDates: rescheduleDates,
                    email: user?.email,
               }).unwrap();

               toast.success(
                    `Reservation successfully rescheduled to ${rescheduleDates.length} night(s) ($${newTotalAmount.toFixed(2)})!`,
               );
               closeRescheduleModal();
          } catch (err: any) {
               toast.error(err?.data?.message || 'Failed to reschedule reservation');
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
                                                  {!isCancelled && (
                                                       <Button
                                                            size="xs"
                                                            variant="secondary"
                                                            onClick={() => openRescheduleModal(booking)}
                                                            className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer font-semibold"
                                                       >
                                                            <Edit className="w-3 h-3" /> Reschedule
                                                       </Button>
                                                  )}

                                                  {/* Cancellation handling: Locked for Confirmed bookings */}
                                                  {isConfirmed ? (
                                                       <span
                                                            title="Confirmed bookings cannot be cancelled"
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 select-none"
                                                       >
                                                            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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

                    {/* Reschedule Multi-Date & Pricing Modal */}
                    <FormDialog
                         isOpen={Boolean(selectedBooking)}
                         onClose={closeRescheduleModal}
                         title="Reschedule Reservation"
                         description={
                              selectedBooking
                                   ? `Reschedule dates for ${selectedBooking.title} (Room #${selectedBooking.room?.roomNumber || selectedBooking.roomId})`
                                   : undefined
                         }
                         maxWidth="max-w-xl"
                    >
                         {selectedBooking && (
                              <form onSubmit={handleUpdateDate} className="space-y-4">
                                   {/* Instructions */}
                                   <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs">
                                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                                        <span>
                                             Click on available dates to choose your new stay dates. Unavailable dates booked by other guests are disabled.
                                        </span>
                                   </div>

                                   {/* Calendar Month Navigation */}
                                   <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <button
                                             type="button"
                                             onClick={handlePrevMonth}
                                             disabled={isPrevDisabled}
                                             className="p-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                             <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="font-serif font-bold uppercase tracking-wider text-xs text-gray-900 dark:text-white">
                                             {MONTH_NAMES[currentMonth]} {currentYear}
                                        </span>
                                        <button
                                             type="button"
                                             onClick={handleNextMonth}
                                             className="p-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                             <ChevronRight className="w-4 h-4" />
                                        </button>
                                   </div>

                                   {/* Day of Week Header */}
                                   <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-500 uppercase pb-1">
                                        {DAY_NAMES.map((d) => (
                                             <div key={d}>{d}</div>
                                        ))}
                                   </div>

                                   {/* Calendar Grid */}
                                   <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((item, index) => {
                                             if (!item) {
                                                  return <div key={`empty-${index}`} className="h-9"></div>;
                                             }

                                             const { dayNumber, dateStr, isPast, isBookedByOther, isSelected } = item;
                                             const isDisabled = isPast || isBookedByOther;

                                             let cellClass =
                                                  'h-9 flex flex-col items-center justify-center text-xs font-semibold border transition ';

                                             if (isSelected) {
                                                  cellClass +=
                                                       'bg-[#b99d75] text-white border-[#b99d75] font-bold shadow-sm cursor-pointer';
                                             } else if (isBookedByOther) {
                                                  cellClass +=
                                                       'bg-red-50 dark:bg-red-950/30 text-red-400 border-red-200 dark:border-red-900 cursor-not-allowed line-through opacity-70';
                                             } else if (isPast) {
                                                  cellClass +=
                                                       'bg-gray-50 dark:bg-gray-900/40 text-gray-400 border-transparent cursor-not-allowed opacity-30';
                                             } else {
                                                  cellClass +=
                                                       'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-[#b99d75] hover:bg-[#b99d75]/10 cursor-pointer';
                                             }

                                             return (
                                                  <button
                                                       key={dateStr}
                                                       type="button"
                                                       disabled={isDisabled}
                                                       onClick={() => toggleRescheduleDate(dateStr)}
                                                       title={
                                                            isBookedByOther
                                                                 ? 'Booked by another guest'
                                                                 : isPast
                                                                 ? 'Past date'
                                                                 : isSelected
                                                                 ? 'Click to deselect'
                                                                 : 'Click to select'
                                                       }
                                                       className={cellClass}
                                                  >
                                                       <span>{dayNumber}</span>
                                                       {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                  </button>
                                             );
                                        })}
                                   </div>

                                   {/* Selected Dates List */}
                                   {rescheduleDates.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                             <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                                  <span>New Stay Dates ({rescheduleDates.length}):</span>
                                                  <button
                                                       type="button"
                                                       onClick={() => setRescheduleDates([])}
                                                       className="text-red-500 hover:underline text-[11px] cursor-pointer"
                                                  >
                                                       Clear
                                                  </button>
                                             </div>
                                             <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                                                  {rescheduleDates.map((dateStr) => (
                                                       <span
                                                            key={dateStr}
                                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#b99d75]/15 border border-[#b99d75]/40 text-gray-900 dark:text-white text-[11px]"
                                                       >
                                                            <span>{dateStr}</span>
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeRescheduleDate(dateStr)}
                                                                 className="text-gray-500 hover:text-red-500 cursor-pointer"
                                                            >
                                                                 <X className="w-3 h-3" />
                                                            </button>
                                                       </span>
                                                  ))}
                                             </div>

                                             {/* Updated Price Calculation */}
                                             <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1 text-xs">
                                                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                       <span>Rate per night:</span>
                                                       <span>${selectedBooking.price || selectedBooking.room?.pricePerNight}</span>
                                                  </div>
                                                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                       <span>New Stay Duration:</span>
                                                       <span className="font-semibold text-gray-900 dark:text-white">
                                                            {rescheduleDates.length} night{rescheduleDates.length > 1 ? 's' : ''}
                                                       </span>
                                                  </div>
                                                  <div className="pt-1.5 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
                                                       <span>New Total Price:</span>
                                                       <span className="text-[#b99d75] font-bold">
                                                            $
                                                            {(
                                                                 (selectedBooking.price || selectedBooking.room?.pricePerNight || 0) *
                                                                 rescheduleDates.length
                                                            ).toFixed(2)}
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>
                                   )}

                                   {/* Action Buttons */}
                                   <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             size="sm"
                                             onClick={closeRescheduleModal}
                                             className="cursor-pointer"
                                        >
                                             Cancel
                                        </Button>
                                        <Button
                                             type="submit"
                                             size="sm"
                                             disabled={isUpdating || rescheduleDates.length === 0}
                                             className="bg-[#b99d75] hover:bg-[#a68c65] text-white cursor-pointer font-bold"
                                        >
                                             {isUpdating ? 'Rescheduling...' : 'Confirm New Dates'}
                                        </Button>
                                   </div>
                              </form>
                         )}
                    </FormDialog>
               </div>
          </PrivateRoute>
     );
};

export default MyBookings;
