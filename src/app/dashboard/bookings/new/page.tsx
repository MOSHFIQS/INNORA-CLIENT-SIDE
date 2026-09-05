'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/app/loading';
import { useGetRoomsQuery } from '@/redux/api/roomApi';
import { useCreateBookingMutation } from '@/redux/api/bookingApi';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
     CalendarCheck,
     BedDouble,
     User,
     DollarSign,
     Sparkles,
     ArrowLeft,
     Save,
     Loader2,
     Calendar,
     CreditCard,
     Clock,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateBookingPage() {
     const router = useRouter();
     const { user, isStaff, isAdmin, isSuperAdmin } = useAuth();
     const isManagement = isStaff || isAdmin || isSuperAdmin;

     const { data: roomsData, isLoading: isRoomsLoading } = useGetRoomsQuery();
     const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

     const rooms = useMemo(() => {
          const raw = Array.isArray(roomsData) ? roomsData : roomsData?.data || [];
          return raw.filter((r) => r.isAvailable !== false);
     }, [roomsData]);

     const [selectedRoomId, setSelectedRoomId] = useState('');
     const [stayDate, setStayDate] = useState(
          new Date().toISOString().split('T')[0]
     );
     const [guestName, setGuestName] = useState(
          isManagement ? '' : user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
     );
     const [guestEmail, setGuestEmail] = useState(
          isManagement ? '' : user?.email || ''
     );
     const [guestPhone, setGuestPhone] = useState(user?.phone || '');
     const [guestsCount, setGuestsCount] = useState(1);
     const [specialRequests, setSpecialRequests] = useState('');
     const [customRate, setCustomRate] = useState('');

     const selectedRoom = useMemo(() => {
          return rooms.find((r) => r.id === selectedRoomId || r.roomId === selectedRoomId) || rooms[0];
     }, [rooms, selectedRoomId]);

     const effectivePrice = customRate ? Number(customRate) : selectedRoom ? Number(selectedRoom.pricePerNight || selectedRoom.price || 0) : 0;

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!selectedRoom) {
               toast.error('Please select a suite for this reservation');
               return;
          }

          if (!stayDate) {
               toast.error('Please select a stay date');
               return;
          }

          if (!guestEmail.trim()) {
               toast.error('Guest email is required');
               return;
          }

          const roomMainImage = (Array.isArray(selectedRoom.images) ? selectedRoom.images[0] : selectedRoom.images?.main) || selectedRoom.image || '/images/suite-placeholder.jpg';

          const payload = {
               roomId: selectedRoom.id || selectedRoom.roomId,
               date: stayDate,
               userName: guestName.trim() || 'Valued Guest',
               userEmail: guestEmail.toLowerCase().trim(),
               userPhone: guestPhone.trim() || null,
               guests: Number(guestsCount || 1),
               specialRequests: specialRequests.trim() || null,
               price: effectivePrice,
               title: selectedRoom.title,
               image: roomMainImage,
          };

          try {
               const res = await createBooking(payload).unwrap();
               toast.success('Reservation created successfully!');
               router.push('/dashboard/bookings');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to create reservation');
          }
     };

     if (isRoomsLoading) {
          return <Loading />;
     }

     return (
          <div className="space-y-6 max-w-4xl mx-auto">
               <PageHeader
                    title="Create New Reservation"
                    description={
                         isManagement
                              ? 'Issue front-desk walk-in reservations, concierge bookings, or phone bookings.'
                              : 'Reserve your next luxury stay at INNORA Hotel & Suites.'
                    }
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reservations', href: '/dashboard/bookings' },
                         { label: 'New Reservation' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/bookings"
                              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back to Bookings</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Suite Selection */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <BedDouble className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Suite Selection & Stay Schedule
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Select Suite *
                                   </label>
                                   <select
                                        value={selectedRoomId || selectedRoom?.id}
                                        onChange={(e) => {
                                             setSelectedRoomId(e.target.value);
                                             setCustomRate('');
                                        }}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-medium"
                                   >
                                        {rooms.map((r) => (
                                             <option key={r.id} value={r.id}>
                                                  {r.title} (Suite #{r.roomNumber}) - ${r.pricePerNight || r.price}/night
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Scheduled Stay Date *
                                   </label>
                                   <input
                                        type="date"
                                        required
                                        value={stayDate}
                                        onChange={(e) => setStayDate(e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Total Guests
                                   </label>
                                   <input
                                        type="number"
                                        min="1"
                                        max={selectedRoom?.maxGuests || 10}
                                        value={guestsCount}
                                        onChange={(e) => setGuestsCount(Number(e.target.value) || 1)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              {isManagement && (
                                   <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Nightly Rate Override ($)
                                        </label>
                                        <input
                                             type="number"
                                             min="0"
                                             placeholder={`Default: $${selectedRoom?.pricePerNight || selectedRoom?.price || 0}`}
                                             value={customRate}
                                             onChange={(e) => setCustomRate(e.target.value)}
                                             className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono font-bold"
                                        />
                                   </div>
                              )}
                         </div>

                         {/* Selected Room Preview Card */}
                         {selectedRoom && (
                              <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4 mt-2">
                                   <div className="w-24 h-16 bg-gray-200 dark:bg-gray-800 shrink-0 overflow-hidden">
                                        <img
                                             src={(Array.isArray(selectedRoom.images) ? selectedRoom.images[0] : selectedRoom.images?.main) || selectedRoom.image || '/images/suite-placeholder.jpg'}
                                             alt={selectedRoom.title}
                                             className="w-full h-full object-cover"
                                        />
                                   </div>
                                   <div className="space-y-0.5 text-center sm:text-left flex-1 min-w-0">
                                        <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white truncate">
                                             {selectedRoom.title}
                                        </h4>
                                        <p className="text-[11px] text-gray-500">
                                             Suite #{selectedRoom.roomNumber} • {selectedRoom.type || 'Deluxe'} • {selectedRoom.view || 'Ocean View'} • Up to {selectedRoom.maxGuests || 2} Guests
                                        </p>
                                   </div>
                                   <div className="text-right shrink-0">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Rate Per Night</span>
                                        <strong className="text-base font-serif font-bold text-[#b99d75]">
                                             ${effectivePrice.toLocaleString()}
                                        </strong>
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Guest Information */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <User className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Guest Folio & Contact Coordinates
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
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        placeholder="e.g. Eleanor Vance"
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
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        placeholder="eleanor@luxury.com"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Guest Phone
                                   </label>
                                   <input
                                        type="text"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                        placeholder="+1 (555) 019-2834"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1 sm:col-span-3">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Special Requests & Concierge Preferences
                                   </label>
                                   <textarea
                                        rows={3}
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        placeholder="Airport limousine arrival time, chilled vintage champagne in suite, hypoallergenic feather pillows..."
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
                              disabled={isSubmitting}
                              className="flex items-center gap-2 px-8 py-3 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-md font-serif"
                         >
                              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Confirm Reservation</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
