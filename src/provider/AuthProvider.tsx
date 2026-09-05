'use client';

import React, { createContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
     const { user, isLoading, login, register, logout } = useAuth();

     const signInUser = async (email, password) => {
          return await login({ email, password });
     };

     const signUpUser = async (email, password, firstName = 'Guest', lastName = 'User') => {
          return await register({ email, password, firstName, lastName });
     };

     const logOutUser = async () => {
          return await logout();
     };

     const authInfo = {
          user: user
               ? {
                      ...user,
                      displayName: user.fullName || `${user.firstName} ${user.lastName}`,
                      photoURL: user.avatarUrl,
                 }
               : null,
          signInUser,
          signUpUser,
          logOutUser,
          loading: isLoading,
          setLoading: () => {},
     };

     return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;