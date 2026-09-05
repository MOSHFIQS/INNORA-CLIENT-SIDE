'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import Loading from '@/app/loading';
import { useGetRoomByIdQuery, useToggleRoomAvailabilityMutation } from '@/redux/api/roomApi';
import { useParams } from 'next/navigation';
import {
     BedDouble,
     DollarSign,
     Sparkles,
     Layers,
     Users,
     Check,
     X,
     ArrowLeft,
     Edit3,
     MapPin,
     Calendar,
     CheckCircle2,
     Star,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RoomDetailPage() {
     const params = useParams();
     const roomId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

     const { data: room, isLoading } = useGetRoomByIdQuery(roomId, { skip: !roomId });
     const [toggleAvailability] = useToggleRoomAvailabilityMutation();

     if (isLoading) return <Loading />;

     if (!room) {
          return (
               <div className="p-12 text-center bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 font-semibold">Suite not found.</p>
                    <Link href="/dashboard/rooms" className="text-xs text-[#b99d75] font-bold underline mt-2 block">
                         Back to Suites Inventory
                    </Link>
               </div>
          );
     }

     const images = Array.isArray(room.images)
          ? room.images
          : room.images && typeof room.images === 'object'
          ? [room.images.main, ...(room.images.gallery || [])].filter(Boolean)
          : [room.image || '/images/suite-placeholder.jpg'];

     const handleToggle = async () => {
          try {
               await toggleAvailability(room.id || roomId).unwrap();
               toast.success('Room availability status updated');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to toggle availability');
          }
     };

     return (
          <div className="space-y-6 max-w-5xl mx-auto">
               <PageHeader
                    title={room.title}
                    description={`Suite #${room.roomNumber} • ${room.type || 'Deluxe'} • Floor ${room.floor || 1}`}
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Suites & Rooms', href: '/dashboard/rooms' },
                         { label: room.title },
                    ]}
                    actions={
                         <div className="flex items-center gap-2">
                              <Link
                                   href="/dashboard/rooms"
                                   className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                              >
                                   <ArrowLeft className="w-4 h-4" />
                                   <span>Back</span>
                              </Link>

                              <Link
                                   href={`/dashboard/rooms/${room.id || roomId}/edit`}
                                   className="flex items-center gap-1.5 px-4 py-2 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                              >
                                   <Edit3 className="w-4 h-4" />
                                   <span>Edit Suite</span>
                              </Link>
                         </div>
                    }
               />

               {/* Suite Gallery Hero */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 h-72 sm:h-96 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 overflow-hidden relative">
                         <img src={images[0]} alt={room.title} className="w-full h-full object-cover" />
                         {room.isFeatured && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-[#b99d75] text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                                   Featured Signature Suite
                              </div>
                         )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3 h-72 sm:h-96">
                         {images.slice(1, 3).map((img, i) => (
                              <div key={i} className="h-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 overflow-hidden">
                                   <img src={img} alt={`${room.title} ${i}`} className="w-full h-full object-cover" />
                              </div>
                         ))}
                    </div>
               </div>

               {/* Key Specs Card */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Nightly Rate</span>
                         <span className="text-xl font-bold font-serif text-[#b99d75] block mt-0.5">
                              ${Number(room.pricePerNight || room.price || 0).toLocaleString()}
                         </span>
                         {room.discount > 0 && <span className="text-[10px] text-emerald-500 font-bold">-${room.discount} Promotional Offer</span>}
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Max Guests</span>
                         <span className="text-xl font-bold font-serif text-gray-900 dark:text-white block mt-0.5">
                              {room.maxGuests || room.capacity || 2} Guests
                         </span>
                         <span className="text-[10px] text-gray-400">{room.bedType || 'King Bed'}</span>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Living Area</span>
                         <span className="text-xl font-bold font-serif text-gray-900 dark:text-white block mt-0.5">
                              {room.roomSizeSqFt || 450} sq. ft.
                         </span>
                         <span className="text-[10px] text-gray-400">{room.view || 'Scenic View'}</span>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Live Status</span>
                         <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={room.status} />
                              <button
                                   onClick={handleToggle}
                                   className="text-[10px] font-bold text-[#b99d75] underline hover:text-[#a68c65] cursor-pointer"
                              >
                                   {room.isAvailable !== false ? 'Live' : 'Hidden'}
                              </button>
                         </div>
                    </div>
               </div>

               {/* Description & Amenities */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                              Suite Narrative
                         </h3>
                         <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                              {room.description || room.shortDescription || 'Experience timeless elegance and personalized luxury hospitality.'}
                         </p>

                         {room.shortDescription && (
                              <div className="p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 text-xs italic text-gray-700 dark:text-gray-300">
                                   &ldquo;{room.shortDescription}&rdquo;
                              </div>
                         )}
                    </div>

                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                              Included Amenities
                         </h3>
                         <div className="space-y-2">
                              {(Array.isArray(room.features) ? room.features : []).map((feat, i) => (
                                   <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#b99d75] shrink-0" />
                                        <span>{feat}</span>
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}
