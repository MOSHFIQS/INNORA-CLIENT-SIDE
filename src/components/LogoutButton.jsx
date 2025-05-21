'use client'
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext } from 'react';

const LogoutButton = () => {
    const { logOutUser } = useContext(AuthContext)
    const handleLogout = () => {
        logOutUser()
    }
    return (
        <button className='    dark:text-white' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;