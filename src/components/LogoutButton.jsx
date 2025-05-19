'use client'
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext } from 'react';

const LogoutButton = () => {
    const { logOutUser } = useContext(AuthContext)
    const handleLogout = () => {
        logOutUser()
    }
    return (
        <button className='btn btn-sm bg-white dark:bg-black border-black dark:border-white dark:text-white' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;