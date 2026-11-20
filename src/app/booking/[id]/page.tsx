'use client';

import Loading from '@/app/loading';
import { useAuth } from '@/hooks/useAuth';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetRoomByIdQuery } from '@/redux/api/roomApi';
import { useCreateBookingMutation } from '@/redux/api/bookingApi';
import {
     Calendar as CalendarIcon,
     ChevronLeft,
     ChevronRight,
     AlertCircle,
     X,
     Check,
     Info,
     Clock,
} from 'lucide-react';

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

const BookingPage = () => {
     const params = useParams();
     const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const { user, isAuthenticated } = useAuth();
     const router = useRouter();

     const { data: roomBookingDetails, isLoading: isRoomLoading, error } = useGetRoomByIdQuery(id);
     const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

     const [selectedDates, setSelectedDates] = useState<string[]>([]);
     const [specialRequests, setSpecialRequests] = useState('');
     const [guests, setGuests] = useState(1);

     // Calendar navigation state (current displayed month/year)
     const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), 1);
     });

     const bookedDatesSet = useMemo(() => {
          const list = roomBookingDetails?.bookedDates || [];
          return new Set<string>(list.map((d: string) => d.trim()));
     }, [roomBookingDetails?.bookedDates]);

     const todayStr = useMemo(() => {
          const now = new Date();
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, '0');
          const d = String(now.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
     }, []);

     const currentYear = currentMonthDate.getFullYear();
     const currentMonth = currentMonthDate.getMonth();

     // Days in current view month
     const calendarDays = useMemo(() => {
          const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
          const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

          const days: Array<{
               dayNumber: number;
               dateStr: string;
               isPast: boolean;
               isBooked: boolean;
               isSelected: boolean;
          } | null> = [];

          // Padding before 1st of month
          for (let i = 0; i < firstDayOfWeek; i++) {
               days.push(null);
          }

          // Each day of the month
          for (let d = 1; d <= totalDaysInMonth; d++) {
               const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
               const isPast = dateStr < todayStr;
               const isBooked = bookedDatesSet.has(dateStr);
               const isSelected = selectedDates.includes(dateStr);

               days.push({
                    dayNumber: d,
                    dateStr,
                    isPast,
                    isBooked,
                    isSelected,
               });
          }

          return days;
     }, [currentYear, currentMonth, todayStr, bookedDatesSet, selectedDates]);

     const handlePrevMonth = () => {
          const now = new Date();
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const prev = new Date(currentYear, currentMonth - 1, 1);
          if (prev >= currentMonthStart) {
               setCurrentMonthDate(prev);
          }
     };

     const handleNextMonth = () => {
          setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
     };

     const isPrevDisabled = useMemo(() => {
          const now = new Date();
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return currentMonthDate <= currentMonthStart;
     }, [currentMonthDate]);

     const toggleDate = (dateStr: string) => {
          if (selectedDates.includes(dateStr)) {
               setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
          } else {
               setSelectedDates((prev) => [...prev, dateStr].sort());
          }
     };

     const removeDate = (dateStr: string) => {
          setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
     };

     const clearAllDates = () => {
          setSelectedDates([]);
     };

     const handleBooking = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!roomBookingDetails) return;

          // 1. Authentication check
          if (!isAuthenticated || !user?.email) {
               toast.error('Please sign in first to book a room.');
               router.push(`/signin?redirect=/booking/${id}`);
               return;
          }

          // 2. Date selection check
          if (selectedDates.length === 0) {
               toast.error('Please select at least one available date from the calendar.');
               return;
          }

          const userEmail = user.email;
          const userName = user.fullName || `${user.firstName || 'Guest'} ${user.lastName || 'User'}`;
          const price = roomBookingDetails.pricePerNight || 0;
          const totalNights = selectedDates.length;
          const totalAmount = price * totalNights;

          const bookingDetails = {
               roomId: roomBookingDetails.id || roomBookingDetails.roomId,
               date: selectedDates[0],
               dates: selectedDates,
               price,
               totalAmount,
               totalNights,
               title: roomBookingDetails.title,
               image: roomBookingDetails.images?.main,
               userEmail,
               userName,
               guests: Number(guests) || 1,
               specialRequests,
          };

          try {
               await createBooking(bookingDetails).unwrap();
               toast.success(
                    `Reservation successfully confirmed for ${totalNights} night${totalNights > 1 ? 's' : ''}! Welcome to INNORA.`,
               );
               router.push('/myBookings');
          } catch (err: any) {
               const errorMsg =
                    err?.data?.message || err?.message || 'Something went wrong while processing your booking.';
               toast.error(errorMsg);
          }
     };

     if (isRoomLoading) return <Loading />;
     if (error || !roomBookingDetails) return notFound();

     const pricePerNight = roomBookingDetails.pricePerNight || 0;
     const totalAmount = pricePerNight * selectedDates.length;

     return (
          <div className="max-w-4xl mx-auto my-8 p-4 md:p-8 bg-white dark:bg-[#202020] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-2xl">
               {/* Sign-in Alert for Unauthenticated Users */}
               {!isAuthenticated && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-[#b99d75] text-amber-900 dark:text-amber-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                         <div className="flex items-center gap-2.5">
                              <AlertCircle className="w-5 h-5 text-[#b99d75] shrink-0" />
                              <span>
                                   Please <strong>sign in to your account</strong> first to complete a room reservation.
                              </span>
                         </div>
                         <button
                              type="button"
                              onClick={() => router.push(`/signin?redirect=/booking/${id}`)}
                              className="self-start sm:self-auto font-bold uppercase tracking-wider text-xs px-4 py-2 bg-[#b99d75] hover:bg-[#a68c65] text-white transition shadow cursor-pointer"
                         >
                              Sign In Now
                         </button>
                    </div>
               )}

               {/* Room Image Banner */}
               <div className="h-[300px] md:h-[420px] w-full relative overflow-hidden mb-6">
                    <img
                         src={roomBookingDetails.images?.main || '/fallback.jpg'}
                         alt={roomBookingDetails.title || 'Room image'}
                         className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                         <span className="text-xs uppercase font-bold tracking-widest text-[#b99d75] bg-black/60 px-3 py-1">
                              Reservation Form
                         </span>
                         <h1 className="text-2xl md:text-4xl font-bold font-serif mt-2">{roomBookingDetails.title}</h1>
                    </div>
               </div>

               {/* Room Details Form */}
               <form onSubmit={handleBooking} className="space-y-6">
                    <div>
                         <p className="text-sm text-gray-600 dark:text-gray-300">{roomBookingDetails.shortDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs">
                         <p>
                              <span className="font-bold text-[#b99d75]">Room #:</span> {roomBookingDetails.roomNumber}
                         </p>
                         <p>
                              <span className="font-bold text-[#b99d75]">Type:</span> {roomBookingDetails.type}
                         </p>
                         <p>
                              <span className="font-bold text-[#b99d75]">Rate:</span> ${pricePerNight} / night
                         </p>
                         <p>
                              <span className="font-bold text-[#b99d75]">Max Guests:</span> {roomBookingDetails.maxGuests}
                         </p>
                    </div>

                    {/* Interactive Multi-Date Picker Calendar */}
                    <div className="border border-gray-200 dark:border-gray-700 p-5 bg-gray-50/50 dark:bg-gray-800/40 space-y-4">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                              <div className="flex items-center gap-2">
                                   <CalendarIcon className="w-5 h-5 text-[#b99d75]" />
                                   <div>
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                             Select Booking Dates *
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                             Click dates on the calendar to select single or multiple nights (e.g. Nov 2, 3, 4).
                                        </p>
                                   </div>
                              </div>

                              {/* Month Nav Controls */}
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                   <button
                                        type="button"
                                        onClick={handlePrevMonth}
                                        disabled={isPrevDisabled}
                                        aria-label="Previous Month"
                                        className="p-1.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                   >
                                        <ChevronLeft className="w-4 h-4" />
                                   </button>
                                   <span className="text-xs font-bold font-serif uppercase tracking-wider px-2 min-w-[130px] text-center">
                                        {MONTH_NAMES[currentMonth]} {currentYear}
                                   </span>
                                   <button
                                        type="button"
                                        onClick={handleNextMonth}
                                        aria-label="Next Month"
                                        className="p-1.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                   >
                                        <ChevronRight className="w-4 h-4" />
                                   </button>
                              </div>
                         </div>

                         {/* Calendar Legend */}
                         <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-600 dark:text-gray-400 pt-1">
                              <span className="flex items-center gap-1.5">
                                   <span className="w-3.5 h-3.5 bg-[#b99d75] border border-[#a68c65] inline-block"></span>
                                   Selected
                              </span>
                              <span className="flex items-center gap-1.5">
                                   <span className="w-3.5 h-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 inline-block"></span>
                                   Available
                              </span>
                              <span className="flex items-center gap-1.5">
                                   <span className="w-3.5 h-3.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 inline-block text-red-500 text-center font-bold text-[9px] leading-3">
                                        ✕
                                   </span>
                                   Booked (Disabled)
                              </span>
                         </div>

                         {/* Calendar Grid */}
                         <div className="pt-2">
                              {/* Day names header */}
                              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700">
                                   {DAY_NAMES.map((name) => (
                                        <div key={name}>{name}</div>
                                   ))}
                              </div>

                              {/* Days cells */}
                              <div className="grid grid-cols-7 gap-1.5 pt-2">
                                   {calendarDays.map((item, index) => {
                                        if (!item) {
                                             return <div key={`empty-${index}`} className="h-10 sm:h-12"></div>;
                                        }

                                        const { dayNumber, dateStr, isPast, isBooked, isSelected } = item;
                                        const isDisabled = isPast || isBooked;

                                        let btnClasses =
                                             'h-10 sm:h-12 flex flex-col items-center justify-center text-xs font-semibold rounded-none transition duration-150 border ';

                                        if (isSelected) {
                                             btnClasses +=
                                                  'bg-[#b99d75] text-white border-[#b99d75] ring-2 ring-[#b99d75]/50 shadow-md scale-95 cursor-pointer font-bold';
                                        } else if (isBooked) {
                                             btnClasses +=
                                                  'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-200 dark:border-red-900 cursor-not-allowed line-through opacity-80';
                                        } else if (isPast) {
                                             btnClasses +=
                                                  'bg-gray-100 dark:bg-gray-900/40 text-gray-400 dark:text-gray-600 border-transparent cursor-not-allowed opacity-40';
                                        } else {
                                             btnClasses +=
                                                  'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-[#b99d75] hover:bg-[#b99d75]/10 cursor-pointer';
                                        }

                                        return (
                                             <button
                                                  key={dateStr}
                                                  type="button"
                                                  disabled={isDisabled}
                                                  onClick={() => toggleDate(dateStr)}
                                                  title={
                                                       isBooked
                                                            ? 'Already booked'
                                                            : isPast
                                                            ? 'Past date'
                                                            : isSelected
                                                            ? 'Click to deselect'
                                                            : 'Click to select'
                                                  }
                                                  className={btnClasses}
                                             >
                                                  <span>{dayNumber}</span>
                                                  {isBooked ? (
                                                       <span className="text-[9px] uppercase tracking-tighter text-red-600 dark:text-red-400 font-bold -mt-0.5">
                                                            Booked
                                                       </span>
                                                  ) : isSelected ? (
                                                       <Check className="w-3 h-3 text-white -mt-0.5" />
                                                  ) : null}
                                             </button>
                                        );
                                   })}
                              </div>
                         </div>

                         {/* Selected Dates Summary & Pill Badges */}
                         {selectedDates.length > 0 ? (
                              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                   <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Selected Nights ({selectedDates.length}):
                                        </span>
                                        <button
                                             type="button"
                                             onClick={clearAllDates}
                                             className="text-xs text-red-500 hover:underline uppercase font-bold cursor-pointer"
                                        >
                                             Clear All
                                        </button>
                                   </div>

                                   <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                                        {selectedDates.map((dateStr) => {
                                             const d = new Date(dateStr + 'T00:00:00');
                                             const formatted = d.toLocaleDateString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                                  year: 'numeric',
                                             });

                                             return (
                                                  <span
                                                       key={dateStr}
                                                       className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#b99d75]/15 border border-[#b99d75]/40 text-gray-900 dark:text-white text-xs font-medium"
                                                  >
                                                       <span>{formatted}</span>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeDate(dateStr)}
                                                            className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                                                            aria-label={`Remove ${formatted}`}
                                                       >
                                                            <X className="w-3 h-3" />
                                                       </button>
                                                  </span>
                                             );
                                        })}
                                   </div>

                                   {/* Live Price Calculation Breakdown */}
                                   <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                             <span>Rate:</span>
                                             <span>${pricePerNight} / night</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                             <span>Duration:</span>
                                             <span className="font-bold text-gray-900 dark:text-white">
                                                  {selectedDates.length} night{selectedDates.length > 1 ? 's' : ''}
                                             </span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
                                             <span>Total Price:</span>
                                             <span className="text-[#b99d75] text-base">${totalAmount.toFixed(2)}</span>
                                        </div>
                                   </div>
                              </div>
                         ) : (
                              <div className="text-center py-2 text-xs text-gray-500 dark:text-gray-400 italic">
                                   No dates selected yet. Please click on any available dates above.
                              </div>
                         )}
                    </div>

                    {/* Guests selection */}
                    <div>
                         <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Number of Guests
                         </label>
                         <select
                              value={guests}
                              onChange={(e) => setGuests(Number(e.target.value))}
                              className="w-full border border-gray-300 dark:border-gray-700 p-3 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75] text-sm"
                         >
                              {Array.from({ length: roomBookingDetails.maxGuests || 2 }).map((_, idx) => (
                                   <option key={idx + 1} value={idx + 1} className="dark:bg-[#202020]">
                                        {idx + 1} {idx === 0 ? 'Guest' : 'Guests'}
                                   </option>
                              ))}
                         </select>
                    </div>

                    {/* Special Requests */}
                    <div>
                         <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Special Requests (Optional)
                         </label>
                         <textarea
                              rows={3}
                              placeholder="e.g. Late check-in, high floor preference, airport pickup..."
                              value={specialRequests}
                              onChange={(e) => setSpecialRequests(e.target.value)}
                              className="w-full border border-gray-300 dark:border-gray-700 p-3 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75] text-xs"
                         ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div>
                         <button
                              type="submit"
                              disabled={isBookingLoading}
                              className="w-full py-3.5 bg-[#b99d75] hover:bg-[#a68c65] text-white font-bold uppercase tracking-widest transition duration-300 cursor-pointer disabled:opacity-50"
                         >
                              {isBookingLoading
                                   ? 'Confirming Reservation...'
                                   : selectedDates.length > 0
                                   ? `Confirm Reservation (${selectedDates.length} Night${selectedDates.length > 1 ? 's' : ''} • $${totalAmount.toFixed(2)})`
                                   : 'Confirm Reservation'}
                         </button>
                    </div>
               </form>
          </div>
     );
};

export default BookingPage;
