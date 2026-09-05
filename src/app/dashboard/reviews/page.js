'use client';

import React from 'react';
import {
     useGetAllReviewsQuery,
     useUpdateReviewStatusMutation,
     useDeleteReviewMutation,
} from '@/redux/api/reviewApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Star, Trash2, Check, X } from 'lucide-react';

export default function ReviewsModerationPage() {
     const { data: reviewsData, isLoading } = useGetAllReviewsQuery();
     const [updateStatus] = useUpdateReviewStatusMutation();
     const [deleteReview] = useDeleteReviewMutation();

     const reviews = reviewsData?.data || [];

     const handleStatus = async (id, status) => {
          try {
               await updateStatus({ id, status }).unwrap();
               toast.success(`Review ${status.toLowerCase()}`);
          } catch {
               toast.error('Failed to update review status');
          }
     };

     const handleDelete = async (id) => {
          if (!confirm('Are you sure you want to permanently delete this review?')) return;
          try {
               await deleteReview(id).unwrap();
               toast.success('Review deleted');
          } catch {
               toast.error('Failed to delete review');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                         Guest Reviews Moderation
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                         Review guest feedback, ratings, and publish status
                    </p>
               </div>

               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">Guest Name & Email</th>
                                        <th className="p-3">Suite</th>
                                        <th className="p-3">Rating</th>
                                        <th className="p-3">Comments</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {reviews.length === 0 ? (
                                        <tr>
                                             <td colSpan="6" className="text-center py-8 text-xs text-gray-500">
                                                  No reviews submitted yet.
                                             </td>
                                        </tr>
                                   ) : (
                                        reviews.map((r) => (
                                             <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                  <td className="p-3">
                                                       <div className="font-bold text-gray-900 dark:text-white">{r.userName}</div>
                                                       <div className="text-[10px] text-gray-400">{r.userEmail}</div>
                                                  </td>
                                                  <td className="p-3 font-semibold">{r.room?.title || 'Luxury Suite'}</td>
                                                  <td className="p-3">
                                                       <div className="flex text-amber-400">
                                                            {Array.from({ length: r.rating }).map((_, idx) => (
                                                                 <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                                                            ))}
                                                       </div>
                                                  </td>
                                                  <td className="p-3 max-w-xs text-gray-600 dark:text-gray-300 normal-case">
                                                       {r.comment}
                                                  </td>
                                                  <td className="p-3">
                                                       <span
                                                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                                                 r.status === 'APPROVED'
                                                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                            }`}
                                                       >
                                                            {r.status}
                                                       </span>
                                                  </td>
                                                  <td className="p-3 text-right space-x-1.5">
                                                       {r.status !== 'APPROVED' && (
                                                            <button
                                                                 onClick={() => handleStatus(r.id, 'APPROVED')}
                                                                 className="btn btn-xs rounded-none bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                 title="Approve"
                                                            >
                                                                 <Check className="w-3 h-3" />
                                                            </button>
                                                       )}
                                                       <button
                                                            onClick={() => handleDelete(r.id)}
                                                            className="btn btn-xs rounded-none bg-red-600 hover:bg-red-700 text-white"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                       </button>
                                                  </td>
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>
          </div>
     );
}
