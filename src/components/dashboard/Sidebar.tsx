'use client';

import { useAuth } from '@/hooks/useAuth';
import {
     BedDouble,
     CalendarCheck,
     Home,
     LayoutDashboard,
     LogOut,
     MessageSquare,
     Settings,
     Shield,
     Star,
     Users,
     UserCheck,
     X,
     Bell,
     Image as ImageIcon,
     Activity,
     Key,
     Compass,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

export default function Sidebar({ isOpen, onClose }) {
     const { user, isStaff, isAdmin, isSuperAdmin, logout } = useAuth();
     const pathname = usePathname();
     const router = useRouter();

     const handleLogout = async () => {
          try {
               await logout();
               toast.success('Logged out successfully');
               router.push('/');
          } catch {
               toast.error('Logout error');
          }
     };

     // Route definitions grouped by section
     const superAdminNavGroups = [
          {
               title: 'Command & Operations',
               items: [
                    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { name: 'Reservations', href: '/dashboard/bookings', icon: CalendarCheck },
                    { name: 'Suites & Rooms', href: '/dashboard/rooms', icon: BedDouble },
                    { name: 'User Management', href: '/dashboard/users', icon: Users },
               ],
          },
          {
               title: 'Guest Relations',
               items: [
                    { name: 'Guest Reviews', href: '/dashboard/reviews', icon: Star },
                    { name: 'Inquiries & Concierge', href: '/dashboard/inquiries', icon: MessageSquare },
               ],
          },
          {
               title: 'Platform & Security',
               items: [
                    { name: 'Hero Banners', href: '/dashboard/banners', icon: ImageIcon },
                    { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: Activity },
                    { name: 'Hotel Settings', href: '/dashboard/settings', icon: Settings },
                    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
                    { name: 'Profile & Security', href: '/dashboard/profile', icon: UserCheck },
               ],
          },
     ];

     const adminNavGroups = [
          {
               title: 'Management',
               items: [
                    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { name: 'Reservations', href: '/dashboard/bookings', icon: CalendarCheck },
                    { name: 'Suites & Rooms', href: '/dashboard/rooms', icon: BedDouble },
                    { name: 'Users & Staff', href: '/dashboard/users', icon: Users },
               ],
          },
          {
               title: 'Guest Relations',
               items: [
                    { name: 'Guest Reviews', href: '/dashboard/reviews', icon: Star },
                    { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
               ],
          },
          {
               title: 'Configuration',
               items: [
                    { name: 'Hero Banners', href: '/dashboard/banners', icon: ImageIcon },
                    { name: 'Hotel Settings', href: '/dashboard/settings', icon: Settings },
                    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
                    { name: 'Profile', href: '/dashboard/profile', icon: UserCheck },
               ],
          },
     ];

     const staffNavGroups = [
          {
               title: 'Front Desk & Housekeeping',
               items: [
                    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { name: 'Reservations', href: '/dashboard/bookings', icon: CalendarCheck },
                    { name: 'Room Status', href: '/dashboard/rooms', icon: BedDouble },
               ],
          },
          {
               title: 'Guest Assistance',
               items: [
                    { name: 'Guest Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
                    { name: 'Guest Reviews', href: '/dashboard/reviews', icon: Star },
                    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
                    { name: 'Staff Profile', href: '/dashboard/profile', icon: UserCheck },
               ],
          },
     ];

     const customerNavGroups = [
          {
               title: 'Guest Dashboard',
               items: [
                    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { name: 'My Reservations', href: '/dashboard/bookings', icon: CalendarCheck },
                    { name: 'My Reviews', href: '/dashboard/reviews', icon: Star },
                    { name: 'My Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
               ],
          },
          {
               title: 'Hotel Experience',
               items: [
                    { name: 'Explore Suites', href: '/rooms', icon: Compass },
                    { name: 'Book a Stay', href: '/rooms', icon: Key },
               ],
          },
          {
               title: 'Account Settings',
               items: [
                    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
                    { name: 'Profile Details', href: '/dashboard/profile', icon: UserCheck },
                    { name: 'Change Password', href: '/dashboard/change-password', icon: Shield },
               ],
          },
     ];

     const navGroups = isSuperAdmin
          ? superAdminNavGroups
          : isAdmin
          ? adminNavGroups
          : isStaff
          ? staffNavGroups
          : customerNavGroups;

     const getLinkClass = (href) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return `flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
               isActive
                    ? 'bg-[#b99d75] text-white shadow-xs font-extrabold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`;
     };

     return (
          <>
               {/* Mobile Overlay */}
               {isOpen && (
                    <div
                         className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
                         onClick={onClose}
                    />
               )}

               <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-[#121212] text-white z-50 transition-transform duration-300 flex flex-col justify-between border-r border-gray-800 ${
                         isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
               >
                    <div className="overflow-y-auto flex-1 flex flex-col">
                         {/* Brand Logo & Close */}
                         <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0 bg-[#0e0e0e]">
                              <Link href="/" className="flex items-center gap-2 text-xl font-bold font-serif tracking-widest text-[#b99d75]">
                                   <span>INNORA</span>
                              </Link>
                              <button
                                   onClick={onClose}
                                   className="lg:hidden text-gray-400 hover:text-white p-1"
                              >
                                   <X className="w-5 h-5" />
                              </button>
                         </div>

                         {/* Navigation Groups */}
                         <nav className="p-3 space-y-5 flex-1">
                              {navGroups.map((group, gIdx) => (
                                   <div key={group.title || gIdx} className="space-y-1">
                                        <p className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                             {group.title}
                                        </p>
                                        <div className="space-y-0.5">
                                             {group.items.map((item) => {
                                                  const Icon = item.icon;
                                                  return (
                                                       <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={() => onClose?.()}
                                                            className={getLinkClass(item.href)}
                                                       >
                                                            <div className="flex items-center gap-3">
                                                                 <Icon className="w-4 h-4 shrink-0" />
                                                                 <span>{item.name}</span>
                                                            </div>
                                                       </Link>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              ))}
                         </nav>
                    </div>

                    {/* Bottom User Area */}
                    <div className="p-4 border-t border-gray-800 space-y-3 shrink-0 bg-[#0d0d0d]">
                         <div className="flex items-center gap-3 px-1 py-0.5">
                              <div className="w-9 h-9 bg-[#b99d75]/20 text-[#b99d75] border border-[#b99d75]/40 flex items-center justify-center font-black text-xs uppercase shrink-0">
                                   {user?.fullName?.[0] || user?.firstName?.[0] || 'U'}
                              </div>
                              <div className="overflow-hidden min-w-0">
                                   <p className="text-xs font-bold truncate text-white">
                                        {user?.fullName || user?.firstName || 'Valued User'}
                                   </p>
                                   <span className="text-[10px] text-[#b99d75] font-bold uppercase tracking-wider truncate block">
                                        {user?.role?.replace('_', ' ') || 'Guest'}
                                   </span>
                              </div>
                         </div>

                         <button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/40 border border-red-900/30 transition cursor-pointer"
                         >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Sign Out</span>
                         </button>
                    </div>
               </aside>
          </>
     );
}
