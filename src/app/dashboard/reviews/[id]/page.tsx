'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetReviewByIdQuery,
     useUpdateReviewStatusMutation,
     useDeleteReviewMutation,
} from '@/redux/api/reviewApi';
import {
     ArrowLeft,
     Star,
     Calendar,
     User,
     Building,
     CheckCircle,
     XCircle,
     Clock,
     Trash2,
     Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewDetailPage() {
     const params = useParams();
     const reviewId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';
     const router = useRouter();

     const { isSuperAdmin, isAdmin, isStaff } = useAuth();
     const canModerate = isSuperAdmin || isAdmin || isStaff;
     const canDelete = isSuperAdmin || isAdmin;

     const [showDelete, setShowDelete] = useState(false);

     const { data: reviewData, isLoading, error } = useGetReviewByIdQuery(reviewId);
     const [updateReviewStatus, { isLoading: isUpdatingStatus }] = useUpdateReviewStatusMutation();
     const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

     const review = reviewData?.data || reviewData;

     const handleStatusChange = async (newStatus) => {
          try {
               await updateReviewStatus({ id: reviewId, status: newStatus }).unwrap();
               toast.success(`Review set to ${newStatus.toLowerCase()}`);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update review status');
          }
     };

     const handleConfirmDelete = async () => {
          try {
               await deleteReview(reviewId).unwrap();
               toast.success('Review removed');
               router.push('/dashboard/reviews');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete review');
          }
     };

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#b99d75]" />
               </div>
          );
     }

     if (error || !review) {
          return (
               <div className="space-y-6">
                    <PageHeader
                         title="Review Not Found"
                         breadcrumbs={[
                              { label: 'Dashboard', href: '/dashboard' },
                              { label: 'Reviews', href: '/dashboard/reviews' },
                              { label: 'Detail' },
                         ]}
                    />
                    <div className="bg-white dark:bg-[#1a1a1a] p-8 border border-gray-200 dark:border-gray-800 text-center space-y-4">
                         <p className="text-gray-500 text-xs">The requested guest review could not be retrieved.</p>
                         <Link
                              href="/dashboard/reviews"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#b99d75] text-white text-xs font-bold uppercase tracking-wider"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back to Reviews</span>
                         </Link>
                    </div>
               </div>
          );
     }

     const room = review.room || {};
     const guest = review.user || {};

     return (
          <div className="space-y-6 max-w-5xl mx-auto">
               <PageHeader
                    title="Guest Review Dossier"
                    description={`Review #${review.id || review._id} for Suite ${room.title || 'Experience'}`}
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reviews', href: '/dashboard/reviews' },
                         { label: `Review #${(review.id || review._id).toString().slice(-6)}` },
                    ]}
                    actions={
                         <div className="flex items-center gap-2">
                              <Link
                                   href="/dashboard/reviews"
                                   className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                              >
                                   <ArrowLeft className="w-3.5 h-3.5" />
                                   <span>Back</span>
                              </Link>
                              {canDelete && (
                                   <button
                                        type="button"
                                        onClick={() => setShowDelete(true)}
                                        className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition cursor-pointer"
                                   >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                   </button>
                              )}
                         </div>
                    }
               />

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Review Content */}
                    <div className="lg:col-span-2 space-y-6">
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                              <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                                   <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b99d75]">
                                             Guest Evaluation
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 mt-1">
                                             {Array.from({ length: 5 }).map((_, i) => (
                                                  <Star
                                                       key={i}
                                                       className={`w-5 h-5 ${
                                                            i < (review.rating || 5)
                                                                 ? 'fill-current'
                                                                 : 'text-gray-300 dark:text-gray-700'
                                                       }`}
                                                  />
                                             ))}
                                             <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">
                                                  {review.rating || 5}.0 / 5.0
                                             </span>
                                        </div>
                                   </div>
                                   <StatusBadge status={review.status || 'APPROVED'} />
                              </div>

                              <div className="space-y-2">
                                   <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Testimonial Commentary
                                   </label>
                                   <blockquote className="p-4 bg-gray-50 dark:bg-[#202020] border-l-4 border-[#b99d75] text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic">
                                        &ldquo;{review.comment}&rdquo;
                                   </blockquote>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-100 dark:border-gray-800">
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Submission Date
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                                             <Calendar className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {review.createdAt ? new Date(review.createdAt).toLocaleString() : 'N/A'}
                                        </span>
                                   </div>
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Last Updated
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                                             <Clock className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {review.updatedAt ? new Date(review.updatedAt).toLocaleString() : 'N/A'}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* Moderation Controls */}
                         {canModerate && (
                              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                                        Moderation Controls
                                   </h3>
                                   <p className="text-xs text-gray-500">
                                        Approve this review to make it visible on the public suite showcase, or reject/hold it in pending status.
                                   </p>
                                   <div className="flex flex-wrap gap-2.5 pt-2">
                                        <button
                                             type="button"
                                             disabled={isUpdatingStatus || review.status === 'APPROVED'}
                                             onClick={() => handleStatusChange('APPROVED')}
                                             className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                                        >
                                             <CheckCircle className="w-4 h-4" />
                                             <span>Approve (Publish Live)</span>
                                        </button>
                                        <button
                                             type="button"
                                             disabled={isUpdatingStatus || review.status === 'PENDING'}
                                             onClick={() => handleStatusChange('PENDING')}
                                             className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                                        >
                                             <Clock className="w-4 h-4" />
                                             <span>Mark Pending</span>
                                        </button>
                                        <button
                                             type="button"
                                             disabled={isUpdatingStatus || review.status === 'REJECTED'}
                                             onClick={() => handleStatusChange('REJECTED')}
                                             className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                                        >
                                             <XCircle className="w-4 h-4" />
                                             <span>Reject</span>
                                        </button>
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Suite & Author Metadata Sidebar */}
                    <div className="space-y-6">
                         {/* Suite Details */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <Building className="w-4 h-4 text-[#b99d75]" />
                                   <span>Suite Details</span>
                              </h3>
                              {room.images?.[0] && (
                                   <div className="h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img
                                             src={room.images[0]}
                                             alt={room.title}
                                             className="w-full h-full object-cover"
                                        />
                                   </div>
                              )}
                              <div className="space-y-2 text-xs">
                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">Suite Title</span>
                                        <strong className="text-gray-900 dark:text-white font-serif">
                                             {room.title || review.roomTitle || 'Luxury Suite'}
                                        </strong>
                                   </div>
                                   {room.roomNumber && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">Suite Number</span>
                                             <span className="font-mono text-gray-700 dark:text-gray-300">
                                                  #{room.roomNumber}
                                             </span>
                                        </div>
                                   )}
                                   {room.id && (
                                        <Link
                                             href={`/dashboard/rooms/${room.id}`}
                                             className="inline-block text-[#b99d75] hover:underline font-bold text-[11px] pt-1"
                                        >
                                             View Suite Inventory Dossier &rarr;
                                        </Link>
                                   )}
                              </div>
                         </div>

                         {/* Guest Profile */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <User className="w-4 h-4 text-[#b99d75]" />
                                   <span>Guest Author</span>
                              </h3>
                              <div className="space-y-2 text-xs">
                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">Full Name</span>
                                        <strong className="text-gray-900 dark:text-white">
                                             {guest.fullName || review.userName || 'Anonymous Guest'}
                                        </strong>
                                   </div>
                                   {guest.email && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">Email Address</span>
                                             <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                                                  {guest.email}
                                             </span>
                                        </div>
                                   )}
                                   {guest.id && (
                                        <Link
                                             href={`/dashboard/users/${guest.id}`}
                                             className="inline-block text-[#b99d75] hover:underline font-bold text-[11px] pt-1"
                                        >
                                             View User Profile &rarr;
                                        </Link>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={showDelete}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Guest Review"
                    message="Are you sure you want to permanently delete this review?"
                    confirmLabel="Delete Review"
                    isLoading={isDeleting}
               />
          </div>
     );
}
