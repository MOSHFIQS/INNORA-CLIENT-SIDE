'use client'
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
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
        <Link href={'/'} className='dark:text-white ' onClick={handleLogout}>
            Logout
        </Link>
    );
};

export default LogoutButton;