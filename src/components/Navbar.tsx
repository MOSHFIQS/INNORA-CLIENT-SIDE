'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { BsFillMenuButtonWideFill } from 'react-icons/bs';
import { usePathname } from 'next/navigation';

const Navbar = () => {
     const { user, isAuthenticated, isStaff, isAdmin, isSuperAdmin } = useAuth();
     const pathname = usePathname();

     const getLinkClass = (path) =>
          pathname === path
               ? 'text-[#c0a783] dark:text-[#b99d75] font-extrabold underline underline-offset-4'
               : 'hover:text-[#c0a783] dark:hover:text-[#b99d75] transition-colors duration-300';

     return (
          <div className="navbar dark:bg-[#1a1a1a] bg-white dark:text-white text-black relative h-20 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 z-50">
               {/* Navbar Start */}
               <div className="navbar-start gap-2">
                    <div className="dropdown group relative">
                         <div tabIndex={0} role="button" className="w-10 flex items-center justify-center lg:hidden">
                              <BsFillMenuButtonWideFill size={25} />
                         </div>
                         <div
                              tabIndex={0}
                              className="menu menu-sm dropdown-content bg-white dark:bg-[#252525] shadow-2xl rounded-none space-y-3 z-50 mt-[25px] -left-[8px] w-72 p-6 text-base border border-gray-200 dark:border-gray-700"
                         >
                              <Link href="/" className={getLinkClass('/')}>
                                   Home
                              </Link>
                              <Link href="/rooms" className={getLinkClass('/rooms')}>
                                   Rooms & Suites
                              </Link>
                              {isAuthenticated && (
                                   <Link href="/myBookings" className={getLinkClass('/myBookings')}>
                                        My Bookings
                                   </Link>
                              )}
                              {isAuthenticated && (
                                   <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                                        Dashboard {(isAdmin || isStaff) && <span className="badge badge-sm badge-warning ml-1">Staff</span>}
                                   </Link>
                              )}
                              <Link href="/contact" className={getLinkClass('/contact')}>
                                   Contact
                              </Link>
                              <Link href="/findUs" className={getLinkClass('/findUs')}>
                                   Find Us
                              </Link>
                              <div className="divider my-1"></div>
                              {isAuthenticated ? (
                                   <div className="flex flex-col gap-2">
                                        <div className="text-xs text-gray-500 font-semibold truncate">
                                             Signed in as: <span className="text-[#b99d75]">{user?.firstName || user?.email}</span>
                                        </div>
                                        <LogoutButton />
                                   </div>
                              ) : (
                                   <div className="flex flex-col gap-2">
                                        <Link href="/signin" className={getLinkClass('/signin')}>
                                             Sign In
                                        </Link>
                                        <Link href="/signup" className={getLinkClass('/signup')}>
                                             Sign Up
                                        </Link>
                                   </div>
                              )}
                         </div>
                    </div>
                    <Link
                         href="/"
                         className="text-2xl md:text-3xl font-extrabold tracking-wider text-black dark:text-white hover:text-[#c0a783] dark:hover:text-[#b99d75] transition-colors duration-300 font-serif"
                    >
                         INNORA
                    </Link>
               </div>

               {/* Navbar Center */}
               <div className="navbar-center hidden lg:flex uppercase">
                    <div className="menu menu-horizontal px-1 gap-7 text-xs font-semibold tracking-wider">
                         <Link href="/" className={getLinkClass('/')}>
                              Home
                         </Link>
                         <Link href="/rooms" className={getLinkClass('/rooms')}>
                              Rooms & Suites
                         </Link>
                         {isAuthenticated && (
                              <Link href="/myBookings" className={getLinkClass('/myBookings')}>
                                   My Bookings
                              </Link>
                         )}
                         {isAuthenticated && (
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
                         {isAuthenticated ? (
                              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                                   <span className="text-xs text-[#b99d75] font-bold truncate max-w-[120px]">
                                        {user?.firstName || user?.fullName}
                                   </span>
                                   <LogoutButton />
                              </div>
                         ) : (
                              <div className="flex gap-6 ml-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                                   <Link href="/signin" className={getLinkClass('/signin')}>
                                        SignIn
                                   </Link>
                                   <Link href="/signup" className={getLinkClass('/signup')}>
                                        SignUp
                                   </Link>
                              </div>
                         )}
                    </div>
               </div>

               {/* Navbar End */}
               <div className="navbar-end">
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
          </div>
     );
};

export default Navbar;
