'use client';

import React, { useState, useEffect } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import { useCreateUserMutation, useUpdateUserMutation } from '@/redux/api/userApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER'];
const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

export interface UserFormModalProps {
     isOpen: boolean;
     onClose: () => void;
     initialData?: any;
}

export default function UserFormModal({ isOpen, onClose, initialData = null }: UserFormModalProps) {
     const isEditing = Boolean(initialData);
     const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
     const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

     const [formData, setFormData] = useState({
          fullName: '',
          email: '',
          password: '',
          role: 'STAFF',
          status: 'ACTIVE',
          phone: '',
          address: '',
     });

     useEffect(() => {
          if (initialData) {
               setFormData({
                    fullName: initialData.fullName || `${initialData.firstName || ''} ${initialData.lastName || ''}`.trim(),
                    email: initialData.email || '',
                    password: '',
                    role: initialData.role || 'STAFF',
                    status: initialData.status || 'ACTIVE',
                    phone: initialData.phone || '',
                    address: initialData.address || '',
               });
          } else {
               setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    role: 'STAFF',
                    status: 'ACTIVE',
                    phone: '',
                    address: '',
               });
          }
     }, [initialData, isOpen]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!formData.email || (!isEditing && !formData.password)) {
               toast.error('Email and password are required');
               return;
          }

          try {
               if (isEditing) {
                    const payload = {
                         fullName: formData.fullName,
                         role: formData.role,
                         status: formData.status,
                         phone: formData.phone,
                         address: formData.address,
                    };
                    await updateUser({ id: initialData.id || initialData._id, ...payload }).unwrap();
                    toast.success('User updated successfully');
               } else {
                    await createUser(formData).unwrap();
                    toast.success('User account created');
               }
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to save user account');
          }
     };

     const isLoading = isCreating || isUpdating;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title={isEditing ? 'Modify User & Permissions' : 'Create Hotel Staff / Admin Account'}
               description="Assign platform roles, manage account status, and configure credentials."
               maxWidth="max-w-md"
          >
               <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Full Name *
                         </label>
                         <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="e.g. Eleanor Vance"
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
                              disabled={isEditing}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="e.g. staff@innora.com"
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none disabled:opacity-60"
                         />
                    </div>

                    {!isEditing && (
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Initial Password *
                              </label>
                              <input
                                   type="password"
                                   required={!isEditing}
                                   value={formData.password}
                                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                   placeholder="Minimum 6 characters"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   System Role
                              </label>
                              <select
                                   value={formData.role}
                                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-semibold"
                              >
                                   {ROLES.map((r) => (
                                        <option key={r} value={r}>
                                             {r.replace('_', ' ')}
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
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-semibold"
                              >
                                   {USER_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                             {s}
                                        </option>
                                   ))}
                              </select>
                         </div>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Phone Number
                         </label>
                         <input
                              type="text"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 (555) 000-0000"
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <button
                              type="button"
                              onClick={onClose}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#b99d75] hover:bg-[#a68c65] text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
