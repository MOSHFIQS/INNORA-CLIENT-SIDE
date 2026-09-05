'use client';

import { useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../redux/api/authApi';

export const useAuth = () => {
     const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
     const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
     const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
     const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

     const login = async (credentials) => {
          return await loginMutation(credentials).unwrap();
     };

     const register = async (userData) => {
          return await registerMutation(userData).unwrap();
     };

     const logout = async () => {
          return await logoutMutation().unwrap();
     };

     const role = user?.role;
     const isSuperAdmin = role === 'SUPER_ADMIN';
     const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
     const isStaff = role === 'STAFF' || isAdmin;
     const isCustomer = role === 'CUSTOMER';

     return {
          user,
          isAuthenticated,
          isLoading: isLoading || isLoggingIn || isRegistering || isLoggingOut,
          error,
          login,
          register,
          logout,
          role,
          isSuperAdmin,
          isAdmin,
          isStaff,
          isCustomer,
     };
};
