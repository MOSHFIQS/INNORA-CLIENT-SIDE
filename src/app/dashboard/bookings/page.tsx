'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetAllBookingsQuery,
     useGetMyBookingsQuery,
     useCancelBookingMutation,
} from '@/redux/api/bookingApi';
import {
     CalendarCheck,
     Eye,
     Sliders,
     XCircle,
     Star,
     PlusCircle,
     FileText,
     Edit3,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BookingsManagementPage() {
     const { user, isStaff, isAdmin, isSuperAdmin } = useAuth();
     const isManagement = isStaff || isAdmin || isSuperAdmin;

     const [search, setSearch] = useState('');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const [cancellingBooking, setCancellingBooking] = useState(null);

     const { data: allBookingsData, isLoading: isAllLoading, error: allError } = useGetAllBookingsQuery(
          undefined,
          { skip: !isManagement }
     );

     const { data: myBookingsData, isLoading: isMyLoading, error: myError } = useGetMyBookingsQuery(
          undefined,
          { skip: isManagement }
     );

     const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

     const isLoading = isManagement ? isAllLoading : isMyLoading;
     const error = isManagement ? allError : myError;

     const filteredBookings = useMemo(() => {
          const rawBookings = isManagement
               ? (Array.isArray(allBookingsData) ? allBookingsData : allBookingsData?.data || [])
               : (Array.isArray(myBookingsData) ? myBookingsData : myBookingsData?.data || []);

          return rawBookings.filter((b) => {
               const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
               const term = search.toLowerCase().trim();
               const matchesSearch =
                    !term ||
                    b.bookingNumber?.toLowerCase().includes(term) ||
                    b.title?.toLowerCase().includes(term) ||
                    b.room?.title?.toLowerCase().includes(term) ||
                    b.name?.toLowerCase().includes(term) ||
                    b.userName?.toLowerCase().includes(term) ||
                    b.email?.toLowerCase().includes(term) ||
                    b.userEmail?.toLowerCase().includes(term) ||
                    b.user?.fullName?.toLowerCase().includes(term) ||
                    b.user?.email?.toLowerCase().includes(term);

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
     }, [allBookingsData, myBookingsData, isManagement, statusFilter, search, sortKey, sortDirection]);

     const handleConfirmCancel = async () => {
          if (!cancellingBooking) return;
          try {
               await cancelBooking({
                    idOrEmail: cancellingBooking.id || cancellingBooking._id || cancellingBooking.email,
                    reason: 'Cancelled via management portal',
               }).unwrap();
               toast.success('Reservation cancelled successfully');
               setCancellingBooking(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to cancel reservation');
          }
     };

     const columns = [
          {
               key: 'bookingNumber',
               label: 'Folio Ref #',
               sortable: true,
               render: (b) => {
                    const targetId = b.id || b._id;
                    return (
                         <Link
                              href={`/dashboard/bookings/${targetId}`}
                              className="font-bold font-mono text-[#b99d75] hover:underline"
                         >
                              #{b.bookingNumber || b.id?.slice(-6)}
                         </Link>
                    );
               },
          },
          {
               key: 'title',
               label: 'Suite Information',
               sortable: true,
               render: (b) => {
                    const targetId = b.id || b._id;
                    return (
                         <Link href={`/dashboard/bookings/${targetId}`} className="group block">
                              <strong className="text-gray-900 dark:text-white block font-serif group-hover:text-[#b99d75] transition">
                                   {b.title || b.room?.title || 'Luxury Suite'}
                              </strong>
                              <span className="text-[10px] text-gray-500">
                                   Suite #{b.room?.roomNumber || 'N/A'} • {b.room?.type || 'Deluxe'}
                              </span>
                         </Link>
                    );
               },
          },
          {
               key: 'guest',
               label: 'Guest Info',
               render: (b) => (
                    <div>
                         <span className="text-gray-900 dark:text-white font-medium block">
                              {b.userName || b.name || b.user?.fullName || 'Guest'}
                         </span>
                         <span className="text-[10px] text-gray-500 block truncate max-w-[150px]">
                              {b.userEmail || b.email || b.user?.email || 'N/A'}
                         </span>
                    </div>
               ),
          },
          {
               key: 'date',
               label: 'Scheduled Stay',
               sortable: true,
               render: (b) => (
                    <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                         {b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Standard')}
                    </span>
               ),
          },
          {
               key: 'totalAmount',
               label: 'Investment',
               sortable: true,
               render: (b) => (
                    <div>
                         <strong className="text-gray-900 dark:text-white block">
                              ${Number(b.totalAmount || b.price || 0).toLocaleString()}
                         </strong>
                         <span className="text-[10px] text-gray-400 uppercase font-semibold">
                              {b.paymentStatus || 'PAID'}
                         </span>
                    </div>
               ),
          },
          {
               key: 'status',
               label: 'Status',
               sortable: true,
               render: (b) => <StatusBadge status={b.status} />,
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (b) => {
                    const targetId = b.id || b._id;
                    return (
                         <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              <Link
                                   href={`/dashboard/bookings/${targetId}`}
                                   className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-[#b99d75] text-gray-700 dark:text-gray-300 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                   title="View Stay Voucher"
                              >
                                   <Eye className="w-3 h-3" />
                                   <span>Voucher</span>
                              </Link>

                              {isManagement && (
                                   <Link
                                        href={`/dashboard/bookings/${targetId}/edit`}
                                        className="px-2.5 py-1 bg-[#b99d75]/15 hover:bg-[#b99d75] text-[#b99d75] hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                        title="Manage & Edit Reservation"
                                   >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Manage</span>
                                   </Link>
                              )}

                              {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                                   <button
                                        type="button"
                                        onClick={() => setCancellingBooking(b)}
                                        className="px-2 py-1 text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold uppercase transition cursor-pointer"
                                        title="Cancel Reservation"
                                   >
                                        Cancel
                                   </button>
                              )}

                              {!isManagement && b.status === 'COMPLETED' && (
                                   <Link
                                        href={`/dashboard/reviews/new?roomId=${b.roomId || b.room?.id}`}
                                        className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-600 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                                   >
                                        <Star className="w-3 h-3" />
                                        <span>Review</span>
                                   </Link>
                              )}
                         </div>
                    );
               },
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title={isManagement ? 'Reservations Command' : 'My Suite Reservations'}
                    description={
                         isManagement
                              ? 'Manage hotel room reservations, check-ins, payment verification, and stay schedules.'
                              : 'Review your upcoming stays, access reservation vouchers, and manage booking history.'
                    }
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Reservations' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/bookings/new"
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                         >
                              <PlusCircle className="w-4 h-4" />
                              <span>{isManagement ? 'New Reservation' : 'Book a Stay'}</span>
                         </Link>
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by folio #, suite name, guest email..."
                    filters={[
                         {
                              key: 'status',
                              label: 'Status',
                              value: statusFilter,
                              onChange: setStatusFilter,
                              options: [
                                   { label: 'All Statuses', value: 'ALL' },
                                   { label: 'Confirmed', value: 'CONFIRMED' },
                                   { label: 'Checked In', value: 'CHECKED_IN' },
                                   { label: 'Checked Out', value: 'CHECKED_OUT' },
                                   { label: 'Completed', value: 'COMPLETED' },
                                   { label: 'Cancelled', value: 'CANCELLED' },
                                   { label: 'Pending', value: 'PENDING' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setStatusFilter('ALL');
                    }}
                    totalCount={filteredBookings.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredBookings}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No reservations match the specified search or filter criteria."
               />

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={Boolean(cancellingBooking)}
                    onClose={() => setCancellingBooking(null)}
                    onConfirm={handleConfirmCancel}
                    title="Cancel Suite Reservation"
                    message={`Are you sure you wish to cancel reservation #${cancellingBooking?.bookingNumber || cancellingBooking?.id?.slice(-6)}? This will release the suite inventory.`}
                    confirmLabel="Confirm Cancellation"
                    isLoading={isCancelling}
               />
          </div>
     );
}
