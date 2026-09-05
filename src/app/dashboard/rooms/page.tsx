'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetRoomsQuery,
     useToggleRoomAvailabilityMutation,
     useDeleteRoomMutation,
} from '@/redux/api/roomApi';
import {
     BedDouble,
     PlusCircle,
     Edit3,
     Trash2,
     Check,
     X,
     Eye,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RoomsManagementPage() {
     const { isSuperAdmin, isAdmin, isStaff } = useAuth();
     const canEdit = isSuperAdmin || isAdmin || isStaff;
     const canDelete = isSuperAdmin || isAdmin;

     const [search, setSearch] = useState('');
     const [typeFilter, setTypeFilter] = useState('ALL');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('price');
     const [sortDirection, setSortDirection] = useState('desc');

     const [deletingRoom, setDeletingRoom] = useState(null);

     const { data: roomsData, isLoading, error } = useGetRoomsQuery();
     const [toggleAvailability] = useToggleRoomAvailabilityMutation();
     const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

     const filteredRooms = useMemo(() => {
          const rawRooms = Array.isArray(roomsData) ? roomsData : roomsData?.data || [];
          return rawRooms.filter((r) => {
               const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
               const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
               const term = search.toLowerCase().trim();
               const matchesSearch =
                    !term ||
                    r.title?.toLowerCase().includes(term) ||
                    r.roomNumber?.toLowerCase().includes(term) ||
                    r.type?.toLowerCase().includes(term);

               return matchesType && matchesStatus && matchesSearch;
          }).sort((a, b) => {
               let valA = a[sortKey];
               let valB = b[sortKey];
               if (sortKey === 'price') {
                    valA = Number(a.price || a.pricePerNight || 0);
                    valB = Number(b.price || b.pricePerNight || 0);
               }
               if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
               if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
               return 0;
          });
     }, [roomsData, typeFilter, statusFilter, search, sortKey, sortDirection]);

     const handleToggle = async (roomId) => {
          try {
               await toggleAvailability(roomId).unwrap();
               toast.success('Room availability status toggled');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to toggle availability');
          }
     };

     const handleConfirmDelete = async () => {
          if (!deletingRoom) return;
          try {
               await deleteRoom(deletingRoom.id || deletingRoom._id).unwrap();
               toast.success('Suite removed successfully');
               setDeletingRoom(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete room');
          }
     };

     const columns = [
          {
               key: 'image',
               label: 'Suite',
               render: (r) => {
                    const img = (Array.isArray(r.images) ? r.images[0] : r.images?.main) || r.image || '/images/suite-placeholder.jpg';
                    const targetId = r.id || r._id || r.roomId;
                    return (
                         <Link href={`/dashboard/rooms/${targetId}`} className="flex items-center gap-3 group">
                              <div className="w-14 h-11 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                                   <img src={img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                              </div>
                              <div>
                                   <div className="flex items-center gap-1.5">
                                        <strong className="text-gray-900 dark:text-white font-serif text-xs block group-hover:text-[#b99d75] transition">
                                             {r.title}
                                        </strong>
                                        {r.isFeatured && (
                                             <span className="px-1.5 py-0.2 bg-[#b99d75]/20 text-[#b99d75] border border-[#b99d75]/40 text-[9px] font-bold uppercase">
                                                  Featured
                                             </span>
                                        )}
                                   </div>
                                   <span className="text-[10px] text-gray-500">
                                        Suite #{r.roomNumber || 'N/A'} • Floor {r.floor || 1}
                                   </span>
                              </div>
                         </Link>
                    );
               },
          },
          {
               key: 'type',
               label: 'Category',
               sortable: true,
               render: (r) => (
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                         {r.type || 'DELUXE'}
                    </span>
               ),
          },
          {
               key: 'price',
               label: 'Nightly Rate',
               sortable: true,
               render: (r) => (
                    <div>
                         <strong className="text-xs font-bold text-gray-900 dark:text-white">
                              ${Number(r.price || r.pricePerNight || 0).toLocaleString()}
                         </strong>
                         {r.discount > 0 && (
                              <span className="text-[10px] text-emerald-600 block">-${r.discount} Promo</span>
                         )}
                    </div>
               ),
          },
          {
               key: 'capacity',
               label: 'Specs',
               render: (r) => (
                    <div className="text-[11px] text-gray-500">
                         <span>{r.maxGuests || r.capacity || 2} Guests</span> • <span>{r.bedType || 'King'}</span>
                    </div>
               ),
          },
          {
               key: 'isAvailable',
               label: 'Available',
               render: (r) => (
                    <button
                         type="button"
                         disabled={!canEdit}
                         onClick={() => handleToggle(r.id || r._id)}
                         className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase transition rounded-none cursor-pointer ${
                              r.isAvailable !== false
                                   ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                   : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-700'
                         }`}
                         title="Toggle suite availability"
                    >
                         {r.isAvailable !== false ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                         <span>{r.isAvailable !== false ? 'Live' : 'Hidden'}</span>
                    </button>
               ),
          },
          {
               key: 'status',
               label: 'Status',
               sortable: true,
               render: (r) => <StatusBadge status={r.status} />,
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (r) => {
                    const targetId = r.id || r._id || r.roomId;
                    return (
                         <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              <Link
                                   href={`/dashboard/rooms/${targetId}`}
                                   className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                   title="View Suite Dossier"
                              >
                                   <Eye className="w-3.5 h-3.5" />
                              </Link>

                              {canEdit && (
                                   <Link
                                        href={`/dashboard/rooms/${targetId}/edit`}
                                        className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        title="Edit Suite"
                                   >
                                        <Edit3 className="w-3.5 h-3.5" />
                                   </Link>
                              )}

                              {canDelete && (
                                   <button
                                        type="button"
                                        onClick={() => setDeletingRoom(r)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                        title="Delete Suite"
                                   >
                                        <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                              )}
                         </div>
                    );
               },
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title="Suites & Rooms Inventory"
                    description="Configure luxury hotel accommodations, nightly rates, amenities, and room status."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Suites & Rooms' },
                    ]}
                    actions={
                         canEdit && (
                              <Link
                                   href="/dashboard/rooms/new"
                                   className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                              >
                                   <PlusCircle className="w-4 h-4" />
                                   <span>Register Suite</span>
                              </Link>
                         )
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by title, suite #, type..."
                    filters={[
                         {
                              key: 'type',
                              label: 'Category',
                              value: typeFilter,
                              onChange: setTypeFilter,
                              options: [
                                   { label: 'All Categories', value: 'ALL' },
                                   { label: 'Deluxe', value: 'DELUXE' },
                                   { label: 'Suite', value: 'SUITE' },
                                   { label: 'Standard', value: 'STANDARD' },
                                   { label: 'Executive', value: 'EXECUTIVE' },
                                   { label: 'Presidential', value: 'PRESIDENTIAL' },
                                   { label: 'Family', value: 'FAMILY' },
                              ],
                         },
                         {
                              key: 'status',
                              label: 'Status',
                              value: statusFilter,
                              onChange: setStatusFilter,
                              options: [
                                   { label: 'All Statuses', value: 'ALL' },
                                   { label: 'Available', value: 'AVAILABLE' },
                                   { label: 'Booked', value: 'BOOKED' },
                                   { label: 'Maintenance', value: 'MAINTENANCE' },
                                   { label: 'Cleaning', value: 'CLEANING' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setTypeFilter('ALL');
                         setStatusFilter('ALL');
                    }}
                    totalCount={filteredRooms.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredRooms}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No hotel suites match the specified category or search query."
               />

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={Boolean(deletingRoom)}
                    onClose={() => setDeletingRoom(null)}
                    onConfirm={handleConfirmDelete}
                    title="Remove Luxury Suite"
                    message={`Are you sure you wish to delete suite "${deletingRoom?.title}" (Room #${deletingRoom?.roomNumber || 'N/A'})? This will remove it from live bookings.`}
                    confirmLabel="Delete Suite"
                    isLoading={isDeleting}
               />
          </div>
     );
}
