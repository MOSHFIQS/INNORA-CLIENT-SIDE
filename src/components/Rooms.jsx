'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Rooms = () => {
    const [allRooms, setAllRooms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("http://localhost:5000/rooms")
            .then((response) => setAllRooms(response.data))
            .catch(() => toast.error("Failed to fetch rooms data"));
    }, []);

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {allRooms.map((room) => (
                <div
                    key={room._id}
                    onClick={() => router.push(`/roomDetails/${room._id}`)}
                    className="bg-white rounded-md border border-gray-300 shadow cursor-pointer hover:scale-101 transition duration-300"
                >
                    <img
                        src={room.images?.main}
                        alt={room.title}
                        className="h-48 w-full object-cover rounded-t-md "
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">{room.title}</h3>
                        <p className="text-sm text-gray-600">{room.shortDescription}</p>
                        <div className="mt-2 text-sm text-gray-700">
                            <p><strong>Type:</strong> {room.type}</p>
                            <p><strong>Bed:</strong> {room.bedType}</p>
                            <p><strong>Price:</strong> ${room.pricePerNight} {room.currency}/night</p>
                            <p><strong>Guests:</strong> Max {room.maxGuests}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Rooms;
