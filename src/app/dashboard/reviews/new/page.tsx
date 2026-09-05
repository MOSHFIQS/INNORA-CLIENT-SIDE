'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { useCreateReviewMutation } from '@/redux/api/reviewApi';
import { useGetRoomsQuery } from '@/redux/api/roomApi';
import { Star, Loader2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

function ReviewFormContent() {
     const router = useRouter();
     const searchParams = useSearchParams();
     const preselectedRoomId = searchParams.get('roomId') || '';

     const [createReview, { isLoading }] = useCreateReviewMutation();
     const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery({});
     const rooms = React.useMemo(() => (Array.isArray(roomsData) ? roomsData : roomsData?.data || []), [roomsData]);

     const [roomId, setRoomId] = useState(preselectedRoomId);
     const [rating, setRating] = useState(5);
     const [hoverRating, setHoverRating] = useState(0);
     const [comment, setComment] = useState('');

     // If roomId is in query param and rooms loaded, auto-select
     React.useEffect(() => {
          if (preselectedRoomId) {
               setRoomId(preselectedRoomId);
          } else if (rooms.length > 0 && !roomId) {
               setRoomId(rooms[0].id || rooms[0]._id);
          }
     }, [preselectedRoomId, rooms, roomId]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!roomId) {
               toast.error('Please select a suite to review');
               return;
          }
          if (!comment.trim()) {
               toast.error('Please provide your experience feedback');
               return;
          }

          try {
               await createReview({
                    roomId,
                    rating: Number(rating),
                    comment,
               }).unwrap();
               toast.success('Your review has been submitted for moderation');
               router.push('/dashboard/reviews');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to submit review');
          }
     };

     return (
          <form onSubmit={handleSubmit} className="space-y-6">
               <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                    <h2 className="text-base font-serif font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                         Review Particulars
                    </h2>

                    {/* Suite Selection */}
                    <div className="space-y-1.5">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Selected Suite *
                         </label>
                         {isLoadingRooms ? (
                              <div className="text-xs text-gray-400">Loading suites...</div>
                         ) : (
                              <select
                                   required
                                   value={roomId}
                                   onChange={(e) => setRoomId(e.target.value)}
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              >
                                   <option value="" disabled>-- Select a Luxury Suite --</option>
                                   {rooms.map((room) => (
                                        <option key={room.id || room._id} value={room.id || room._id}>
                                             Suite #{room.roomNumber} - {room.title} ({room.type || 'Deluxe'})
                                        </option>
                                   ))}
                              </select>
                         )}
                    </div>

                    {/* Star Rating Picker */}
                    <div className="space-y-2 text-center p-6 bg-[#b99d75]/5 border border-[#b99d75]/20">
                         <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                              Overall Rating Score
                         </span>
                         <div className="flex items-center justify-center gap-3 pt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                   <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                                   >
                                        <Star
                                             className={`w-8 h-8 ${
                                                  (hoverRating || rating) >= star
                                                       ? 'text-[#b99d75] fill-[#b99d75]'
                                                       : 'text-gray-300 dark:text-gray-700'
                                             }`}
                                        />
                                   </button>
                              ))}
                         </div>
                         <span className="text-xs font-bold text-[#b99d75] uppercase tracking-wider block mt-2">
                              {rating === 5 ? '5.0 Stars — Exceptional Luxury' : rating === 4 ? '4.0 Stars — Very Good' : `${rating}.0 Stars — Satisfactory`}
                         </span>
                    </div>

                    {/* Feedback Comment */}
                    <div className="space-y-1.5">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Your Experience & Highlights *
                         </label>
                         <textarea
                              rows={5}
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Describe your hospitality experience, suite comfort, services, views, dining, and staff attentiveness..."
                              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>
               </div>

               {/* Action Footer */}
               <div className="flex items-center justify-end gap-3">
                    <Link
                         href="/dashboard/reviews"
                         className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                         Cancel
                    </Link>
                    <button
                         type="submit"
                         disabled={isLoading}
                         className="flex items-center gap-2 px-6 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                         {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                         ) : (
                              <Send className="w-4 h-4" />
                         )}
                         <span>Submit Review</span>
                    </button>
               </div>
          </form>
     );
}

export default function NewReviewPage() {
     return (
          <div className="max-w-3xl mx-auto space-y-6">
               <PageHeader
                    title="Write a Guest Review"
                    description="Share feedback about your stay or evaluate suite standards for publication on the hotel portal."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reviews', href: '/dashboard/reviews' },
                         { label: 'New Review' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/reviews"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                         </Link>
                    }
               />

               <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">Loading form...</div>}>
                    <ReviewFormContent />
               </Suspense>
          </div>
     );
}
