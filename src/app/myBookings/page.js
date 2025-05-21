'use client'
import PrivateRoute from '@/privateRoute/PrivateRoute';
import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [myBooking, setMyBooking] = useState([]);
    const [newDate, setNewDate] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (!user?.email) return
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings?email=${user?.email}`, { withCredentials: true })
            .then(response => setMyBooking(response.data))
            .catch(error => toast.error('failed to set my bookings'));
    }, [user]);

    const handleCancel = (roomId, date) => {
        axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${user.email}`, {
            data: { roomId, date }
        })
            .then(res => {
                toast.success('Your Booking canceled')
                const remaining = myBooking.filter(booking => booking.roomId !== roomId || booking.date !== date)
                setMyBooking(remaining)
            })
            .catch(err => {
                toast.error(`unfortunately you can't cancle booking now`)
            })
    };

    const handleUpdateDate = (oldDate, roomId) => {
        const email = user.email;
        const bookingUpdateDateInfo = {
            oldDate,
            roomId,
            email,
            newDate, // this comes from state
        };
        axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/update`, bookingUpdateDateInfo)
            .then(res => {
                toast.success('Date Updated Successfully')

                const updatedBookings = myBooking.map(booking => {
                    if (booking.roomId === roomId && booking.date === oldDate) {
                        return { ...booking, date: newDate };
                    }
                    return booking;
                });
                setMyBooking(updatedBookings);
                setNewDate(''); // Clear input


            })
            .catch(err => {
                if (err.response.data.message === 'this room is already booked') {

                    toast.error('this room is already booked')
                }
            })
    };


    return (
        <PrivateRoute>
            <div className=" min-h-screen bg[#1c1c1c] uppercase">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold my-5 md:my-14 text-center text-gray-900 dark:text-white whitespace-nowrap">
                    My Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    {myBooking?.map((booking) => (
                        <div
                            key={booking._id}
                            className="relative group bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden  transition-transform duration-300 hover:scale-[1]"
                        >
                            <Image
                                src={booking.image || '/fallback.jpg'} // Provide fallback if needed
                                alt={booking.title || 'Booking image'}
                                fill
                                className="object-cover object-center transition duration-300 group-hover:scale-105"
                                unoptimized={booking.image?.startsWith('http')}
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
                                        onClick={() => handleCancel(booking.roomId, booking.date)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        ✖️ Cancel
                                    </button>








                                    {/* this is modal part */}

                                    {/* The button to open modal */}
                                    <label htmlFor={`update_modal_${booking._id}`} className="btn btn-sm btn-info text-white">
                                        🗓️ Update Date
                                    </label>

                                    {/* The actual modal */}
                                    <input type="checkbox" id={`update_modal_${booking._id}`} className="modal-toggle" />
                                    <div className="modal" role="dialog">
                                        <div className="modal-box">
                                            <h3 className="text-lg font-bold">Choose a new date</h3>
                                            <input
                                                onChange={e => setNewDate(e.target.value)}
                                                type="date"
                                                
                                                required
                                                className="input input-bordered w-full my-4"
                                                min={new Date().toISOString().split("T")[0]} // ekhane min date set kora hocche ajker date
                                            />

                                            <div className="modal-action">
                                                <label htmlFor={`update_modal_${booking._id}`}  className="btn">Cancel</label>
                                                <label
                                                    htmlFor={`update_modal_${booking._id}`}
                                                    className="btn btn-primary"
                                                    onClick={() => handleUpdateDate(booking.date, booking.roomId)}
                                                >
                                                    Update
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/review/${booking.roomId}`)}
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
        </PrivateRoute>
    );
};

export default MyBookings;
