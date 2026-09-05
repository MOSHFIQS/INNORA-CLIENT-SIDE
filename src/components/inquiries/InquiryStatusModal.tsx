'use client';

import React, { useState, useEffect } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import { useUpdateInquiryStatusMutation } from '@/redux/api/inquiryApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INQUIRY_STATUSES = ['PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'];

export default function InquiryStatusModal({ isOpen, onClose, inquiry }) {
     const [updateStatus, { isLoading }] = useUpdateInquiryStatusMutation();
     const [status, setStatus] = useState('PENDING');
     const [adminNotes, setAdminNotes] = useState('');

     useEffect(() => {
          if (inquiry) {
               setStatus(inquiry.status || 'PENDING');
               setAdminNotes(inquiry.adminNotes || '');
          }
     }, [inquiry, isOpen]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!inquiry) return;

          try {
               await updateStatus({
                    id: inquiry.id || inquiry._id,
                    status,
                    adminNotes,
               }).unwrap();
               toast.success('Inquiry status and notes saved');
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update inquiry');
          }
     };

     if (!inquiry) return null;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Inquiry Action & Response"
               description={`Guest: ${inquiry.name} (${inquiry.email})`}
               maxWidth="max-w-md"
          >
               <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700">
                         <p className="font-bold text-gray-900 dark:text-white mb-1">Subject: {inquiry.subject || 'General'}</p>
                         <p className="text-gray-600 dark:text-gray-300 line-clamp-3 italic">&ldquo;{inquiry.message}&rdquo;</p>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Resolution Status
                         </label>
                         <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-semibold"
                         >
                              {INQUIRY_STATUSES.map((s) => (
                                   <option key={s} value={s}>
                                        {s}
                                   </option>
                              ))}
                         </select>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Staff Response & Action Notes
                         </label>
                         <textarea
                              rows={3}
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Record notes on phone contact, room arrangement, or concierge resolution..."
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
                              <span>Save Action</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
