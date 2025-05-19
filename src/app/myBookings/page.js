'use client'
import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [myBooking, setMyBooking] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:5000/bookings/${user.email}`)
                .then(response => setMyBooking(response.data))
                .catch(error => console.error('Error fetching bookings:', error));
        }
    }, [user]);

    const handleCancel = (id) => {
        console.log('Cancel booking:', id);
    };

    const handleUpdateDate = (id) => {
        console.log('Update date for booking:', id);
    };

    const handleReview = (id) => {
        console.log('Review for booking:', id);
    };

    if(!myBooking.length > 0){
        return (
            <div className='h-full w-full flex justify-center'>
                <h1 className=' md:text-3xl text-xl lg:text-4xl xl:text-6xl text-gray-500 font-extrabold'>SORRY YOU DON'T BOOK ANY ROOM</h1>
            </div>
        )
    }

    return (
        <div className=" min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 uppercase">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold my-5 md:my-14 text-center text-gray-900 dark:text-white whitespace-nowrap">
                My Bookings 
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {myBooking?.map((booking) => (
                    <div
                        key={booking._id}
                        className="relative group bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden  transition-transform duration-300 hover:scale-[1]"
                    >
                        <img
                            src={booking.image}
                            alt={booking.title}
                            className="w-full h-52 object-cover object-center transition duration-300 group-hover:scale-105"
                        />
                        <div className="p-6 space-y-3 flex justify-center flex-col items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{booking.title}</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Room ID:</span> {booking.roomId}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Date:</span> {booking.date}
                            </p>
                            <div className="pt-4 flex justify-center items-center gap-1">
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="btn btn-sm btn-error text-white"
                                >
                                    ✖️ Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateDate(booking._id)}
                                    className="btn btn-sm btn-info text-white"
                                >
                                    🗓️ Update
                                </button>
                                <button
                                    onClick={() => handleReview(booking._id)}
                                    className="btn btn-sm btn-accent text-white"
                                >
                                    ⭐ Review 
                                </button>
                            </div>
                        </div>
                        {/* Accent glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-pink-400 blur-2xl opacity-10 group-hover:opacity-20 transition pointer-events-none rounded-3xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
