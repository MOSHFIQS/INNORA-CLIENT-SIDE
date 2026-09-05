'use client';

import React, { useState } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import { useCreateReviewMutation } from '@/redux/api/reviewApi';
import { Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewCreateModal({ isOpen, onClose, roomId, roomTitle }) {
     const [createReview, { isLoading }] = useCreateReviewMutation();
     const [rating, setRating] = useState(5);
     const [hoverRating, setHoverRating] = useState(0);
     const [comment, setComment] = useState('');

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!roomId) {
               toast.error('Suite identifier is required');
               return;
          }
          if (!comment) {
               toast.error('Please provide your experience review');
               return;
          }

          try {
               await createReview({
                    roomId,
                    rating: Number(rating),
                    comment,
               }).unwrap();
               toast.success('Your review has been submitted for moderation');
               setComment('');
               setRating(5);
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to submit review');
          }
     };

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Share Your Guest Experience"
               description={roomTitle ? `Reviewing Suite: ${roomTitle}` : 'Review your stay at INNORA'}
               maxWidth="max-w-md"
          >
               <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* Star Rating Picker */}
                    <div className="space-y-1.5 text-center p-4 bg-[#b99d75]/5 border border-[#b99d75]/20">
                         <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                              Overall Rating
                         </span>
                         <div className="flex items-center justify-center gap-2 pt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                   <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                                   >
                                        <Star
                                             className={`w-6 h-6 ${
                                                  (hoverRating || rating) >= star
                                                       ? 'text-[#b99d75] fill-[#b99d75]'
                                                       : 'text-gray-300 dark:text-gray-700'
                                             }`}
                                        />
                                   </button>
                              ))}
                         </div>
                         <span className="text-[11px] font-bold text-[#b99d75] uppercase tracking-wider block mt-1">
                              {rating === 5 ? '5 Stars — Exceptional' : rating === 4 ? '4 Stars — Very Good' : `${rating} Stars`}
                         </span>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Your Review & Highlights *
                         </label>
                         <textarea
                              rows={4}
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Describe your hospitality experience, suite comfort, services, and staff attentiveness..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <button
                              type="button"
                              onClick={onClose}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#b99d75] hover:bg-[#a68c65] text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Submit Review</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
