'use client'

import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import { notFound, useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BookingPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true);
    const [roomBookingDetails, setRoomBookingDetails] = useState(null);


    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${id}`)
            .then((res) => {
                setRoomBookingDetails(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);



    const handleBooking = (e) => {
        e.preventDefault()
        const price = roomBookingDetails.pricePerNight
        const roomId = roomBookingDetails.roomId
        const image = roomBookingDetails.images.main
        const title = roomBookingDetails.title
        const date = e.target.date.value
        const userEmail = user?.email
        const bookingDetails = {
            price, roomId, image, date, title, userEmail
        }
        console.log(bookingDetails)
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, bookingDetails)
            .then(res => {
                toast.success('BOOKING SUCCESSFUL');
            })
            .catch(err => {
                if (err.response?.data?.message === 'User already booked for this date') {
                    toast.error('You already have a booking on this date.');
                } 
                if (err.response?.data?.message === 'Room already booked for this date') {
                    return toast.error('Room already booked for this date');
                } 
                if(!err.response?.data?.message){
                    toast.error('Something went wrong.Maybe Server Error');
                }
            });

    };

    if (loading)
        return <div className="p-10 text-center text-gray-500">Loading...</div>;
    if (!roomBookingDetails || id !== roomBookingDetails._id) return notFound();



    return (
        <div className="w-[99vw] my-1 mx-auto  flex-col bg-white rounded-md  ">
            {/* Room Image */}
            <div className="h-[490px] w-full">
                <img
                    src={roomBookingDetails.images?.main}
                    alt={roomBookingDetails.title}
                    className="w-full h-full object-cover object-center rounded-t-md"
                />
            </div>

            {/* Room Details */}
            <form onSubmit={handleBooking} className="p-6 space-y-6 uppercase">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{roomBookingDetails.title}</h1>
                    <p className="text-gray-500 mt-1">{roomBookingDetails.shortDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <p><span className="font-semibold">Room ID:</span> {roomBookingDetails.roomId}</p>
                    <p><span className="font-semibold">Room Number:</span> {roomBookingDetails.roomNumber}</p>
                    <p><span className="font-semibold">Price/Night:</span> {roomBookingDetails.currency} {roomBookingDetails.pricePerNight}</p>
                    <p><span className="font-semibold">Max Guests:</span> 2</p>
                </div>

                {/* Date Picker */}
                <div >
                    <label htmlFor="bookingDate" className="block mb-2 text-sm font-medium text-gray-600">
                        Select Booking Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        required
                        name='date'
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Book Button */}
                <div>
                    <button type='submit'

                        className="w-full btn btn-md bg-[#1a77f2] text-white font-bold uppercase"
                    >
                        Book Now
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;
