'use client'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { useContext } from 'react'
import { AuthContext } from '@/provider/AuthProvider'
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  const pathname = usePathname()

  // Helper for active link styling
  const getLinkClass = (path) =>
    pathname === path
      ? 'text-[#c0a783] dark:text-white  font-extrabold underline'
      : 'hover:text-[#c0a783] dark:hover:text-black transition-colors duration-300'

  return (
    <div className="navbar dark:bg-[#b99d75] bg-white dark:text-white text-black relative h-20 hover:h-24 transition-all duration-700 ease-in-out border-b dark:border-0">

      {/* Navbar Start */}
      <div className="navbar-start gap-2">
        <div className="dropdown group relative">
          <div tabIndex={0} role="button" className="w-10 flex items-center justify-center lg:hidden">
            <BsFillMenuButtonWideFill size={25} />
          </div>
          <div
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white dark:bg-[#b99d75] space-y-2 z-10 mt-[25px] -left-[8px] min-w-screen p-4 text-xl transform translate-x-full opacity-0 transition-all duration-[300ms] ease-in-out group-focus-within:translate-x-0 group-focus-within:opacity-100">
            <Link href="/" className={getLinkClass('/')}>Home</Link>
            <Link href="/rooms" className={getLinkClass('/rooms')}>Rooms</Link>
            {user && <Link href="/myBookings" className={getLinkClass('/myBookings')}>My Bookings</Link>}
            <Link href="/contact" className={getLinkClass('/contact')}>Contact</Link>
            <Link href="/findUs" className={getLinkClass('/findUs')}>FIND US</Link>
            <Link href="/rooms" className={getLinkClass('/rooms')}>BOOK NOW</Link>
            {
              user ? <LogoutButton /> : (
                <div className='flex flex-col gap-2'>
                  <Link href="/signin" className={getLinkClass('/signin')}>SignIn</Link>
                  <Link href="/signup" className={getLinkClass('/signup')}>SignUp</Link>
                </div>
              )
            }
          </div>
        </div>
        <Link href="/" className="text-3xl font-extrabold playwrite hover:text-[#c0a783] dark:hover:text-black transition-colors duration-300">INNORA</Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex uppercase">
        <div className="menu menu-horizontal px-1 gap-8 playwrite">
          <Link href="/" className={getLinkClass('/')}>Home</Link>
          <Link href="/rooms" className={getLinkClass('/rooms')}>Rooms</Link>
          {user && <Link href="/myBookings" className={getLinkClass('/myBookings')}>My Bookings</Link>}
          <Link href="/contact" className={getLinkClass('/contact')}>Contact</Link>
          <Link href="/findUs" className={getLinkClass('/findUs')}>FIND US</Link>
          {
            user ? <LogoutButton /> : (
              <div className='flex gap-8'>
                <Link href="/signin" className={getLinkClass('/signin')}>SignIn</Link>
                <Link href="/signup" className={getLinkClass('/signup')}>SignUp</Link>
              </div>
            )
          }
        </div>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        <button className="cursor-pointer font-semibold overflow-hidden relative z-100 border dark:border-white group px-2 py-1">
          <span className="relative z-10 dark:text-white dark:group-hover:text-black hover:text-white text-sm duration-500 playwrite">BOOK NOW</span>
          <span className="absolute w-full h-full bg-[#c0a783] dark:bg-white -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
          <span className="absolute w-full h-full bg-[#c0a783] dark:bg-white -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
