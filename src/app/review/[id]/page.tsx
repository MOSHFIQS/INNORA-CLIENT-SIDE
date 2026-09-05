'use client';

import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAddReviewMutation } from '@/redux/api/reviewApi';
import { Star } from 'lucide-react';

const ReviewPage = () => {
     const { user, isAuthenticated } = useAuth();
     const params = useParams();
     const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const router = useRouter();
     const [addReview, { isLoading }] = useAddReviewMutation();
     const [rating, setRating] = useState(5);

     const handleReview = async (e) => {
          e.preventDefault();
          const form = e.target;
          const user_email = user?.email;
          const user_name = user?.fullName || `${user?.firstName || 'Guest'} ${user?.lastName || 'User'}`;
          const comment = form.comment.value.trim();

          if (!user_email) {
               toast.error('You must be signed in to submit a review');
               router.push('/signin');
               return;
          }

          try {
               await addReview({
                    roomId: id,
                    user_email,
                    user_name,
                    comment,
                    rating: Number(rating),
               }).unwrap();

               toast.success('Your feedback has been recorded successfully. Thank you for helping us enhance our service!');
               router.push(`/roomDetails/${id}`);
          } catch (error) {
               toast.error(error?.data?.message || 'Failed to submit review. Please try again later.');
          }
     };

     return (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-2xl">
               <h2 className="text-2xl font-bold mb-2 uppercase tracking-wider text-gray-900 dark:text-white font-serif text-center">
                    Guest Review & Rating
               </h2>
               <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-8">
                    Share your experience with fellow travelers
               </p>

               <form onSubmit={handleReview} className="space-y-6">
                    <div>
                         <label className="block text-xs uppercase font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Guest Name
                         </label>
                         <input
                              name="user_name"
                              value={user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Guest'}
                              disabled={true}
                              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs cursor-not-allowed"
                         />
                    </div>

                    <div>
                         <label className="block text-xs uppercase font-bold text-gray-700 dark:text-gray-300 mb-2">
                              Your Rating
                         </label>
                         <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                   <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="cursor-pointer focus:outline-none transition-transform hover:scale-110"
                                   >
                                        <Star
                                             className={`w-7 h-7 ${
                                                  star <= rating
                                                       ? 'text-amber-400 fill-amber-400'
                                                       : 'text-gray-300 dark:text-gray-600'
                                             }`}
                                        />
                                   </button>
                              ))}
                              <span className="ml-3 text-sm font-bold text-[#b99d75]">{rating} / 5 Stars</span>
                         </div>
                    </div>

                    <div>
                         <label className="block text-xs uppercase font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Your Comments & Experience *
                         </label>
                         <textarea
                              name="comment"
                              placeholder="Describe your stay, comfort of beds, ocean views, service quality..."
                              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#b99d75] resize-none"
                              rows={5}
                              required
                         />
                    </div>

                    <button
                         type="submit"
                         disabled={isLoading}
                         className="w-full py-3.5 bg-[#b99d75] hover:bg-[#a68c65] text-white font-bold uppercase tracking-wider text-xs transition duration-300 disabled:opacity-50 cursor-pointer"
                    >
                         {isLoading ? 'Submitting Review...' : 'Submit Review'}
                    </button>
               </form>
          </div>
     );
};

export default ReviewPage;
