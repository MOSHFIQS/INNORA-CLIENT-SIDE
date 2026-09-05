'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useGetRoomsQuery } from '@/redux/api/roomApi';
import { Search, SlidersHorizontal, Users, Star } from 'lucide-react';

const Rooms = () => {
     const [search, setSearch] = useState('');
     const [typeFilter, setTypeFilter] = useState('');
     const [sortOrder, setSortOrder] = useState('desc');
     const router = useRouter();

     const { data: allRooms = [], isLoading } = useGetRoomsQuery({
          search: search || undefined,
          type: typeFilter || undefined,
          sortOrder,
     });

     if (isLoading) {
          return <Loading />;
     }

     return (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
               {/* Header & Filter Controls */}
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#202020] p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div>
                         <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white font-serif">
                              Luxury Rooms & Suites
                         </h1>
                         <p className="text-xs text-gray-500 uppercase">Available suites for your private retreat</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                         <div className="relative flex-1 md:w-64">
                              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                              <input
                                   type="text"
                                   placeholder="Search by title or view..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                              />
                         </div>

                         <select
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                              className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                         >
                              <option value="">All Types</option>
                              <option value="DELUXE">Deluxe</option>
                              <option value="PRESIDENTIAL">Presidential</option>
                              <option value="SUITE">Suite</option>
                              <option value="EXECUTIVE">Executive</option>
                              <option value="FAMILY">Family</option>
                              <option value="STANDARD">Standard</option>
                         </select>
                    </div>
               </div>

               {/* Room Cards Grid */}
               {allRooms.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800">
                         <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No rooms match your filter criteria.</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                         {allRooms.map((room) => (
                              <div
                                   key={room.id || room._id}
                                   onClick={() => router.push(`/roomDetails/${room.id || room._id}`)}
                                   className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-md cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between"
                              >
                                   <div>
                                        <div className="relative h-56 w-full overflow-hidden">
                                             <img
                                                  src={room.images?.main || '/fallback.jpg'}
                                                  alt={room.title}
                                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                             />
                                             <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1">
                                                  Room #{room.roomNumber}
                                             </div>
                                             <div className="absolute top-3 right-3 bg-[#b99d75] text-white text-xs font-bold px-2 py-0.5 flex items-center gap-1 shadow">
                                                  <Star className="w-3 h-3 fill-white" /> {room.rating || '5.0'}
                                             </div>
                                        </div>
                                        <div className="p-5 space-y-3">
                                             <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#b99d75] transition-colors uppercase">
                                                  {room.title}
                                             </h3>
                                             <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                  {room.shortDescription || room.description}
                                             </p>
                                             <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-800">
                                                  <p>
                                                       <strong className="text-[#b99d75]">Type:</strong> {room.type}
                                                  </p>
                                                  <p>
                                                       <strong className="text-[#b99d75]">Bed:</strong> {room.bedType}
                                                  </p>
                                                  <p>
                                                       <strong className="text-[#b99d75]">Guests:</strong> Max {room.maxGuests}
                                                  </p>
                                                  <p>
                                                       <strong className="text-[#b99d75]">View:</strong> {room.view}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 mt-2">
                                        <div>
                                             <span className="text-lg font-extrabold text-[#b99d75]">
                                                  ${room.pricePerNight}
                                             </span>
                                             <span className="text-[10px] text-gray-500 uppercase"> / night</span>
                                        </div>
                                        <button
                                             onClick={(e) => {
                                                  e.stopPropagation();
                                                  router.push(`/booking/${room.id || room._id}`);
                                             }}
                                             className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs"
                                        >
                                             Book Now
                                        </button>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}
          </div>
     );
};

export default Rooms;
