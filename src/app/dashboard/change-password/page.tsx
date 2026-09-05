'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { useChangePasswordMutation } from '@/redux/api/authApi';
import { Shield, Key, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
     const [changePassword, { isLoading }] = useChangePasswordMutation();

     const [formData, setFormData] = useState({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
     });

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (formData.newPassword !== formData.confirmPassword) {
               toast.error('New passwords do not match');
               return;
          }
          if (formData.newPassword.length < 6) {
               toast.error('New password must be at least 6 characters');
               return;
          }

          try {
               await changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
               }).unwrap();
               toast.success('Password changed successfully');
               setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
               });
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to change password');
          }
     };

     return (
          <div className="space-y-6 max-w-xl">
               <PageHeader
                    title="Account Password Security"
                    description="Protect your guest account credentials with modern encrypted authentication."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Change Password' },
                    ]}
               />

               <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                         <Key className="w-4 h-4 text-[#b99d75]" />
                         <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Update Password
                         </h3>
                    </div>

                    <div className="space-y-3">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Current Password *
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={formData.currentPassword}
                                   onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                   placeholder="••••••••"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   New Password *
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={formData.newPassword}
                                   onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                   placeholder="Minimum 6 characters"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Confirm New Password *
                              </label>
                              <input
                                   type="password"
                                   required
                                   value={formData.confirmPassword}
                                   onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                   placeholder="Re-enter password"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    <div className="flex items-center justify-end pt-3">
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Save Password</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
