'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { useSendNotificationMutation } from '@/redux/api/notificationApi';
import { useGetUsersQuery } from '@/redux/api/userApi';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ArrowLeft, Send, Loader2, Radio, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SendNotificationPage() {
     const router = useRouter();
     const { isSuperAdmin, isAdmin } = useAuth();
     const [sendNotification, { isLoading }] = useSendNotificationMutation();

     const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery({ limit: 100 });
     const users = Array.isArray(usersData) ? usersData : usersData?.data || [];

     const [targetType, setTargetType] = useState('ALL'); // 'ALL' | 'SPECIFIC'
     const [selectedUserId, setSelectedUserId] = useState('');
     const [type, setType] = useState('ANNOUNCEMENT');
     const [title, setTitle] = useState('');
     const [message, setMessage] = useState('');

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!title.trim() || !message.trim()) {
               toast.error('Please enter notification title and message');
               return;
          }

          if (targetType === 'SPECIFIC' && !selectedUserId) {
               toast.error('Please choose a recipient user');
               return;
          }

          try {
               await sendNotification({
                    title,
                    message,
                    type,
                    userId: targetType === 'SPECIFIC' ? selectedUserId : undefined,
               }).unwrap();
               toast.success(
                    targetType === 'ALL'
                         ? 'Broadcast announcement dispatched to all users'
                         : 'Direct notification dispatched to recipient'
               );
               router.push('/dashboard/notifications');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to dispatch notification');
          }
     };

     return (
          <div className="max-w-3xl mx-auto space-y-6">
               <PageHeader
                    title="Dispatch Notification & Broadcast"
                    description="Send announcements, system notices, stay reminders, or personalized alerts to guests and staff."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Notifications', href: '/dashboard/notifications' },
                         { label: 'Dispatch Alert' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/notifications"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                         <h2 className="text-base font-serif font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
                              <Bell className="w-4 h-4 text-[#b99d75]" />
                              <span>Notification Specifications</span>
                         </h2>

                         {/* Audience Selector */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Target Audience
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                   <button
                                        type="button"
                                        onClick={() => setTargetType('ALL')}
                                        className={`p-3.5 border text-left transition cursor-pointer flex items-center gap-3 ${
                                             targetType === 'ALL'
                                                  ? 'border-[#b99d75] bg-[#b99d75]/10 text-gray-900 dark:text-white'
                                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-600 dark:text-gray-400'
                                        }`}
                                   >
                                        <Radio className={`w-4 h-4 ${targetType === 'ALL' ? 'text-[#b99d75]' : 'text-gray-400'}`} />
                                        <div>
                                             <strong className="text-xs block">All Users (Broadcast)</strong>
                                             <span className="text-[10px] text-gray-400 block">Deliver to every guest & staff member</span>
                                        </div>
                                   </button>

                                   <button
                                        type="button"
                                        onClick={() => setTargetType('SPECIFIC')}
                                        className={`p-3.5 border text-left transition cursor-pointer flex items-center gap-3 ${
                                             targetType === 'SPECIFIC'
                                                  ? 'border-[#b99d75] bg-[#b99d75]/10 text-gray-900 dark:text-white'
                                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-600 dark:text-gray-400'
                                        }`}
                                   >
                                        <User className={`w-4 h-4 ${targetType === 'SPECIFIC' ? 'text-[#b99d75]' : 'text-gray-400'}`} />
                                        <div>
                                             <strong className="text-xs block">Specific Recipient</strong>
                                             <span className="text-[10px] text-gray-400 block">Target a single user or guest</span>
                                        </div>
                                   </button>
                              </div>
                         </div>

                         {/* Specific User Dropdown */}
                         {targetType === 'SPECIFIC' && (
                              <div className="space-y-1.5">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Select Recipient User *
                                   </label>
                                   {isLoadingUsers ? (
                                        <div className="text-xs text-gray-400">Loading user registry...</div>
                                   ) : (
                                        <select
                                             required
                                             value={selectedUserId}
                                             onChange={(e) => setSelectedUserId(e.target.value)}
                                             className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        >
                                             <option value="" disabled>-- Select Recipient User --</option>
                                             {users.map((u) => (
                                                  <option key={u.id || u._id} value={u.id || u._id}>
                                                       {u.fullName || 'User'} ({u.email}) — [{u.role}]
                                                  </option>
                                             ))}
                                        </select>
                                   )}
                              </div>
                         )}

                         {/* Category */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Notification Type / Category
                              </label>
                              <select
                                   value={type}
                                   onChange={(e) => setType(e.target.value)}
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              >
                                   <option value="ANNOUNCEMENT">Hotel Announcement & Promotion</option>
                                   <option value="BOOKING_UPDATE">Reservation & Booking Alert</option>
                                   <option value="INQUIRY_RESPONSE">Concierge & Inquiry Update</option>
                                   <option value="SYSTEM_ALERT">Security & System Notice</option>
                              </select>
                         </div>

                         {/* Title */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Alert Headline *
                              </label>
                              <input
                                   type="text"
                                   required
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   placeholder="e.g. Exclusive Weekend Wine Tasting Gala in Penthouse"
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         {/* Message */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Full Notification Body *
                              </label>
                              <textarea
                                   rows={5}
                                   required
                                   value={message}
                                   onChange={(e) => setMessage(e.target.value)}
                                   placeholder="Provide the complete message to display in the guest or staff notification feed..."
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                         <Link
                              href="/dashboard/notifications"
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
                              <span>Dispatch Notification</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
