'use client'

import axios from 'axios';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const BookingPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [roomBookingDetails, setRoomBookingDetails] = useState(null);
    const [bookingDate, setBookingDate] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:5000/rooms/${id}`)
            .then((res) => {
                setRoomBookingDetails(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleBooking = () => {
        if (!bookingDate) {
            alert("Please select a date before booking.");
            return;
        }

        alert(`Booked ${roomBookingDetails.title} on ${bookingDate}`);
    };

    if (loading)
        return <div className="p-10 text-center text-gray-500">Loading...</div>;
    if (!roomBookingDetails || id !== roomBookingDetails._id) return notFound();

    const {
        roomId,
        roomNumber,
        title,
        shortDescription,
        pricePerNight,
        currency,
        images,
    } = roomBookingDetails;

    return (
        <div className="max-w-[50vw] mx-auto  border flex-col bg-white rounded-md shadow-lg overflow-hidden">
            {/* Room Image */}
            <div className="h-[450px] w-full">
                <img
                    src={images?.main}
                    alt={title}
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Room Details */}
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-500 mt-1">{shortDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <p><span className="font-semibold">Room ID:</span> {roomId}</p>
                    <p><span className="font-semibold">Room Number:</span> {roomNumber}</p>
                    <p><span className="font-semibold">Price/Night:</span> {currency} {pricePerNight}</p>
                    <p><span className="font-semibold">Max Guests:</span> 2</p>
                </div>

                {/* Date Picker */}
                <div>
                    <label htmlFor="bookingDate" className="block mb-2 text-sm font-medium text-gray-600">
                        Select Booking Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Book Button */}
                <div>
                    <button
                        onClick={handleBooking}
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
