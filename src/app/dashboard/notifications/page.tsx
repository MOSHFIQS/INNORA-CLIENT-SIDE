'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetNotificationsQuery,
     useMarkNotificationAsReadMutation,
     useMarkAllNotificationsAsReadMutation,
} from '@/redux/api/notificationApi';
import { Bell, CheckCheck, Inbox, Check, Clock, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
     const { isSuperAdmin, isAdmin } = useAuth();
     const canBroadcast = isSuperAdmin || isAdmin;

     const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
     const { data: notificationsData, isLoading } = useGetNotificationsQuery({ limit: 50 });
     const [markAsRead] = useMarkNotificationAsReadMutation();
     const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

     const notifications = Array.isArray(notificationsData) ? notificationsData : notificationsData?.data || [];

     const filtered = notifications.filter((n) => {
          if (filter === 'UNREAD') return !n.isRead;
          if (filter === 'READ') return n.isRead;
          return true;
     });

     const handleMarkAll = async () => {
          try {
               await markAllAsRead().unwrap();
               toast.success('All notifications marked as read');
          } catch {
               toast.error('Failed to mark all as read');
          }
     };

     const handleSingleRead = async (id, isRead) => {
          if (isRead) return;
          try {
               await markAsRead(id).unwrap();
          } catch {
               // ignore
          }
     };

     return (
          <div className="space-y-6 max-w-4xl">
               <PageHeader
                    title="Notification Center"
                    description="Live alerts, reservation confirmations, inquiry updates, and hotel announcements."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Notifications' },
                    ]}
                    actions={
                         <div className="flex items-center gap-2">
                              {canBroadcast && (
                                   <Link
                                        href="/dashboard/notifications/send"
                                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                                   >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Dispatch Broadcast</span>
                                   </Link>
                              )}
                              <button
                                   onClick={handleMarkAll}
                                   disabled={isMarkingAll || !notifications.some((n) => !n.isRead)}
                                   className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 hover:border-[#b99d75] text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 transition disabled:opacity-50 cursor-pointer"
                              >
                                   <CheckCheck className="w-4 h-4 text-[#b99d75]" />
                                   <span>Mark All as Read</span>
                              </button>
                         </div>
                    }
               />

               {/* Filter Tabs */}
               <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                    {['ALL', 'UNREAD', 'READ'].map((tab) => (
                         <button
                              key={tab}
                              type="button"
                              onClick={() => setFilter(tab)}
                              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                                   filter === tab
                                        ? 'bg-[#b99d75] text-white'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                         >
                              {tab === 'ALL' ? 'All Alerts' : tab === 'UNREAD' ? 'Unread' : 'Read History'}
                         </button>
                    ))}
               </div>

               {/* Notifications Feed */}
               <div className="space-y-2.5">
                    {isLoading ? (
                         Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="p-4 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 animate-pulse h-20" />
                         ))
                    ) : filtered.length === 0 ? (
                         <div className="p-12 text-center bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800">
                              <Inbox className="w-8 h-8 mx-auto text-gray-400 opacity-50 mb-2" />
                              <p className="text-xs text-gray-500 font-semibold">No notifications in this category.</p>
                         </div>
                    ) : (
                         filtered.map((n) => (
                              <div
                                   key={n.id}
                                   onClick={() => handleSingleRead(n.id, n.isRead)}
                                   className={`p-4 border transition flex items-start justify-between gap-4 cursor-pointer ${
                                        n.isRead
                                             ? 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800/80 opacity-75'
                                             : 'bg-[#b99d75]/10 dark:bg-[#b99d75]/10 border-[#b99d75]/40 shadow-xs'
                                   }`}
                              >
                                   <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                             <h4 className="text-xs font-bold text-gray-900 dark:text-white font-serif">
                                                  {n.title}
                                             </h4>
                                             {!n.isRead && (
                                                  <span className="px-1.5 py-0.2 bg-[#b99d75] text-white text-[9px] font-bold uppercase">
                                                       New
                                                  </span>
                                             )}
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                             {n.message}
                                        </p>
                                        <span className="text-[10px] text-gray-400 block pt-0.5">
                                             {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                   </div>

                                   {!n.isRead && (
                                        <button
                                             type="button"
                                             onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleSingleRead(n.id, false);
                                             }}
                                             className="p-1 text-[#b99d75] hover:text-white hover:bg-[#b99d75] transition shrink-0"
                                             title="Mark as read"
                                        >
                                             <Check className="w-3.5 h-3.5" />
                                        </button>
                                   )}
                              </div>
                         ))
                    )}
               </div>
          </div>
     );
}
