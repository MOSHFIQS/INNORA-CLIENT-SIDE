'use client';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

function HomePageRooms() {

    const [allRooms, setAllRooms] = useState([])
    console.log(allRooms)

    useEffect(() => {
        axios.get('http://localhost:5000/rooms')
            .then(response => setAllRooms(response.data))
            .catch(error => toast.error("Failed to fetch rooms data"));
    }, []);

    const settings = {
        className: "center",
        infinite: true,
        pauseOnHover: true,
        autoplay: true,
        autoplaySpeed: 2000,
        centerPadding: "60px",
        slidesToShow: 3, // Required!
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
        <div className="w-full py-10 ">
            <Slider {...settings}>
                {
                    allRooms.map((singleRooms, idx) => (
                        <div key={idx} className="px-2">
                            <div className="bg-[#85817c] text-white rounded-md  uppercase space-y-5 flex flex-col items-center justify-around text-2xl font-bold   p-4 ">
                                <img src={singleRooms.images.main} className="object-cover w-full h-56 md:h-60 lg:h-72 xl:h-96 rounded-md" alt="" />
                                <div className="text-center">
                                    <h3 className="text-lg lg:text-xl xl:text-3xl">{singleRooms.title}</h3>
                                    <h5 className="text-sm xl:text-lg"> {singleRooms.maxGuests} guest room</h5>
                                </div>
                                <Link href={'/'} className="relative text-xs xl:text-sm after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:translate-x-[0%]">view details</Link>


                            </div>
                        </div>
                    ))
                }
            </Slider>
        </div>
    );
}

export default HomePageRooms;
