'use client';

import React from 'react';
import {
     useGetInquiriesQuery,
     useUpdateInquiryStatusMutation,
     useDeleteInquiryMutation,
} from '@/redux/api/inquiryApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Mail, Phone, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function InquiriesPage() {
     const { data: inquiriesData, isLoading } = useGetInquiriesQuery();
     const [updateStatus] = useUpdateInquiryStatusMutation();
     const [deleteInquiry] = useDeleteInquiryMutation();

     const inquiries = inquiriesData?.data || [];

     const handleStatus = async (id, status) => {
          try {
               await updateStatus({ id, status }).unwrap();
               toast.success(`Inquiry marked as ${status}`);
          } catch {
               toast.error('Failed to update status');
          }
     };

     const handleDelete = async (id) => {
          if (!confirm('Are you sure you want to delete this inquiry message?')) return;
          try {
               await deleteInquiry(id).unwrap();
               toast.success('Inquiry deleted');
          } catch {
               toast.error('Failed to delete');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                         Concierge & Guest Inquiries
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                         Respond to banquet inquiries, private event requests, and contact messages
                    </p>
               </div>

               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">Inquiry #</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Subject</th>
                                        <th className="p-3">Message</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {inquiries.length === 0 ? (
                                        <tr>
                                             <td colSpan="6" className="text-center py-8 text-xs text-gray-500">
                                                  No inquiries received yet.
                                             </td>
                                        </tr>
                                   ) : (
                                        inquiries.map((inq) => (
                                             <tr key={inq.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                  <td className="p-3 font-bold text-[#b99d75]">{inq.inquiryNumber}</td>
                                                  <td className="p-3">
                                                       <div className="font-bold text-gray-900 dark:text-white">{inq.name}</div>
                                                       <div className="text-[10px] text-gray-400">{inq.email} {inq.phone && `• ${inq.phone}`}</div>
                                                  </td>
                                                  <td className="p-3 font-semibold">{inq.subject || 'General Request'}</td>
                                                  <td className="p-3 max-w-sm text-gray-600 dark:text-gray-300 normal-case">
                                                       {inq.message}
                                                  </td>
                                                  <td className="p-3">
                                                       <span
                                                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                                                 inq.status === 'PENDING'
                                                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                      : inq.status === 'CONTACTED'
                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                            }`}
                                                       >
                                                            {inq.status}
                                                       </span>
                                                  </td>
                                                  <td className="p-3 text-right space-x-1.5">
                                                       {inq.status === 'PENDING' && (
                                                            <button
                                                                 onClick={() => handleStatus(inq.id, 'CONTACTED')}
                                                                 className="btn btn-xs rounded-none bg-blue-600 hover:bg-blue-700 text-white uppercase text-[10px]"
                                                            >
                                                                 Mark Contacted
                                                            </button>
                                                       )}
                                                       {inq.status === 'CONTACTED' && (
                                                            <button
                                                                 onClick={() => handleStatus(inq.id, 'RESOLVED')}
                                                                 className="btn btn-xs rounded-none bg-emerald-600 hover:bg-emerald-700 text-white uppercase text-[10px]"
                                                            >
                                                                 Mark Resolved
                                                            </button>
                                                       )}
                                                       <button
                                                            onClick={() => handleDelete(inq.id)}
                                                            className="btn btn-xs rounded-none bg-red-600 hover:bg-red-700 text-white"
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
