'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetAllReviewsQuery,
     useGetMyReviewsQuery,
     useUpdateReviewStatusMutation,
     useDeleteReviewMutation,
} from '@/redux/api/reviewApi';
import { Star, CheckCircle, XCircle, Trash2, PlusCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewsManagementPage() {
     const { user, isSuperAdmin, isAdmin, isStaff } = useAuth();
     const isManagement = isSuperAdmin || isAdmin || isStaff;
     const canModerate = isSuperAdmin || isAdmin || isStaff;
     const canDelete = isSuperAdmin || isAdmin;

     const [search, setSearch] = useState('');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const [deletingReview, setDeletingReview] = useState(null);

     const { data: allReviewsData, isLoading: isAllLoading, error: allError } = useGetAllReviewsQuery(
          undefined,
          { skip: !isManagement }
     );

     const { data: myReviewsData, isLoading: isMyLoading, error: myError } = useGetMyReviewsQuery(
          undefined,
          { skip: isManagement }
     );

     const reviewsData = isManagement ? allReviewsData : myReviewsData;
     const isLoading = isManagement ? isAllLoading : isMyLoading;
     const error = isManagement ? allError : myError;

     const [updateReviewStatus] = useUpdateReviewStatusMutation();
     const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

     const filteredReviews = useMemo(() => {
          const rawReviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || [];
          return rawReviews.filter((r) => {
               const matchesStatus = statusFilter === 'ALL' || (r.status || 'APPROVED') === statusFilter;
               const term = search.toLowerCase().trim();
               const matchesSearch =
                    !term ||
                    r.comment?.toLowerCase().includes(term) ||
                    r.room?.title?.toLowerCase().includes(term) ||
                    r.userName?.toLowerCase().includes(term) ||
                    r.user?.fullName?.toLowerCase().includes(term) ||
                    r.user?.email?.toLowerCase().includes(term);

               return matchesStatus && matchesSearch;
          }).sort((a, b) => {
               let valA = a[sortKey];
               let valB = b[sortKey];
               if (sortKey === 'createdAt') {
                    valA = new Date(a.createdAt || 0).getTime();
                    valB = new Date(b.createdAt || 0).getTime();
               }
               if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
               if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
               return 0;
          });
     }, [reviewsData, statusFilter, search, sortKey, sortDirection]);

     const handleStatus = async (reviewId, newStatus) => {
          try {
               await updateReviewStatus({ id: reviewId, status: newStatus }).unwrap();
               toast.success(`Review ${newStatus.toLowerCase()} successfully`);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update review status');
          }
     };

     const handleConfirmDelete = async () => {
          if (!deletingReview) return;
          try {
               await deleteReview(deletingReview.id || deletingReview._id).unwrap();
               toast.success('Review deleted');
               setDeletingReview(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete review');
          }
     };

     const columns = [
          {
               key: 'suite',
               label: 'Suite Reviewed',
               render: (r) => (
                    <div>
                         <Link
                              href={`/dashboard/reviews/${r.id || r._id}`}
                              className="text-gray-900 dark:text-white font-serif block text-xs hover:text-[#b99d75] transition font-bold"
                         >
                              {r.room?.title || r.roomTitle || 'Hotel Suite Experience'}
                         </Link>
                         <span className="text-[10px] text-gray-400">
                              Suite #{r.room?.roomNumber || 'General'}
                         </span>
                    </div>
               ),
          },
          {
               key: 'rating',
               label: 'Score',
               sortable: true,
               render: (r) => (
                    <div className="flex items-center gap-1 text-amber-500">
                         {Array.from({ length: r.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                         ))}
                         <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1">
                              {r.rating || 5}.0
                         </span>
                    </div>
               ),
          },
          {
               key: 'comment',
               label: 'Guest Feedback',
               render: (r) => (
                    <div className="max-w-md">
                         <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 italic">
                              &ldquo;{r.comment}&rdquo;
                         </p>
                         <span className="text-[10px] text-gray-400 block mt-0.5">
                              by {r.userName || r.user?.fullName || r.user?.email || 'Anonymous Guest'}
                         </span>
                    </div>
               ),
          },
          {
               key: 'createdAt',
               label: 'Date',
               sortable: true,
               render: (r) => (
                    <span className="text-gray-500 text-[11px] whitespace-nowrap">
                         {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
               ),
          },
          {
               key: 'status',
               label: 'Moderation',
               sortable: true,
               render: (r) => <StatusBadge status={r.status || 'APPROVED'} />,
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (r) => (
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                         <Link
                              href={`/dashboard/reviews/${r.id || r._id}`}
                              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer inline-flex items-center"
                              title="View Review Dossier"
                         >
                              <Eye className="w-3.5 h-3.5" />
                         </Link>

                         {canModerate && (
                              <>
                                   {r.status !== 'APPROVED' && (
                                        <button
                                             type="button"
                                             onClick={() => handleStatus(r.id || r._id, 'APPROVED')}
                                             className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                             title="Approve Review"
                                        >
                                             <CheckCircle className="w-3 h-3" />
                                             <span>Approve</span>
                                        </button>
                                   )}

                                   {r.status !== 'REJECTED' && (
                                        <button
                                             type="button"
                                             onClick={() => handleStatus(r.id || r._id, 'REJECTED')}
                                             className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                             title="Reject Review"
                                        >
                                             <XCircle className="w-3 h-3" />
                                             <span>Reject</span>
                                        </button>
                                   )}
                              </>
                         )}

                         {canDelete && (
                              <button
                                   type="button"
                                   onClick={() => setDeletingReview(r)}
                                   className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                   title="Delete Review"
                              >
                                   <Trash2 className="w-3.5 h-3.5" />
                              </button>
                         )}
                    </div>
               ),
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title={isManagement ? "Guest Reviews Moderation" : "My Suite Reviews"}
                    description={
                         isManagement
                              ? "Curate authentic guest testimonials, moderate suite feedback, and maintain luxury hospitality standards."
                              : "Review your submitted suite feedback, ratings, and testimonials."
                    }
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reviews' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/reviews/new"
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                         >
                              <PlusCircle className="w-4 h-4" />
                              <span>Write Review</span>
                         </Link>
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search reviews by suite, keyword, guest name..."
                    filters={[
                         {
                              key: 'status',
                              label: 'Moderation Status',
                              value: statusFilter,
                              onChange: setStatusFilter,
                              options: [
                                   { label: 'All Reviews', value: 'ALL' },
                                   { label: 'Approved (Live)', value: 'APPROVED' },
                                   { label: 'Pending Moderation', value: 'PENDING' },
                                   { label: 'Rejected', value: 'REJECTED' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setStatusFilter('ALL');
                    }}
                    totalCount={filteredReviews.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredReviews}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No guest reviews match the specified criteria."
               />

               <DeleteConfirmationDialog
                    isOpen={Boolean(deletingReview)}
                    onClose={() => setDeletingReview(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Guest Review"
                    message="Are you sure you want to permanently delete this guest review?"
                    confirmLabel="Delete Review"
                    isLoading={isDeleting}
               />
          </div>
     );
}
