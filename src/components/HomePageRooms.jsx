'use client';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BedDouble, Users, Eye } from "lucide-react";
import Link from "next/link";

function HomePageRooms() {
    const [allRooms, setAllRooms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`)
            .then((response) => setAllRooms(response.data))
            .catch((error) => toast.error("Failed to fetch rooms data"));
    }, []);

    const settings = {
        className: "center",
        infinite: true,
        pauseOnHover: true,
        autoplay: true,
        autoplaySpeed: 2000,
        centerPadding: "60px",
        slidesToShow: 4, // default for xl
        speed: 500,
        responsive: [
            {
                breakpoint: 1280, // less than xl
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024, // less than lg
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // less than md
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    

    return (
        <div className="py-10 space-y-10 bg-[#1c1c1c]">
           <div className="text-center  font-mono">
                <h1 className="text-white font-extrabold text-5xl">EXPLORE YOUR ROOM</h1>
                <h1 className="text-white font-extrabold text-3xl">Find Rooms Based On Interests</h1>
           </div>
            <div className="w-full  overflow-x-hidden bg-[#1c1c1c]">
                <Slider {...settings}>
                    {allRooms.map((room, idx) => (
                        <div key={idx} className="px-3">
                            <div className="relative group overflow-hidden rounded-md border-4  border-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-transform duration-500 transform ">
                                <img
                                    src={room.images.main}
                                    className="object-cover w-full h-80 md:h-[30vw] lg:h-[20vw] xl:h-[15vw] rounded-t-md transition-transform duration-500 transform hover:scale-102"
                                    alt={room.title}
                                />
                                <div className="absolute top-6 left-3 bg-white/80 text-gray-800 text-xs font-semibold px-2 py-1 rounded shadow">
                                    Room #{room.roomNumber}
                                </div>
                                <div className="p-5 space-y-4">
                                    <h3 className="text-xl font-extrabold uppercase tracking-wide text-center">
                                        {room.title}
                                    </h3>
                                    <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" /> {room.maxGuests} Guests
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> {room.view}
                                        </span>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => router.push(`/roomDetails/${room._id}`)}
                                            className="relative text-xs xl:text-sm uppercase after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:translate-x-[0%]">view details</button>
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