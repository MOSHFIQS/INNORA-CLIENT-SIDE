'use client'
import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
// Assuming you're using react-toastify for notifications

const ReviewPage = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams()
    const router = useRouter()

    // handle the reviews post
    const handleReview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const user_email = user?.email;
        const user_name = user?.displayName || "Anonymous";
        const comment = form.comment.value;
        const rating = parseInt(form.rating.value);

        if (!user_email) {
            toast.error('YOU MUST BE SIGN IN');
            return;
        }

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${id}/reviews`, {
                user_email,
                user_name,
                comment,
                rating,
            });

            // form.reset();
            router.push('/')
            toast.success(`Your feedback has been recorded successfully. We value your opinion and strive to continuously enhance our service.`);
            console.log(res);
        } catch (error) {
            toast.error("Failed to submit review. Please try again later.");

        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white  rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Leave a Review</h3>
            <form onSubmit={handleReview} className="space-y-5">
                <input
                    name="user_name"
                    defaultValue={user?.displayName || ""}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    placeholder="Your name"
                    aria-label="Your name"
                />
                <textarea
                    name="comment"
                    placeholder="Write your comment here..."
                    className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    required
                    aria-label="Comment"
                />

                <div className="rating rating-lg" aria-label="Rating" role="radiogroup">
                    <input
                        type="radio"
                        name="rating"
                        value="1"
                        className="mask mask-star-2"
                        aria-label="1 star"
                        required
                    />
                    <input
                        type="radio"
                        name="rating"
                        value="2"
                        className="mask mask-star-2"
                        aria-label="2 stars"
                    />
                    <input
                        type="radio"
                        name="rating"
                        value="3"
                        className="mask mask-star-2"
                        aria-label="3 stars"
                    />
                    <input
                        type="radio"
                        name="rating"
                        value="4"
                        className="mask mask-star-2"
                        aria-label="4 stars"
                    />
                    <input
                        type="radio"
                        name="rating"
                        value="5"
                        className="mask mask-star-2"
                        aria-label="5 stars"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400"
                    aria-label="Submit Review"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewPage;
