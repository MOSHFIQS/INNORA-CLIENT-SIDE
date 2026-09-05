'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetInquiryByIdQuery,
     useUpdateInquiryStatusMutation,
     useDeleteInquiryMutation,
} from '@/redux/api/inquiryApi';
import {
     ArrowLeft,
     Mail,
     Phone,
     User,
     Calendar,
     Clock,
     Trash2,
     Loader2,
     Save,
     MessageSquare,
     Send,
     CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INQUIRY_STATUSES = [
     { value: 'PENDING', label: 'Pending Reply', color: 'text-amber-500' },
     { value: 'CONTACTED', label: 'Guest Contacted', color: 'text-blue-500' },
     { value: 'RESOLVED', label: 'Resolved / Fulfilled', color: 'text-emerald-500' },
     { value: 'CLOSED', label: 'Closed / Archived', color: 'text-gray-500' },
];

export default function InquiryDetailPage() {
     const params = useParams();
     const inquiryId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';
     const router = useRouter();

     const { isSuperAdmin, isAdmin, isStaff } = useAuth();
     const canModerate = isSuperAdmin || isAdmin || isStaff;
     const canDelete = isSuperAdmin || isAdmin;

     const [showDelete, setShowDelete] = useState(false);
     const [status, setStatus] = useState('PENDING');
     const [adminNotes, setAdminNotes] = useState('');

     const { data: inquiryData, isLoading, error } = useGetInquiryByIdQuery(inquiryId);
     const [updateStatus, { isLoading: isUpdating }] = useUpdateInquiryStatusMutation();
     const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();

     const inquiry = inquiryData?.data || inquiryData;

     useEffect(() => {
          if (inquiry) {
               setStatus(inquiry.status || 'PENDING');
               setAdminNotes(inquiry.adminNotes || '');
          }
     }, [inquiry]);

     const handleSaveAction = async (e) => {
          e.preventDefault();
          try {
               await updateStatus({
                    id: inquiryId,
                    status,
                    adminNotes,
               }).unwrap();
               toast.success('Inquiry status and concierge notes updated');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update inquiry');
          }
     };

     const handleConfirmDelete = async () => {
          try {
               await deleteInquiry(inquiryId).unwrap();
               toast.success('Inquiry removed');
               router.push('/dashboard/inquiries');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete inquiry');
          }
     };

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#b99d75]" />
               </div>
          );
     }

     if (error || !inquiry) {
          return (
               <div className="space-y-6">
                    <PageHeader
                         title="Inquiry Not Found"
                         breadcrumbs={[
                              { label: 'Dashboard', href: '/dashboard' },
                              { label: 'Inquiries', href: '/dashboard/inquiries' },
                              { label: 'Detail' },
                         ]}
                    />
                    <div className="bg-white dark:bg-[#1a1a1a] p-8 border border-gray-200 dark:border-gray-800 text-center space-y-4">
                         <p className="text-gray-500 text-xs">The requested concierge inquiry could not be found.</p>
                         <Link
                              href="/dashboard/inquiries"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#b99d75] text-white text-xs font-bold uppercase tracking-wider"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back to Inquiries</span>
                         </Link>
                    </div>
               </div>
          );
     }

     return (
          <div className="space-y-6 max-w-5xl mx-auto">
               <PageHeader
                    title="Concierge Inquiry Dossier"
                    description={`Inquiry #${(inquiry.id || inquiry._id).toString().slice(-8)} — ${inquiry.subject || 'General Request'}`}
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Inquiries', href: '/dashboard/inquiries' },
                         { label: `Inquiry #${(inquiry.id || inquiry._id).toString().slice(-6)}` },
                    ]}
                    actions={
                         <div className="flex items-center gap-2">
                              <Link
                                   href="/dashboard/inquiries"
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
                    {/* Left Column: Message Thread & Details */}
                    <div className="lg:col-span-2 space-y-6">
                         {/* Inquiry Message Card */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                              <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                                   <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b99d75] block">
                                             Subject / Topic
                                        </span>
                                        <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white mt-1">
                                             {inquiry.subject || 'General Inquiry'}
                                        </h2>
                                   </div>
                                   <StatusBadge status={inquiry.status} />
                              </div>

                              <div className="space-y-2">
                                   <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Guest Message Content
                                   </label>
                                   <div className="p-5 bg-gray-50 dark:bg-[#202020] border-l-4 border-[#b99d75] text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                        {inquiry.message}
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-100 dark:border-gray-800">
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Received Timestamp
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                                             <Calendar className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'N/A'}
                                        </span>
                                   </div>
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Last Status Update
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                                             <Clock className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : 'N/A'}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* Staff Action & Response Section */}
                         {canModerate && (
                              <form onSubmit={handleSaveAction} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-5 shadow-xs">
                                   <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#b99d75]" />
                                        <span>Staff Response & Concierge Action</span>
                                   </h3>

                                   <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Inquiry Status Lifecycle *
                                        </label>
                                        <select
                                             value={status}
                                             onChange={(e) => setStatus(e.target.value)}
                                             className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                        >
                                             {INQUIRY_STATUSES.map((s) => (
                                                  <option key={s.value} value={s.value}>
                                                       {s.label} ({s.value})
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Internal Staff Notes & Guest Communication Record
                                        </label>
                                        <textarea
                                             rows={4}
                                             value={adminNotes}
                                             onChange={(e) => setAdminNotes(e.target.value)}
                                             placeholder="Log phone calls, suite reservations made, concierge arrangements completed, or follow-up notes..."
                                             className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>

                                   <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <button
                                             type="submit"
                                             disabled={isUpdating}
                                             className="flex items-center gap-2 px-6 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-sm"
                                        >
                                             {isUpdating ? (
                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                             ) : (
                                                  <Save className="w-4 h-4" />
                                             )}
                                             <span>Save Inquiry Status</span>
                                        </button>
                                   </div>
                              </form>
                         )}
                    </div>

                    {/* Right Column: Guest Information & Quick Actions */}
                    <div className="space-y-6">
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <User className="w-4 h-4 text-[#b99d75]" />
                                   <span>Guest Contact Info</span>
                              </h3>

                              <div className="space-y-3 text-xs">
                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">Sender Name</span>
                                        <strong className="text-gray-900 dark:text-white font-serif text-sm">
                                             {inquiry.name}
                                        </strong>
                                   </div>

                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">Email Address</span>
                                        <a
                                             href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject || 'INNORA Hospitality')}`}
                                             className="text-[#b99d75] hover:underline font-mono text-xs flex items-center gap-1.5 mt-0.5"
                                        >
                                             <Mail className="w-3.5 h-3.5" />
                                             <span>{inquiry.email}</span>
                                        </a>
                                   </div>

                                   {inquiry.phone && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">Contact Phone</span>
                                             <a
                                                  href={`tel:${inquiry.phone}`}
                                                  className="text-gray-700 dark:text-gray-300 font-mono text-xs flex items-center gap-1.5 mt-0.5 hover:text-[#b99d75]"
                                              >
                                                  <Phone className="w-3.5 h-3.5" />
                                                  <span>{inquiry.phone}</span>
                                             </a>
                                        </div>
                                   )}
                              </div>

                              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                   <a
                                        href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject || 'INNORA Hospitality')}`}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#b99d75]/10 hover:bg-[#b99d75] text-[#b99d75] hover:text-white text-xs font-bold uppercase tracking-wider transition"
                                   >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Email Reply Directly</span>
                                   </a>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={showDelete}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Inquiry Record"
                    message="Are you sure you wish to delete this inquiry communication?"
                    confirmLabel="Delete Inquiry"
                    isLoading={isDeleting}
               />
          </div>
     );
}
