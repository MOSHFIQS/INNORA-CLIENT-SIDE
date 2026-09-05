'use client';

import Loading from '@/app/loading';
import { useAuth } from '@/hooks/useAuth';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetRoomByIdQuery } from '@/redux/api/roomApi';
import { useCreateBookingMutation } from '@/redux/api/bookingApi';

const BookingPage = () => {
     const params = useParams();
     const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const { user, isAuthenticated } = useAuth();
     const router = useRouter();

     const { data: roomBookingDetails, isLoading: isRoomLoading, error } = useGetRoomByIdQuery(id);
     const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
     const [specialRequests, setSpecialRequests] = useState('');
     const [guests, setGuests] = useState(1);

     const handleBooking = async (e) => {
          e.preventDefault();
          if (!roomBookingDetails) return;

          const date = e.target.date.value;
          const userEmail = user?.email;
          const userName = user?.fullName || `${user?.firstName || 'Guest'} ${user?.lastName || 'User'}`;

          const bookingDetails = {
               roomId: roomBookingDetails.id || roomBookingDetails.roomId,
               date,
               price: roomBookingDetails.pricePerNight,
               title: roomBookingDetails.title,
               image: roomBookingDetails.images?.main,
               userEmail,
               userName,
               guests: Number(guests) || 1,
               specialRequests,
          };

          try {
               await createBooking(bookingDetails).unwrap();
               toast.success('Reservation successfully confirmed! Welcome to INNORA.');
               router.push('/myBookings');
          } catch (err) {
               const errorMsg = err?.data?.message || err?.message || 'Something went wrong while processing your booking.';
               toast.error(errorMsg);
          }
     };

     if (isRoomLoading) return <Loading />;
     if (error || !roomBookingDetails) return notFound();

     return (
          <div className="max-w-4xl mx-auto my-8 p-4 md:p-8 bg-white dark:bg-[#202020] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-2xl">
               {/* Room Image Banner */}
               <div className="h-[350px] md:h-[450px] w-full relative overflow-hidden mb-6">
                    <img
                         src={roomBookingDetails.images?.main || '/fallback.jpg'}
                         alt={roomBookingDetails.title || 'Room image'}
                         className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
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
                              <span className="font-bold text-[#b99d75]">Rate:</span> ${roomBookingDetails.pricePerNight} / night
                         </p>
                         <p>
                              <span className="font-bold text-[#b99d75]">Max Guests:</span> {roomBookingDetails.maxGuests}
                         </p>
                    </div>

                    {/* Booking Date & Guests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                              <label htmlFor="bookingDate" className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Select Arrival Date *
                              </label>
                              <input
                                   type="date"
                                   id="bookingDate"
                                   name="date"
                                   required
                                   className="w-full border border-gray-300 dark:border-gray-700 p-3 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   min={new Date().toISOString().split('T')[0]}
                              />
                         </div>

                         <div>
                              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Number of Guests
                              </label>
                              <select
                                   value={guests}
                                   onChange={(e) => setGuests(Number(e.target.value))}
                                   className="w-full border border-gray-300 dark:border-gray-700 p-3 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                              >
                                   {Array.from({ length: roomBookingDetails.maxGuests || 2 }).map((_, idx) => (
                                        <option key={idx + 1} value={idx + 1} className="dark:bg-[#202020]">
                                             {idx + 1} {idx === 0 ? 'Guest' : 'Guests'}
                                        </option>
                                   ))}
                              </select>
                         </div>
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

                    {/* Submit */}
                    <div>
                         <button
                              type="submit"
                              disabled={isBookingLoading}
                              className="w-full py-3.5 bg-[#b99d75] hover:bg-[#a68c65] text-white font-bold uppercase tracking-widest transition duration-300 cursor-pointer disabled:opacity-50"
                         >
                              {isBookingLoading ? 'Confirming Reservation...' : 'Confirm Reservation'}
                         </button>
                    </div>
               </form>
          </div>
     );
};

export default BookingPage;
