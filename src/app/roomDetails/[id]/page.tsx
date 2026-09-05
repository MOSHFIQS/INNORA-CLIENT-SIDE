'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import notFound from '../../not-found';
import {
     BedDouble,
     Ruler,
     Users,
     Eye,
     ShieldCheck,
     Wifi,
     Tv,
     Coffee,
     Bath,
     Lock,
     AlertTriangle,
     FireExtinguisher,
     CheckCircle,
     XCircle,
     Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading';
import { useGetRoomByIdQuery } from '@/redux/api/roomApi';

const iconMap = {
     WiFi: Wifi,
     'Smart TV': Tv,
     'Coffee Maker': Coffee,
     Jacuzzi: Bath,
     'Room Service': ShieldCheck,
     'Smoke Detector': AlertTriangle,
     'Fire Extinguisher': FireExtinguisher,
     'Safe Box': Lock,
};

const FeatureBadge = ({ icon: Icon, text }) => (
     <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition">
          <Icon className="text-[#b99d75] w-5 h-5" />
          <span className="text-sm font-medium">{text}</span>
     </div>
);

const Page = () => {
     const router = useRouter();
     const params = useParams();
     const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const { data: room, isLoading, error } = useGetRoomByIdQuery(id);

     if (isLoading) return <Loading />;
     if (error || !room) return notFound();

     const bookedDates = room.bookedDates || [];

     return (
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 uppercase">
               {/* Hero Section */}
               <div className="relative w-full h-[70vh] overflow-hidden">
                    <img
                         src={room.images?.main || '/fallback.jpg'}
                         alt={room.title || 'Room Image'}
                         className="object-cover w-full h-full scale-100 transition-transform duration-1000 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/80 text-gray-800 dark:text-white px-4 py-1 text-xs font-bold uppercase tracking-widest">
                         Room #{room.roomNumber}
                    </div>
                    <div className="absolute bottom-8 left-8 text-white">
                         <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg font-serif">{room.title}</h1>
                         <p className="text-sm md:text-base mt-2 text-gray-200 tracking-wider">
                              {room.type} • {room.view} View
                         </p>
                    </div>
               </div>

               {/* Content */}
               <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6 }}
                         className="md:col-span-2 space-y-10"
                    >
                         {/* Basic Info */}
                         <div className="space-y-2">
                              <h2 className="text-2xl font-bold font-serif">
                                   {room.type} Room #{room.roomNumber}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">
                                   Floor: {room.floor} • View: {room.view} • Size: {room.roomSizeSqFt} sqft
                              </p>
                              <div className="flex flex-wrap gap-4 mt-4">
                                   <FeatureBadge icon={BedDouble} text={`${room.bedType} Bed`} />
                                   <FeatureBadge icon={Ruler} text={`${room.roomSizeSqFt} sqft`} />
                                   <FeatureBadge icon={Users} text={`Max ${room.maxGuests} Guests`} />
                                   <FeatureBadge icon={Eye} text={`${room.view} View`} />
                              </div>
                         </div>

                         {/* Description */}
                         <div>
                              <h3 className="text-lg font-bold mb-2 uppercase text-[#b99d75]">About this room</h3>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm normal-case">
                                   {room.description}
                              </p>
                         </div>

                         {/* Room Features */}
                         <div>
                              <h3 className="text-lg font-bold mb-4 uppercase text-[#b99d75]">Room Features</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                   {(room.features || []).map((feature, i) => {
                                        const Icon = iconMap[feature] || ShieldCheck;
                                        return <FeatureBadge key={i} icon={Icon} text={feature} />;
                                   })}
                              </div>
                         </div>

                         {/* Safety Features */}
                         <div>
                              <h3 className="text-lg font-bold mb-4 uppercase text-[#b99d75]">Safety Features</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                   {(room.safetyFeatures || []).map((feature, i) => {
                                        const Icon = iconMap[feature] || ShieldCheck;
                                        return <FeatureBadge key={i} icon={Icon} text={feature} />;
                                   })}
                              </div>
                         </div>

                         {/* Guest Reviews Section */}
                         {room.reviews && room.reviews.length > 0 && (
                              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                   <h3 className="text-lg font-bold mb-4 uppercase text-[#b99d75]">
                                        Guest Reviews ({room.reviewsCount})
                                   </h3>
                                   <div className="space-y-4">
                                        {room.reviews.map((rev) => (
                                             <div key={rev.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                                  <div className="flex justify-between items-center mb-1">
                                                       <span className="font-bold text-xs">{rev.userName}</span>
                                                       <div className="flex text-amber-500">
                                                            {Array.from({ length: rev.rating }).map((_, idx) => (
                                                                 <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                                                            ))}
                                                       </div>
                                                  </div>
                                                  <p className="text-xs text-gray-600 dark:text-gray-300 normal-case">{rev.comment}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </motion.div>

                    {/* Booking Sidebar */}
                    <motion.div
                         initial={{ opacity: 0, x: 30 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.6 }}
                         className="bg-gray-50 dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6 lg:sticky top-24 h-fit"
                    >
                         {bookedDates.length > 0 && (
                              <div className="text-center font-bold text-xs bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                                   <p className="mb-2">Unavailable on the following dates:</p>
                                   <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                        {bookedDates.map((date, idx) => (
                                             <span key={idx} className="px-2 py-0.5 text-[10px] bg-red-100 dark:bg-red-900/50 rounded">
                                                  {date}
                                             </span>
                                        ))}
                                   </div>
                              </div>
                         )}

                         <div className="flex flex-col space-y-4 text-center">
                              <div>
                                   <span className="text-4xl font-extrabold text-[#b99d75]">
                                        ${room.pricePerNight}
                                   </span>
                                   <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                        {' '} / night
                                   </span>
                              </div>

                              <div className="flex justify-center items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                   <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                   <span>{room.rating} Rating ({room.reviewsCount} reviews)</span>
                              </div>

                              <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                   {room.isAvailable ? (
                                        <CheckCircle className="text-emerald-500 w-4 h-4" />
                                   ) : (
                                        <XCircle className="text-red-500 w-4 h-4" />
                                   )}
                                   <span className="text-xs font-bold uppercase">
                                        {room.isAvailable ? 'Available for Booking' : 'Currently Unavailable'}
                                   </span>
                              </div>

                              <button
                                   onClick={() => router.push(`/booking/${room.id || room._id}`)}
                                   disabled={!room.isAvailable}
                                   className={`w-full py-3 text-white font-bold uppercase tracking-wider transition ${
                                        room.isAvailable
                                             ? 'bg-[#b99d75] hover:bg-[#a68c65] cursor-pointer'
                                             : 'bg-gray-400 cursor-not-allowed'
                                   }`}
                              >
                                   {room.isAvailable ? 'Book This Room' : 'Unavailable'}
                              </button>

                              <button
                                   onClick={() => router.push(`/review/${room.id || room._id}`)}
                                   className="w-full py-2 border border-gray-300 dark:border-gray-600 text-xs uppercase font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              >
                                   Leave a Review
                              </button>
                         </div>
                    </motion.div>
               </div>
          </div>
     );
};

export default Page;
