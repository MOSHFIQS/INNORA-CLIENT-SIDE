'use client';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BedDouble, Users, Eye } from "lucide-react";

function HomePageRooms() {
    const [allRooms, setAllRooms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("http://localhost:5000/rooms")
            .then((response) => setAllRooms(response.data))
            .catch((error) => toast.error("Failed to fetch rooms data"));
    }, []);

    const settings = {
        className: "center",
        infinite: true,
        pauseOnHover: true,
        autoplay: true,
        autoplaySpeed: 5000,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="w-full py-10 overflow-x-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            <Slider {...settings}>
                {allRooms.map((room, idx) => (
                    <div key={idx} className="px-3">
                        <div className="relative group overflow-hidden rounded-md  shadow-lg bg-white border border-white/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-transform duration-500 transform hover:scale-101">
                            <img
                                src={room.images.main}
                                className="object-cover w-full h-56 md:h-60 lg:h-72 xl:h-96 rounded-t-md transition-transform duration-500 transform hover:scale-105"
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
                                        onClick={() => router.push(room._id)}
                                        className="mt-2 inline-block px-6 py-2 text-sm font-semibold tracking-wide text-white bg-black/65 border border-white rounded-lg shadow hover:bg-black/70 transition-all duration-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HomePageRooms;