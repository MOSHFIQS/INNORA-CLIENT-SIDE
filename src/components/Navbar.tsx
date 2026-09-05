'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { BsFillMenuButtonWideFill } from 'react-icons/bs';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
     const { user, isAuthenticated, isStaff, isAdmin } = useAuth();
     const [mounted, setMounted] = useState(false);
     const pathname = usePathname();

     useEffect(() => {
          setMounted(true);
     }, []);

     const isLoggedIn = mounted && isAuthenticated;

     const getLinkClass = (path: string) =>
          pathname === path
               ? 'text-[#c0a783] dark:text-[#b99d75] font-extrabold underline underline-offset-4'
               : 'hover:text-[#c0a783] dark:hover:text-[#b99d75] transition-colors duration-300';




     return (
          <header className="dark:bg-[#1a1a1a] bg-white dark:text-white text-black relative h-20 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 z-50 flex items-center justify-between">
               {/* Navbar Start */}
               <div className="flex items-center gap-3">
                    {/* Mobile Dropdown Menu via Shadcn DropdownMenu */}
                    <div className="lg:hidden">
                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <button
                                        type="button"
                                        className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-[#b99d75] transition cursor-pointer"
                                        aria-label="Toggle menu"
                                   >
                                        <BsFillMenuButtonWideFill size={22} />
                                   </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-72 p-5 space-y-2.5">
                                   <DropdownMenuItem asChild>
                                        <Link href="/" className={getLinkClass('/')}>
                                             Home
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem asChild>
                                        <Link href="/rooms" className={getLinkClass('/rooms')}>
                                             Rooms & Suites
                                        </Link>
                                   </DropdownMenuItem>
                                   {isLoggedIn && (
                                        <DropdownMenuItem asChild>
                                             <Link href="/myBookings" className={getLinkClass('/myBookings')}>
                                                  My Bookings
                                             </Link>
                                        </DropdownMenuItem>
                                   )}
                                   {isLoggedIn && (
                                        <DropdownMenuItem asChild>
                                             <Link href="/dashboard" className={`flex items-center justify-between ${getLinkClass('/dashboard')}`}>
                                                  <span>Dashboard</span>
                                                  {(isAdmin || isStaff) && (
                                                       <Badge variant="warning" className="ml-1 text-[9px] px-1.5 py-0">
                                                            Staff
                                                       </Badge>
                                                  )}
                                             </Link>
                                        </DropdownMenuItem>
                                   )}
                                   <DropdownMenuItem asChild>
                                        <Link href="/contact" className={getLinkClass('/contact')}>
                                             Contact
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem asChild>
                                        <Link href="/findUs" className={getLinkClass('/findUs')}>
                                             Find Us
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator />
                                   {isLoggedIn ? (
                                        <div className="pt-2 space-y-2">
                                             <div className="text-xs text-gray-500 font-semibold truncate">
                                                  Signed in as: <span className="text-[#b99d75]">{user?.firstName || user?.email}</span>
                                             </div>
                                             <LogoutButton />
                                        </div>
                                   ) : mounted ? (
                                        <div className="pt-2 flex flex-col gap-2">
                                             <DropdownMenuItem asChild>
                                                  <Link href="/signin" className={getLinkClass('/signin')}>
                                                       Sign In
                                                  </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem asChild>
                                                  <Link href="/signup" className={getLinkClass('/signup')}>
                                                       Sign Up
                                                  </Link>
                                             </DropdownMenuItem>
                                        </div>
                                   ) : (
                                        <div className="pt-2 h-14" />
                                   )}
                              </DropdownMenuContent>
                         </DropdownMenu>
                    </div>

                    <Link
                         href="/"
                         className="text-2xl md:text-3xl font-extrabold tracking-wider text-black dark:text-white hover:text-[#c0a783] dark:hover:text-[#b99d75] transition-colors duration-300 font-serif"
                    >
                         INNORA
                    </Link>
               </div>

               {/* Navbar Center */}
               <nav className="hidden lg:flex items-center gap-7 uppercase text-xs font-semibold tracking-wider">
                    <Link href="/" className={getLinkClass('/')}>
                         Home
                    </Link>
                    <Link href="/rooms" className={getLinkClass('/rooms')}>
                         Rooms & Suites
                    </Link>
                    {isLoggedIn && (
                         <Link href="/myBookings" className={getLinkClass('/myBookings')}>
                              My Bookings
                         </Link>
                    )}
                    {isLoggedIn && (
                         <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                              Dashboard
                         </Link>
                    )}
                    <Link href="/contact" className={getLinkClass('/contact')}>
                         Contact
                    </Link>
                    <Link href="/findUs" className={getLinkClass('/findUs')}>
                         Find Us
                    </Link>

                    {isLoggedIn ? (
                         <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                              <span className="text-xs text-[#b99d75] font-bold truncate max-w-[120px]">
                                   {user?.firstName || user?.fullName}
                              </span>
                              <LogoutButton />
                         </div>
                    ) : mounted ? (
                         <div className="flex items-center gap-6 ml-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                              <Link href="/signin" className={getLinkClass('/signin')}>
                                   SignIn
                              </Link>
                              <Link href="/signup" className={getLinkClass('/signup')}>
                                   SignUp
                              </Link>
                         </div>
                    ) : (
                         <div className="w-28 h-4 ml-2 pl-4 border-l border-gray-300 dark:border-gray-700" />
                    )}
               </nav>

               {/* Navbar End */}
               <div className="flex items-center">
                    <Link
                         href="/rooms"
                         className="cursor-pointer font-semibold overflow-hidden relative z-10 border border-black dark:border-white group px-4 py-2 text-xs uppercase tracking-widest"
                    >
                         <span className="relative z-10 text-black dark:text-white group-hover:text-white dark:group-hover:text-black duration-500 font-bold">
                              BOOK NOW
                         </span>
                         <span className="absolute w-full h-full bg-[#b99d75] dark:bg-white -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
                         <span className="absolute w-full h-full bg-[#b99d75] dark:bg-white -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
                    </Link>
               </div>
          </header>
     );
};

export default Navbar;
