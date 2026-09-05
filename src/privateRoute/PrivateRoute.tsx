'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

const PrivateRoute = ({ children }) => {
     return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default PrivateRoute;
