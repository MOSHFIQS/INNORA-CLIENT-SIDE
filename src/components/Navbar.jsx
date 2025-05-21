'use client'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { useContext } from 'react'
import { AuthContext } from '@/provider/AuthProvider'
import { BsFillMenuButtonWideFill } from "react-icons/bs";

const Navbar = () => {
  const {user} = useContext(AuthContext)
  
  return (
    <div className="navbar border border-gray-300 dark:bg-[#1c1c1c] bg-white dark:text-white text-black relative">
      <div className="navbar-start gap-2">
        <div className="dropdown">
          <div tabIndex={0} role="button" className=" w-10 flex items-center justify-center  lg:hidden">
            <BsFillMenuButtonWideFill size={25}/>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-900  border-white z-1 mt-[19px] -left-[9px] w-52 p-2 shadow">
            <li><Link href={'/'}>Home</Link></li>
            <li><Link href={'/rooms'}>Rooms</Link></li>
            {
              user && <li><Link href={'/myBookings'}>My Bookings</Link></li>
            }
            <li><Link href={'/contact'}>Contact</Link></li>
            <li><Link href={'/findUs'}>FIND US</Link></li>
            <li><Link href={'/rooms'}>BOOK NOW</Link></li>
            {
              user ? <LogoutButton /> : <div className='flex flex-col gap-2'>
                <li><Link href={'/signin'} className="">SignIn</Link></li>
                <li><Link href={'/signup'} className="">SignUp</Link></li>
              </div>
            }
          </ul>
        </div>
        <Link href={'/'} className="text-2xl font-extrabold">INNORA</Link>
      </div>
      <div className="navbar-center hidden lg:flex uppercase">
        <ul className="menu menu-horizontal px-1">
          <li><Link href={'/'}>Home</Link></li>
          <li><Link href={'/rooms'}>Rooms</Link></li>
          {
            user && <li><Link href={'/myBookings'}>My Bookings</Link></li>
          }
          <li><Link href={'/contact'}>Contact</Link></li>
          <li><Link href={'/findUs'}>FIND US</Link></li>
          {
            user ? <LogoutButton /> : <div className='flex gap-2'>
              <li><Link href={'/signin'} className="">SignIn</Link></li>
              <li><Link href={'/signup'} className="">SignUp</Link></li>
            </div>
          }
          
        </ul>
      </div>
      <div className="navbar-end">
        
        <button className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-white group px-2 py-1">
          <span className="relative z-10 text-white group-hover:text-black text-sm duration-500">BOOK NOW</span>
          <span className="absolute w-full h-full bg-[#c0a783] -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
          <span className="absolute w-full h-full bg-[#c0a783] -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
        </button>
        
      </div>
    </div>
  )
}

export default Navbar
