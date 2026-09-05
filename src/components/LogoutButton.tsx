'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const LogoutButton = () => {
     const { logout } = useAuth();
     const router = useRouter();

     const handleLogout = async () => {
          try {
               await logout();
               toast.success('Logged out successfully');
               router.push('/');
          } catch (e) {
               toast.error('Logout failed');
          }
     };

     return (
          <button
               onClick={handleLogout}
               className="text-left dark:text-white hover:text-[#c0a783] transition-colors cursor-pointer uppercase font-semibold"
          >
               Logout
          </button>
     );
};

export default LogoutButton;