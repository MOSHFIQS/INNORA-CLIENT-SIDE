'use client'

import Loading from '@/app/loading';
import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import Image from 'next/image';
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
        return <Loading />
    if (!roomBookingDetails || id !== roomBookingDetails._id) return notFound();



    return (
        <div className="w-full  mx-auto  flex-col bg-gray-800 text-white   ">
            {/* Room Image */}
            <div className="h-[550px] w-full">
                <Image
                    src={roomBookingDetails.images?.main || '/fallback.jpg'}
                    alt={roomBookingDetails.title || 'Room image'}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center"
                    priority
                />


            </div>

            {/* Room Details */}
            <form onSubmit={handleBooking} className="p-6 space-y-6 uppercase">
                <div>
                    <h1 className="text-3xl font-bold ">{roomBookingDetails.title}</h1>
                    <p className="mt-1">{roomBookingDetails.shortDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-semibold">Room ID:</span> {roomBookingDetails.roomId}</p>
                    <p><span className="font-semibold">Room Number:</span> {roomBookingDetails.roomNumber}</p>
                    <p><span className="font-semibold">Price/Night:</span> {roomBookingDetails.currency} {roomBookingDetails.pricePerNight}</p>
                    <p><span className="font-semibold">Max Guests:</span> 2</p>
                </div>

                {/* Date Picker */}
                <div >
                    <label htmlFor="bookingDate" className="block mb-2 text-sm font-medium ">
                        Select Booking Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        name="date"
                        required
                        className="w-full border border-gray-300 p-2 hover:border-white bg-[#b99d75] focus:outline-0"
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* Book Button */}
                <div>
                    <button type='submit'
                        className="w-full btn rounded-none  bg-[#b99d75] hover:scale-101 duration-500 transition-all ease-in-out hover:text-white font-bold uppercase"
                    >
                        Book Now
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;
