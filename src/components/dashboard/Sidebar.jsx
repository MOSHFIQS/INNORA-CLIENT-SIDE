'use client';

import { useAuth } from '@/hooks/useAuth';
import {
     BedDouble,
     CalendarCheck,
     HelpCircle,
     Home,
     LayoutDashboard,
     LogOut,
     MessageSquare,
     Settings,
     ShieldAlert,
     Star,
     Users,
     UserCheck,
     X,
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

     const adminNavItems = [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Rooms & Suites', href: '/dashboard/rooms', icon: BedDouble },
          { name: 'Reservations', href: '/dashboard/bookings', icon: CalendarCheck },
          { name: 'Guest Reviews', href: '/dashboard/reviews', icon: Star },
          { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
          ...(isAdmin || isSuperAdmin
               ? [
                      { name: 'Staff & Users', href: '/dashboard/users', icon: Users },
                      { name: 'Settings & Banners', href: '/dashboard/settings', icon: Settings },
                 ]
               : []),
          { name: 'Profile & Security', href: '/dashboard/profile', icon: UserCheck },
     ];

     const customerNavItems = [
          { name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'My Bookings', href: '/myBookings', icon: CalendarCheck },
          { name: 'Explore Suites', href: '/rooms', icon: BedDouble },
          { name: 'Profile & Security', href: '/dashboard/profile', icon: UserCheck },
     ];

     const navItems = isStaff || isAdmin || isSuperAdmin ? adminNavItems : customerNavItems;

     const getLinkClass = (href) => {
          const isActive = pathname === href;
          return `flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-wider transition-all duration-200 ${
               isActive
                    ? 'bg-[#b99d75] text-white shadow'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`;
     };

     return (
          <>
               {/* Mobile Overlay */}
               {isOpen && (
                    <div
                         className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                         onClick={onClose}
                    />
               )}

               <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-[#121212] text-white z-50 transition-transform duration-300 flex flex-col justify-between border-r border-gray-800 ${
                         isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
               >
                    <div>
                         {/* Brand Logo & Close */}
                         <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                              <Link href="/" className="text-xl font-bold font-serif tracking-widest text-[#b99d75]">
                                   INNORA
                              </Link>
                              <button
                                   onClick={onClose}
                                   className="lg:hidden text-gray-400 hover:text-white p-1"
                              >
                                   <X className="w-5 h-5" />
                              </button>
                         </div>

                         {/* Navigation Menu */}
                         <nav className="p-4 space-y-1.5 overflow-y-auto">
                              <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                   Management
                              </p>
                              {navItems.map((item) => {
                                   const Icon = item.icon;
                                   return (
                                        <Link
                                             key={item.name}
                                             href={item.href}
                                             onClick={() => onClose?.()}
                                             className={getLinkClass(item.href)}
                                        >
                                             <Icon className="w-4 h-4 shrink-0" />
                                             <span>{item.name}</span>
                                        </Link>
                                   );
                              })}
                         </nav>
                    </div>

                    {/* Bottom User Area */}
                    <div className="p-4 border-t border-gray-800 space-y-3">
                         <div className="flex items-center gap-3 px-2 py-1">
                              <div className="w-9 h-9 rounded-full bg-[#b99d75] text-white flex items-center justify-center font-bold text-xs uppercase">
                                   {user?.firstName?.[0] || 'U'}
                              </div>
                              <div className="overflow-hidden">
                                   <p className="text-xs font-bold truncate text-white">{user?.fullName || user?.firstName}</p>
                                   <span className="text-[10px] text-gray-400 truncate block">{user?.email}</span>
                              </div>
                         </div>

                         <button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/40 border border-red-900/40 transition cursor-pointer"
                         >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Sign Out</span>
                         </button>
                    </div>
               </aside>
          </>
     );
}
