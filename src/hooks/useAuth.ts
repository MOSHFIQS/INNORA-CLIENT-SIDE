'use client';

import {
     useGetMeQuery,
     useLogoutMutation,
     useLoginMutation,
     useRegisterMutation,
     useChangePasswordMutation,
     useUpdateProfileMutation,
} from '@/redux/api/authApi';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUser, setLoading, clearAuth } from '@/redux/slices/authSlice';
import { baseApi } from '@/redux/api/baseApi';

export function useAuth() {
     const dispatch = useAppDispatch();
     const { user: reduxUser, isAuthenticated, isLoading: reduxLoading, error: reduxError } = useAppSelector((state) => state.auth);
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     const hasSession = mounted && typeof window !== 'undefined' && document.cookie.includes('user_session');
     const { data: user, isLoading, error } = useGetMeQuery(undefined, { skip: !hasSession });

     // Automatically clear the isLoggedIn indicator cookie if set by the backend
     if (typeof window !== 'undefined' && document.cookie.includes('isLoggedIn')) {
          document.cookie = 'isLoggedIn=; Max-Age=0; path=/;';
     }

     useEffect(() => {
          if (isLoading) {
               if (!reduxUser) {
                    dispatch(setLoading(true));
               }
          } else if (user) {
               dispatch(setUser(user));
               if (typeof window !== 'undefined') {
                    const sessionData = {
                         id: user.id || user._id,
                         role: user.role,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                         email: user.email,
                         avatar: user.avatar || user.avatarUrl,
                    };
                    document.cookie = `user_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800;`;
               }
          } else if (error) {
               dispatch(clearAuth());
               if (typeof window !== 'undefined') {
                    document.cookie = 'user_session=; Max-Age=0; path=/;';
               }
          }
     }, [user, isLoading, error, dispatch]);

     const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
     const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
     const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
     const [changePasswordMutation, { isLoading: isChangingPassword }] = useChangePasswordMutation();
     const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

     const login = async (credentials: any) => {
          const res = await loginMutation(credentials).unwrap();
          if (res && res.user) {
               dispatch(setUser(res.user));
               if (typeof window !== 'undefined') {
                    const sessionData = {
                         id: res.user.id || res.user._id,
                         role: res.user.role,
                         firstName: res.user.firstName,
                         lastName: res.user.lastName,
                         fullName: res.user.fullName || `${res.user.firstName || ''} ${res.user.lastName || ''}`.trim(),
                         email: res.user.email,
                         avatar: res.user.avatar || res.user.avatarUrl,
                    };
                    document.cookie = `user_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800;`;
               }
          }
          return res;
     };

     const register = async (userData: any) => {
          const res = await registerMutation(userData).unwrap();
          if (res && res.user) {
               dispatch(setUser(res.user));
               if (typeof window !== 'undefined') {
                    const sessionData = {
                         id: res.user.id || res.user._id,
                         role: res.user.role,
                         firstName: res.user.firstName,
                         lastName: res.user.lastName,
                         fullName: res.user.fullName || `${res.user.firstName || ''} ${res.user.lastName || ''}`.trim(),
                         email: res.user.email,
                         avatar: res.user.avatar || res.user.avatarUrl,
                    };
                    document.cookie = `user_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800;`;
               }
          }
          return res;
     };

     const logout = async () => {
          dispatch(clearAuth());
          if (typeof window !== 'undefined') {
               document.cookie = 'user_session=; Max-Age=0; path=/;';
          }
          try {
               await logoutMutation().unwrap();
          } catch {
               // ignore — local state is already cleared
          }
          dispatch(baseApi.util.resetApiState());
     };

     const changePassword = async (currentPassword: string, newPassword: string) => {
          return await changePasswordMutation({ currentPassword, newPassword }).unwrap();
     };

     const updateProfile = async (data: any) => {
          return await updateProfileMutation(data).unwrap();
     };

     const role = reduxUser?.role;
     const isSuperAdmin = role === 'SUPER_ADMIN';
     const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
     const isStaff = role === 'STAFF' || isAdmin;
     const isCustomer = role === 'CUSTOMER';

     return {
          user: reduxUser,
          isAuthenticated,
          isLoading: reduxLoading || isLoggingIn || isRegistering || isLoggingOut,
          error: reduxError,
          login,
          register,
          logout,
          changePassword,
          updateProfile,
          role,
          isSuperAdmin,
          isAdmin,
          isStaff,
          isCustomer,
     };
}

export type AuthContextType = ReturnType<typeof useAuth>;

