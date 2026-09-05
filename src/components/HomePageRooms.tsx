'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/navigation';
import { Users, Eye, Star } from 'lucide-react';
import Loading from '@/app/loading';
import { useGetHomePageRoomsQuery } from '@/redux/api/roomApi';

function HomePageRooms() {
     const { data: allRooms = [], isLoading } = useGetHomePageRoomsQuery();
     const router = useRouter();

     const settings = {
          className: 'center',
          infinite: allRooms.length > 3,
          pauseOnHover: true,
          autoplay: true,
          autoplaySpeed: 2500,
          centerPadding: '60px',
          slidesToShow: 4,
          speed: 600,
          responsive: [
               {
                    breakpoint: 1280,
                    settings: {
                         slidesToShow: 3,
                    },
               },
               {
                    breakpoint: 1024,
                    settings: {
                         slidesToShow: 2,
                    },
               },
               {
                    breakpoint: 768,
                    settings: {
                         slidesToShow: 1,
                    },
               },
          ],
     };

     if (isLoading) {
          return <Loading />;
     }

     return (
          <div className="pt-14 pb-8 space-y-10 bg-white dark:text-white dark:bg-[#1c1c1c]">
               <div className="text-center space-y-2">
                    <p className="text-xs uppercase font-bold tracking-widest text-[#b99d75]">Signature Accommodations</p>
                    <h2 className="font-extrabold text-3xl md:text-5xl font-serif">EXPLORE YOUR ROOM</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Discover curated luxury tailored for unforgettable stays</p>
               </div>
               <div className="w-full overflow-x-hidden dark:bg-[#1c1c1c] px-2 md:px-6">
                    <Slider {...settings}>
                         {allRooms.map((room) => (
                              <div key={room.id || room._id} className="px-3">
                                   <div className="relative group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202020] dark:text-gray-100 shadow-md hover:shadow-2xl transition-all duration-300">
                                        <div className="overflow-hidden relative h-64 md:h-72">
                                             <img
                                                  src={room.images?.main || '/fallback.jpg'}
                                                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                  alt={room.title}
                                             />
                                             <div className="absolute top-4 left-4 bg-black/75 text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wider backdrop-blur-sm">
                                                  Room #{room.roomNumber}
                                             </div>
                                             <div className="absolute top-4 right-4 bg-[#b99d75] text-white text-xs font-bold px-2 py-1 flex items-center gap-1 shadow">
                                                  <Star className="w-3 h-3 fill-white" /> {room.rating || '5.0'}
                                             </div>
                                             <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm font-bold px-3 py-1">
                                                  ${room.pricePerNight} <span className="text-[10px] font-normal">/ night</span>
                                             </div>
                                        </div>
                                        <div className="p-5 space-y-3">
                                             <h3 className="text-lg font-bold uppercase tracking-wide truncate text-gray-900 dark:text-white">
                                                  {room.title}
                                             </h3>
                                             <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-2">
                                                  <span className="flex items-center gap-1">
                                                       <Users className="w-3.5 h-3.5 text-[#b99d75]" /> {room.maxGuests} Guests
                                                  </span>
                                                  <span className="flex items-center gap-1">
                                                       <Eye className="w-3.5 h-3.5 text-[#b99d75]" /> {room.view} View
                                                  </span>
                                             </div>
                                             <div className="pt-2 flex justify-between items-center">
                                                  <button
                                                       onClick={() => router.push(`/roomDetails/${room.id || room._id}`)}
                                                       className="text-xs uppercase font-bold text-gray-900 dark:text-white hover:text-[#b99d75] transition-colors flex items-center gap-1 cursor-pointer"
                                                  >
                                                       View Details →
                                                  </button>
                                                  <button
                                                       onClick={() => router.push(`/booking/${room.id || room._id}`)}
                                                       className="btn btn-xs rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-[10px]"
                                                  >
                                                       Book Now
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </Slider>
               </div>
          </div>
     );
}

export default HomePageRooms;