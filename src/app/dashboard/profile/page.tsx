'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import MediaUploader from '@/components/shared/MediaUploader';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetProfileQuery,
     useUpdateProfileMutation,
     useChangePasswordMutation,
} from '@/redux/api/authApi';
import { User, Shield, Key, Save, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
     const { user } = useAuth();
     const { data: profileData } = useGetProfileQuery();
     const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
     const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

     const [profileForm, setProfileForm] = useState({
          fullName: '',
          phone: '',
          address: '',
          avatar: '',
     });

     const [passwordForm, setPasswordForm] = useState({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
     });

     useEffect(() => {
          const current = profileData || user;
          if (current) {
               setProfileForm({
                    fullName: current.fullName || `${current.firstName || ''} ${current.lastName || ''}`.trim(),
                    phone: current.phone || '',
                    address: current.address || '',
                    avatar: current.avatar || '',
               });
          }
     }, [profileData, user]);

     const handleProfileSubmit = async (e) => {
          e.preventDefault();
          try {
               await updateProfile(profileForm).unwrap();
               toast.success('Profile updated successfully');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update profile');
          }
     };

     const handlePasswordSubmit = async (e) => {
          e.preventDefault();

          if (passwordForm.newPassword !== passwordForm.confirmPassword) {
               toast.error('New passwords do not match');
               return;
          }
          if (passwordForm.newPassword.length < 6) {
               toast.error('New password must be at least 6 characters');
               return;
          }

          try {
               await changePassword({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
               }).unwrap();
               toast.success('Password changed successfully');
               setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
               });
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to change password');
          }
     };

     return (
          <div className="space-y-6 max-w-4xl mx-auto">
               <PageHeader
                    title="Profile & Security Settings"
                    description="Manage personal hospitality credentials, contact coordinates, avatar, and authentication security."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Profile' },
                    ]}
               />

               {/* Profile Identity Card */}
               <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-none bg-[#b99d75]/20 text-[#b99d75] border-2 border-[#b99d75]/40 flex items-center justify-center font-black text-2xl uppercase shrink-0 overflow-hidden">
                         {profileForm.avatar ? (
                              <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                              profileForm.fullName?.[0] || user?.email?.[0] || 'U'
                         )}
                    </div>

                    <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                         <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <h2 className="text-xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white truncate">
                                   {profileForm.fullName || user?.email}
                              </h2>
                              <StatusBadge status={user?.role || 'CUSTOMER'} />
                         </div>
                         <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                         <p className="text-[11px] text-[#b99d75] font-bold uppercase tracking-wider">
                              Verified INNORA Hotel Account
                         </p>
                    </div>
               </div>

               {/* Profile Edit Form */}
               <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                         <User className="w-4 h-4 text-[#b99d75]" />
                         <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Personal Information
                         </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Full Name
                              </label>
                              <input
                                   type="text"
                                   value={profileForm.fullName}
                                   onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                   placeholder="e.g. John Doe"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Phone Number
                              </label>
                              <input
                                   type="text"
                                   value={profileForm.phone}
                                   onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                   placeholder="+1 (555) 000-0000"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Address / Location
                              </label>
                              <input
                                   type="text"
                                   value={profileForm.address}
                                   onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                   placeholder="City, State, Country"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    {/* Avatar Upload */}
                    <MediaUploader
                         value={profileForm.avatar}
                         onChange={(img) => setProfileForm({ ...profileForm, avatar: img })}
                         multiple={false}
                         label="Profile Photograph"
                         hint="Upload high quality square avatar"
                    />

                    <div className="flex items-center justify-end pt-3">
                         <button
                              type="submit"
                              disabled={isUpdatingProfile}
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isUpdatingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Save Profile</span>
                         </button>
                    </div>
               </form>

               {/* Password Security Form */}
               <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                         <Key className="w-4 h-4 text-[#b99d75]" />
                         <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Authentication & Password Security
                         </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Current Password
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={passwordForm.currentPassword}
                                   onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                   placeholder="••••••••"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   New Password
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={passwordForm.newPassword}
                                   onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                   placeholder="Min 6 characters"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Confirm New Password
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={passwordForm.confirmPassword}
                                   onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                   placeholder="Re-enter password"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    <div className="flex items-center justify-end pt-3">
                         <button
                              type="submit"
                              disabled={isChangingPassword}
                              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#b99d75] dark:hover:bg-[#b99d75] dark:hover:text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isChangingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Update Password</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
