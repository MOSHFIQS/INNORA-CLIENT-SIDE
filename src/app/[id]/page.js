"use client"

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import notFound from "../not-found";
import {
    BedDouble,
    Ruler,
    Users,
    Eye,
    ShieldCheck,
    Wifi,
    Tv,
    Coffee,
    Bath,
    Lock,
    AlertTriangle,
    FireExtinguisher,
    Safe,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/provider/AuthProvider";
import toast from "react-hot-toast";

const iconMap = {
    "WiFi": Wifi,
    "Smart TV": Tv,
    "Coffee Maker": Coffee,
    "Jacuzzi": Bath,
    "Room Service": ShieldCheck,
    "Smoke Detector": AlertTriangle,
    "Fire Extinguisher": FireExtinguisher,
    "Safe Box": Lock,
};

const FeatureBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-700 p-4 rounded shadow hover:shadow-lg transition">
        <Icon className="text-blue-600 dark:text-blue-300 w-5 h-5" />
        <span className="text-sm font-medium">{text}</span>
    </div>
);

const Page = () => {
    const { user } = useContext(AuthContext)
    const router = useRouter()
    console.log(user)
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/rooms/${id}`)
            .then((res) => {
                setRoom(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading)
        return <div className="p-10 text-center text-gray-500">Loading...</div>;
    if (!room || id !== room._id) return notFound();



    // handle the reviews post
    const handleReview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const user_email = user?.email;
        const user_name = user?.displayName || "Anonymous";
        const comment = form.comment.value;
        const rating = parseInt(form.rating.value);

        if (!user_email) {
            toast.error('YOU MUST BE SIGN IN')
            return;
        }

        try {
            const res = await axios.patch(`http://localhost:5000/rooms/${id}/reviews`, {
                user_email,
                user_name,
                comment,
                rating,
            })
                .then(res => {
                    form.reset();
                    toast.success(`Your feedback has been recorded successfully. We value your opinion and strive to continuously enhance our service.`)
                    console.log(res)
                })
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(`${error.response.data.message}`);
            } else {
                toast.error("Failed to submit review. Please try again later.");
            }
            console.error(error);
        }
    }






    return (
        <div className=" bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 uppercase">
            {/* Hero Section */}
            <div className="relative w-full h-[80vh] overflow-hidden">
                <img
                    src={room.images?.main}
                    alt={room.title}
                    className="object-cover w-full h-full scale-101 transition-transform duration-1000 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-white/80 text-gray-800 px-4 py-1 rounded-full text-sm font-semibold">
                    Room #{room.roomId}
                </div>
                <div className=" absolute bottom-8 left-8  text-white animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">{room.title}</h1>
                    <p className="text-lg mt-2 text-gray-200">
                        {room.type} • {room.view} View
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[95vw] mx-auto px-4 py-10 md:py-16 grid md:grid-cols-3 gap-10">
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:col-span-2 space-y-10"
                >
                    {/* Basic Info */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            {room.type} Room #{room.roomNumber}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Floor: {room.floor} • View: {room.view}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <FeatureBadge icon={BedDouble} text={`${room.bedType} Bed`} />
                            <FeatureBadge icon={Ruler} text={`${room.roomSizeSqFt} sqft`} />
                            <FeatureBadge icon={Users} text={`Max ${room.maxGuests} Guests`} />
                            <FeatureBadge icon={Eye} text={`${room.view} View`} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2">About this room</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {room.description}
                        </p>
                    </div>

                    {/* Room Features */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Room Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.features.map((feature, i) => {
                                const Icon = iconMap[feature] || ShieldCheck;
                                return (
                                    <FeatureBadge key={i} icon={Icon} text={feature} />
                                );
                            })}
                        </div>
                    </div>


                    {/* Safety Features */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Safety Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.safetyFeatures.map((feature, i) => {
                                const Icon = iconMap[feature] || ShieldCheck;
                                return (
                                    <FeatureBadge key={i} icon={Icon} text={feature} />
                                );
                            })}
                        </div>
                    </div>
                    {/* // Add this inside your JSX (e.g., below the Room Features section) */}
                    {/* Leave a Review */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                        <form
                            onSubmit={handleReview}
                            className="space-y-4"
                        >
                            <input
                                name="user_name"
                                defaultValue={user?.displayName || ""}
                                disabled={true}
                                className="w-full p-2 rounded border"
                                placeholder="Your name"
                                required
                            />
                            <textarea
                                name="comment"
                                placeholder="Your comment"
                                className="w-full p-2 rounded border"
                                required
                            />
                            <select
                                name="rating"
                                className="w-full p-2 rounded border bg-black"
                                required
                                defaultValue=""
                            >
                                <option value="" disabled>Rating</option>
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Terrible</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>


                </motion.div>

                {/* Booking Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md space-y-6 lg:sticky top-20 h-full flex items-center justify-center flex-col"
                >
                    <div>
                        <span className="text-3xl font-bold text-green-600">
                            ${room.pricePerNight}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {' '} / night
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rating: ⭐ {room.rating} ({room.reviewsCount} reviews)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {room.isAvailable ? (
                            <CheckCircle className="text-green-500" />
                        ) : (
                            <XCircle className="text-red-500" />
                        )}
                        <span className="text-sm font-semibold">
                            {room.isAvailable ? 'Available for Booking' : 'Currently Unavailable'}
                        </span>
                    </div>
                    <button
                     onClick={() => router.push(`booking/${room._id}`)}
                        disabled={!room.isAvailable}
                        className={`w-full px-4 py-3 rounded text-white font-semibold transition ${room.isAvailable
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {room.isAvailable ? 'Book Now' : 'Unavailable'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Page;
