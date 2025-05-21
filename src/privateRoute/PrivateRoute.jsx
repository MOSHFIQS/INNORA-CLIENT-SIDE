'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/provider/AuthProvider';
import Loading from '@/app/loading';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user?.email) {
            router.push('/signin');
        }
    }, [user]);

    if (loading) {
        return <Loading />
    }

    return children;
};

export default PrivateRoute;
