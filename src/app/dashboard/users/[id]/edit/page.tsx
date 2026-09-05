'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import MediaUploader from '@/components/shared/MediaUploader';
import Loading from '@/app/loading';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/redux/api/userApi';
import { useParams, useRouter } from 'next/navigation';
import {
     Users,
     Shield,
     User,
     Mail,
     Phone,
     MapPin,
     ArrowLeft,
     Save,
     Loader2,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ROLES = [
     { label: 'Hotel Staff (Front Desk & Housekeeping)', value: 'STAFF' },
     { label: 'Hotel Administrator (Operations & Management)', value: 'ADMIN' },
     { label: 'Super Administrator (Global Authority)', value: 'SUPER_ADMIN' },
     { label: 'Distinguished Guest (Customer)', value: 'CUSTOMER' },
];

export default function EditUserPage() {
     const params = useParams();
     const userId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
     const router = useRouter();

     const { data: user, isLoading: isFetching } = useGetUserByIdQuery(userId, { skip: !userId });
     const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

     const [formData, setFormData] = useState({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'STAFF',
          status: 'ACTIVE',
          address: '',
          avatar: '',
          bio: '',
     });

     useEffect(() => {
          if (user) {
               setFormData({
                    firstName: user.firstName || user.fullName?.split(' ')[0] || '',
                    lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    role: user.role || 'STAFF',
                    status: user.status || 'ACTIVE',
                    address: user.address || '',
                    avatar: user.avatarUrl || user.avatar || '',
                    bio: user.bio || '',
               });
          }
     }, [user]);

     if (isFetching) return <Loading />;

     if (!user) {
          return (
               <div className="p-12 text-center bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 font-semibold">User account record not found.</p>
                    <Link href="/dashboard/users" className="text-xs text-[#b99d75] font-bold underline mt-2 block">
                         Return to User Directory
                    </Link>
               </div>
          );
     }

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!formData.firstName.trim() || !formData.lastName.trim()) {
               toast.error('First and last names are required');
               return;
          }

          const payload = {
               id: user.id || userId,
               firstName: formData.firstName.trim(),
               lastName: formData.lastName.trim(),
               fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
               email: formData.email.toLowerCase().trim(),
               phone: formData.phone.trim() || null,
               role: formData.role,
               status: formData.status,
               address: formData.address.trim() || null,
               avatarUrl: formData.avatar || null,
               bio: formData.bio.trim() || null,
          };

          try {
               await updateUser(payload).unwrap();
               toast.success('User account updated successfully!');
               router.push('/dashboard/users');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to update user account');
          }
     };

     return (
          <div className="space-y-6 max-w-4xl mx-auto">
               <PageHeader
                    title={`Edit User: ${formData.firstName} ${formData.lastName}`}
                    description="Update account profile coordinates, role permissions, and active status."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Users & Staff', href: '/dashboard/users' },
                         { label: 'Edit User' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/users"
                              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back to Directory</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Identity */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <User className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Account Identity & Coordinates
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        First Name *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Last Name *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Email Address *
                                   </label>
                                   <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Telephone Number
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1 sm:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Physical Address & Location
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Roles & Permissions */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Shield className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Authorization Role & Status
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Assigned Role *
                                   </label>
                                   <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                   >
                                        {ROLES.map((r) => (
                                             <option key={r.value} value={r.value}>
                                                  {r.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Account Status
                                   </label>
                                   <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                   >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="SUSPENDED">SUSPENDED</option>
                                   </select>
                              </div>

                              <div className="space-y-1 sm:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Staff Biography / Notes
                                   </label>
                                   <textarea
                                        rows={2}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <MediaUploader
                              value={formData.avatar}
                              onChange={(img) => setFormData({ ...formData, avatar: img })}
                              multiple={false}
                              label="Staff / User Profile Photograph"
                              hint="High resolution square profile portrait"
                         />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                         <Link
                              href="/dashboard/users"
                              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              Cancel
                         </Link>

                         <button
                              type="submit"
                              disabled={isUpdating}
                              className="flex items-center gap-2 px-8 py-3 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-md font-serif"
                         >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Save User Changes</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
