'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/redux/api/authApi';
import toast from 'react-hot-toast';
import { User, Lock, Save, KeyRound } from 'lucide-react';

export default function ProfileSettingsPage() {
     const { user } = useAuth();
     const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
     const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

     const [profileData, setProfileData] = useState({
          firstName: '',
          lastName: '',
          phone: '',
          bio: '',
          city: '',
          country: '',
     });

     const [passwordData, setPasswordData] = useState({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
     });

     useEffect(() => {
          if (user) {
               setProfileData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    bio: user.bio || '',
                    city: user.city || '',
                    country: user.country || '',
               });
          }
     }, [user]);

     const handleUpdateProfile = async (e) => {
          e.preventDefault();
          try {
               await updateProfile(profileData).unwrap();
               toast.success('Profile updated successfully');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update profile');
          }
     };

     const handleChangePassword = async (e) => {
          e.preventDefault();
          if (passwordData.newPassword !== passwordData.confirmPassword) {
               toast.error('New passwords do not match');
               return;
          }
          if (passwordData.newPassword.length < 6) {
               toast.error('Password must be at least 6 characters long');
               return;
          }

          try {
               await changePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
               }).unwrap();
               toast.success('Password changed successfully');
               setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to change password');
          }
     };

     return (
          <div className="space-y-8 max-w-4xl">
               <div>
                    <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                         Profile & Security
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                         Update your contact profile and account credentials
                    </p>
               </div>

               {/* Profile Form */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                         <User className="w-4 h-4 text-[#b99d75]" />
                         <h2 className="text-xs font-bold uppercase tracking-wider text-[#b99d75] font-serif">
                              Personal Information
                         </h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                         <div>
                              <label className="block font-bold uppercase mb-1">First Name</label>
                              <input
                                   type="text"
                                   required
                                   value={profileData.firstName}
                                   onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Last Name</label>
                              <input
                                   type="text"
                                   required
                                   value={profileData.lastName}
                                   onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div>
                              <label className="block font-bold uppercase mb-1">Email (Read Only)</label>
                              <input
                                   type="email"
                                   disabled
                                   value={user?.email || ''}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Phone Number</label>
                              <input
                                   type="tel"
                                   value={profileData.phone}
                                   onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div>
                              <label className="block font-bold uppercase mb-1">City</label>
                              <input
                                   type="text"
                                   value={profileData.city}
                                   onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Country</label>
                              <input
                                   type="text"
                                   value={profileData.country}
                                   onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div className="col-span-1 md:col-span-2">
                              <label className="block font-bold uppercase mb-1">Bio / Notes</label>
                              <textarea
                                   rows="2"
                                   value={profileData.bio}
                                   onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent resize-none"
                              ></textarea>
                         </div>

                         <div className="col-span-1 md:col-span-2 flex justify-end">
                              <button
                                   type="submit"
                                   disabled={isUpdatingProfile}
                                   className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1"
                              >
                                   <Save className="w-3.5 h-3.5" />
                                   <span>{isUpdatingProfile ? 'Saving...' : 'Update Profile'}</span>
                              </button>
                         </div>
                    </form>
               </div>

               {/* Change Password Form */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                         <KeyRound className="w-4 h-4 text-[#b99d75]" />
                         <h2 className="text-xs font-bold uppercase tracking-wider text-[#b99d75] font-serif">
                              Security & Password
                         </h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                         <div>
                              <label className="block font-bold uppercase mb-1">Current Password *</label>
                              <input
                                   type="password"
                                   required
                                   value={passwordData.currentPassword}
                                   onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">New Password *</label>
                              <input
                                   type="password"
                                   required
                                   minLength="6"
                                   value={passwordData.newPassword}
                                   onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Confirm New Password *</label>
                              <input
                                   type="password"
                                   required
                                   minLength="6"
                                   value={passwordData.confirmPassword}
                                   onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div className="col-span-1 md:col-span-3 flex justify-end">
                              <button
                                   type="submit"
                                   disabled={isChangingPassword}
                                   className="btn btn-sm rounded-none bg-black dark:bg-gray-700 text-white uppercase text-xs flex items-center gap-1"
                              >
                                   <Lock className="w-3.5 h-3.5" />
                                   <span>{isChangingPassword ? 'Updating...' : 'Change Password'}</span>
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}
