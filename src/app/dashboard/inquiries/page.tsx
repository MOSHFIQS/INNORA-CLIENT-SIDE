'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import { useGetInquiriesQuery, useGetMyInquiriesQuery, useDeleteInquiryMutation } from '@/redux/api/inquiryApi';
import { MessageSquare, Eye, Trash2, PlusCircle, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InquiriesManagementPage() {
     const { user, isSuperAdmin, isAdmin, isStaff } = useAuth();
     const isManagement = isSuperAdmin || isAdmin || isStaff;
     const canDelete = isSuperAdmin || isAdmin;

     const [search, setSearch] = useState('');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const [deletingInquiry, setDeletingInquiry] = useState(null);

     const { data: allInquiriesData, isLoading: isAllLoading, error: allError } = useGetInquiriesQuery(
          undefined,
          { skip: !isManagement }
     );

     const { data: myInquiriesData, isLoading: isMyLoading, error: myError } = useGetMyInquiriesQuery(
          undefined,
          { skip: isManagement }
     );

     const inquiriesData = isManagement ? allInquiriesData : myInquiriesData;
     const isLoading = isManagement ? isAllLoading : isMyLoading;
     const error = isManagement ? allError : myError;

     const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();

     const filteredInquiries = useMemo(() => {
          const rawInquiries = Array.isArray(inquiriesData)
               ? inquiriesData
               : Array.isArray(inquiriesData?.data)
               ? inquiriesData.data
               : Array.isArray(inquiriesData?.data?.data)
               ? inquiriesData.data.data
               : [];
          return rawInquiries.filter((inq) => {
               const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
               const term = search.toLowerCase().trim();
               const matchesSearch =
                    !term ||
                    inq.name?.toLowerCase().includes(term) ||
                    inq.email?.toLowerCase().includes(term) ||
                    inq.phone?.toLowerCase().includes(term) ||
                    inq.subject?.toLowerCase().includes(term) ||
                    inq.message?.toLowerCase().includes(term);

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
     }, [inquiriesData, statusFilter, search, sortKey, sortDirection]);

     const handleConfirmDelete = async () => {
          if (!deletingInquiry) return;
          try {
               await deleteInquiry(deletingInquiry.id || deletingInquiry._id).unwrap();
               toast.success('Inquiry record deleted');
               setDeletingInquiry(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete inquiry');
          }
     };

     const columns = [
          {
               key: 'name',
               label: 'Guest / Sender',
               sortable: true,
               render: (inq) => (
                    <div>
                         <Link
                              href={`/dashboard/inquiries/${inq.id || inq._id}`}
                              className="text-gray-900 dark:text-white block text-xs font-bold hover:text-[#b99d75] transition"
                         >
                              {inq.name}
                         </Link>
                         <span className="text-[10px] text-gray-500 block truncate max-w-[170px]">
                              {inq.email} {inq.phone ? `• ${inq.phone}` : ''}
                         </span>
                    </div>
               ),
          },
          {
               key: 'subject',
               label: 'Subject & Preview',
               sortable: true,
               render: (inq) => (
                    <div className="max-w-md">
                         <Link
                              href={`/dashboard/inquiries/${inq.id || inq._id}`}
                              className="font-bold text-gray-900 dark:text-white block text-xs hover:text-[#b99d75] transition"
                         >
                              {inq.subject || 'General Hospitality Inquiry'}
                         </Link>
                         <p className="text-[11px] text-gray-500 line-clamp-1">
                              {inq.message}
                         </p>
                    </div>
               ),
          },
          {
               key: 'createdAt',
               label: 'Received',
               sortable: true,
               render: (inq) => (
                    <span className="text-gray-500 text-[11px] whitespace-nowrap">
                         {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
               ),
          },
          {
               key: 'adminNotes',
               label: 'Staff Response Notes',
               render: (inq) => (
                    <span className="text-[11px] text-gray-600 dark:text-gray-400 italic truncate max-w-[160px] block">
                         {inq.adminNotes || 'No response recorded'}
                    </span>
               ),
          },
          {
               key: 'status',
               label: 'Status',
               sortable: true,
               render: (inq) => <StatusBadge status={inq.status} />,
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (inq) => (
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                         <Link
                              href={`/dashboard/inquiries/${inq.id || inq._id}`}
                              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-[#b99d75] text-gray-700 dark:text-gray-300 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                              title={isManagement ? "View & Action Inquiry" : "View Inquiry Details"}
                         >
                              <Eye className="w-3 h-3" />
                              <span>{isManagement ? "View & Action" : "View Details"}</span>
                         </Link>

                         {canDelete && (
                              <button
                                   type="button"
                                   onClick={() => setDeletingInquiry(inq)}
                                   className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                   title="Delete Inquiry"
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
                    title={isManagement ? "Guest Inquiries & Concierge Messages" : "My Concierge Inquiries"}
                    description={
                         isManagement
                              ? "Respond to contact requests, event inquiries, private suite bookings, and concierge assistance."
                              : "Track and view your inquiries, private suite requests, and concierge communications."
                    }
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Inquiries' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/inquiries/new"
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                         >
                              <PlusCircle className="w-4 h-4" />
                              <span>New Inquiry</span>
                         </Link>
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by name, email, subject, message content..."
                    filters={[
                         {
                              key: 'status',
                              label: 'Status',
                              value: statusFilter,
                              onChange: setStatusFilter,
                              options: [
                                   { label: 'All Inquiries', value: 'ALL' },
                                   { label: 'Pending Reply', value: 'PENDING' },
                                   { label: 'Contacted', value: 'CONTACTED' },
                                   { label: 'Resolved', value: 'RESOLVED' },
                                   { label: 'Closed', value: 'CLOSED' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setStatusFilter('ALL');
                    }}
                    totalCount={filteredInquiries.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredInquiries}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No concierge inquiries match the specified filter."
               />

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={Boolean(deletingInquiry)}
                    onClose={() => setDeletingInquiry(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Inquiry Record"
                    message="Are you sure you wish to delete this inquiry communication?"
                    confirmLabel="Delete Inquiry"
                    isLoading={isDeleting}
               />
          </div>
     );
}
