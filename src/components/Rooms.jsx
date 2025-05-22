'use client';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AuthContext } from '@/provider/AuthProvider';

const Rooms = () => {
    const { user } = useContext(AuthContext)
    const [allRooms, setAllRooms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (user?.email) {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms?email=${user.email}`, { withCredentials: true })
                .then((response) => setAllRooms(response.data))
                .catch(() => toast.error("Failed to fetch all Rooms data"));
        }
    }, [user]);


    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-[#1c1c1c]">
            {allRooms.map((room) => (
                <div
                    key={room._id}
                    onClick={() => router.push(`/roomDetails/${room._id}`)}
                    className="bg-[#c0a783]  border border-gray-200 shadow cursor-pointer hover:scale-101 transition duration-300"
                >
                    <img
                        src={room.images?.main}
                        alt={room.title}
                        className="h-48 w-full object-cover  "
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-white">{room.title}</h3>
                        <p className="text-sm text-gray-600 hover:text-white">{room.shortDescription}</p>
                        <div className="mt-2 text-sm text-gray-700">
                            <p className='hover:text-white'><strong>Type:</strong> {room.type}</p>
                            <p className='hover:text-white'><strong>Bed:</strong> {room.bedType}</p>
                            <p className='hover:text-white'><strong>Price:</strong> ${room.pricePerNight} {room.currency}/night</p>
                            <p className='hover:text-white'><strong>Guests:</strong> Max {room.maxGuests}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Rooms;
