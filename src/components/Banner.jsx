'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import React, { useState } from "react";
import Link from "next/link";

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      image: "/banner1.jpg",
      title: "Luxury Suites & Comfort",
      description: "Experience elegance and relaxation in our thoughtfully designed luxury hotel rooms.",
    },
    {
      image: "/banner2.jpg",
      title: "Scenic Views & Serenity",
      description: "Wake up to breathtaking views and unwind in tranquil, spacious accommodations.",
    },
    {
      image: "/banner3.jpg",
      title: "Modern Amenities & Style",
      description: "Enjoy top-tier amenities and modern interiors crafted for a perfect stay.",
    },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[800px] z-0">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes zoomOut {
          0% { transform: scale(1.2); opacity: .8; }
          100% { transform: scale(1); opacity: 1; }
        }

        .zoom-out {
          animation: zoomOut 6s ease-in-out forwards;
        }

        .swiper-pagination-bullet {
          background: rgba(255,255,255,1);
          width: 16px;
          height: 6px;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: white;
          box-shadow: 0 0 5px rgba(255,255,255,0.8);
          transform: scale(1.4);
        }

        .animate-fadeUp {
          animation: fadeUp 1s ease-out both;
        }

        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        direction="vertical"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full z-0 ">
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeIndex === index ? "opacity-100 zoom-out" : "opacity-0"}`}
            />
            {/* Gradient mask for top & bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 z-10"></div>

            {/* Glassmorphism content box */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
              <div className=" backdrop-blur-md rounded-md p-6 sm:p-8 md:p-10 border border-white/20  animate-fadeUp">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">{slide.title}</h2>
                <p className="mt-4 text-sm sm:text-lg text-white/90 max-w-xl">{slide.description}</p>

                <button className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-white group px-2 py-1 mt-4">
                  <Link href={'/rooms'} className="relative z-10 text-white group-hover:text-black text-sm duration-500">Learn More</Link>
                  <span className="absolute w-full h-full bg-[#c0a783] -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
                  <span className="absolute w-full h-full bg-[#c0a783] -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
                </button>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
