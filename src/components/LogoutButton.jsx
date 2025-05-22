'use client'
import { AuthContext } from '@/provider/AuthProvider';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';

const LogoutButton = () => {
    const { logOutUser } = useContext(AuthContext)
    const router = useRouter()
    const handleLogout = () => {
        logOutUser()
        router.push('/')
    }
    return (
        <button className='dark:text-white' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;