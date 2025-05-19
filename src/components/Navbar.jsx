'use client'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { useContext } from 'react'
import { AuthContext } from '@/provider/AuthProvider'

const Navbar = () => {
  const {user} = useContext(AuthContext)
  
  return (
    <div className="navbar border border-gray-300 dark:bg-gray-900 bg-white dark:text-white text-black">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><Link href={'/rooms'}>Rooms</Link></li>
            <li><a>Item 1</a></li>
            <li><a>Item 1</a></li>
            <li><a>Item 1</a></li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <Link href={'/'} className="text-2xl font-extrabold">INNORA</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href={'/'}>Home</Link></li>
          <li><Link href={'/rooms'}>Rooms</Link></li>
          <li><Link href={'/myBookings'}>My Bookings</Link></li>
          <li><a>Item 1</a></li>
          <li><a>Item 1</a></li>
          <li><a>Item 3</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        
        
        {
          user ? <LogoutButton /> : <div className='flex gap-2'>
            <Link href={'/signin'} className="btn btn-sm bg-white dark:bg-black border-black dark:border-white dark:text-white">SignIn</Link>
            <Link href={'/signup'} className="btn btn-sm bg-white dark:bg-black border-black dark:border-white dark:text-white">SignUp</Link>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
