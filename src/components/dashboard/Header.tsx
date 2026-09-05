'use client';

import { useAuth } from '@/hooks/useAuth';
import {
     useGetNotificationsQuery,
     useGetUnreadCountQuery,
     useMarkNotificationAsReadMutation,
     useMarkAllNotificationsAsReadMutation,
} from '@/redux/api/notificationApi';
import { Bell, CheckCheck, ExternalLink, Menu, User as UserIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Header({ onToggleSidebar }) {
     const { user } = useAuth();
     const [showNotifications, setShowNotifications] = useState(false);

     const { data: notifications = [] } = useGetNotificationsQuery({ limit: 5 });
     const { data: unreadData } = useGetUnreadCountQuery();
     const [markAsRead] = useMarkNotificationAsReadMutation();
     const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

     const unreadCount = unreadData?.count || 0;

     return (
          <header className="h-16 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
               <div className="flex items-center gap-3">
                    <button
                         onClick={onToggleSidebar}
                         className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                         <Menu className="w-5 h-5" />
                    </button>
                    <div className="hidden sm:block">
                         <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                              Hotel Management Portal
                         </span>
                    </div>
               </div>

               <div className="flex items-center gap-4">
                    {/* View Live Site Link */}
                    <Link
                         href="/"
                         target="_blank"
                         className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#b99d75] transition"
                    >
                         <span>Public Site</span>
                         <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Notification Bell */}
                    <div className="relative">
                         <button
                              onClick={() => setShowNotifications(!showNotifications)}
                              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none cursor-pointer"
                              aria-label="Notifications"
                         >
                              <Bell className="w-5 h-5" />
                              {unreadCount > 0 && (
                                   <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-black">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                   </span>
                              )}
                         </button>

                         {showNotifications && (
                              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
                                   <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                             Notifications
                                        </h4>
                                        {unreadCount > 0 && (
                                             <button
                                                  onClick={() => markAllAsRead()}
                                                  className="text-[10px] text-[#b99d75] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                             >
                                                  <CheckCheck className="w-3 h-3" /> Mark all read
                                             </button>
                                        )}
                                   </div>

                                   <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                             <p className="text-xs text-gray-500 py-6 text-center">No notifications yet</p>
                                        ) : (
                                             notifications.map((n) => (
                                                  <div
                                                       key={n.id}
                                                       onClick={() => !n.isRead && markAsRead(n.id)}
                                                       className={`p-2.5 text-xs border transition cursor-pointer ${
                                                            n.isRead
                                                                 ? 'bg-transparent border-gray-100 dark:border-gray-800 text-gray-500'
                                                                 : 'bg-[#b99d75]/10 border-[#b99d75]/30 text-gray-900 dark:text-white font-semibold'
                                                       }`}
                                                  >
                                                       <div className="flex items-center justify-between gap-2">
                                                            <p className="font-bold text-gray-900 dark:text-white">{n.title}</p>
                                                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#b99d75] shrink-0" />}
                                                       </div>
                                                       <p className="text-[11px] font-normal text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                                                            {n.message}
                                                       </p>
                                                       <span className="text-[10px] text-gray-400 mt-1 block">
                                                            {new Date(n.createdAt).toLocaleString()}
                                                       </span>
                                                  </div>
                                             ))
                                        )}
                                   </div>

                                   <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-center">
                                        <Link
                                             href="/dashboard/notifications"
                                             onClick={() => setShowNotifications(false)}
                                             className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b99d75] hover:underline uppercase tracking-wider"
                                        >
                                             <span>View Notification Center</span>
                                             <ArrowRight className="w-3 h-3" />
                                        </Link>
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* User Profile Tag */}
                    <Link
                         href="/dashboard/profile"
                         className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800 hover:opacity-85 transition"
                         title="Manage Profile & Security"
                    >
                         <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                                   {user?.fullName || user?.firstName || 'Valued User'}
                              </p>
                              <span className="text-[10px] font-bold text-[#b99d75] uppercase tracking-wider">
                                   {user?.role?.replace('_', ' ') || 'Guest'}
                              </span>
                         </div>
                         <div className="w-8 h-8 rounded-none bg-[#b99d75]/20 text-[#b99d75] border border-[#b99d75]/40 flex items-center justify-center font-black text-xs uppercase shrink-0">
                              {user?.firstName?.[0] || 'U'}
                         </div>
                    </Link>
               </div>
          </header>
     );
}
