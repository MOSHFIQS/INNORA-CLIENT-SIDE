'use client';

import React, { useState } from 'react';
import {
     useGetUsersQuery,
     useCreateUserMutation,
     useUpdateUserMutation,
     useDeleteUserMutation,
} from '@/redux/api/userApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Shield, User, Search } from 'lucide-react';

export default function UsersManagementPage() {
     const [search, setSearch] = useState('');
     const [roleFilter, setRoleFilter] = useState('');
     const [isModalOpen, setIsModalOpen] = useState(false);

     const { data: usersData, isLoading } = useGetUsersQuery({
          search: search || undefined,
          role: roleFilter || undefined,
     });

     const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
     const [updateUser] = useUpdateUserMutation();
     const [deleteUser] = useDeleteUserMutation();

     const users = usersData?.data || [];

     const [formData, setFormData] = useState({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          role: 'STAFF',
     });

     const handleCreateUser = async (e) => {
          e.preventDefault();
          try {
               await createUser(formData).unwrap();
               toast.success('Staff/Admin account created successfully');
               setIsModalOpen(false);
               setFormData({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'STAFF' });
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to create user');
          }
     };

     const handleToggleRole = async (user, newRole) => {
          try {
               await updateUser({ id: user.id, role: newRole }).unwrap();
               toast.success(`Role updated to ${newRole}`);
          } catch {
               toast.error('Failed to update role');
          }
     };

     const handleDelete = async (id) => {
          if (!confirm('Are you sure you want to deactivate this account?')) return;
          try {
               await deleteUser(id).unwrap();
               toast.success('User deactivated');
          } catch {
               toast.error('Failed to delete user');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              Staff & User Accounts
                         </h1>
                         <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                              Manage front desk staff, administrators, and guest accounts
                         </p>
                    </div>

                    <button
                         onClick={() => setIsModalOpen(true)}
                         className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1.5 shadow"
                    >
                         <Plus className="w-4 h-4" />
                         <span>Add Staff Member</span>
                    </button>
               </div>

               {/* Filter Bar */}
               <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#202020] p-4 border border-gray-200 dark:border-gray-800">
                    <div className="relative flex-1 min-w-[200px]">
                         <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                         <input
                              type="text"
                              placeholder="Search by name, email, or phone..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                         />
                    </div>
                    <select
                         value={roleFilter}
                         onChange={(e) => setRoleFilter(e.target.value)}
                         className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                    >
                         <option value="">All Roles</option>
                         <option value="SUPER_ADMIN">Super Admin</option>
                         <option value="ADMIN">Admin</option>
                         <option value="STAFF">Staff</option>
                         <option value="CUSTOMER">Customer</option>
                    </select>
               </div>

               {/* Table */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">User</th>
                                        <th className="p-3">Email & Contact</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Total Reservations</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                             <td className="p-3">
                                                  <div className="font-bold text-gray-900 dark:text-white">{u.fullName || `${u.firstName} ${u.lastName}`}</div>
                                                  <div className="text-[10px] text-gray-400">ID: {u.id.slice(0, 8)}...</div>
                                             </td>
                                             <td className="p-3">
                                                  <div>{u.email}</div>
                                                  <div className="text-[10px] text-gray-400">{u.phone || 'No phone'}</div>
                                             </td>
                                             <td className="p-3">
                                                  <span
                                                       className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                                            u.role === 'SUPER_ADMIN'
                                                                 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                                                 : u.role === 'ADMIN'
                                                                 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                                 : u.role === 'STAFF'
                                                                 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                 : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                       }`}
                                                  >
                                                       {u.role}
                                                  </span>
                                             </td>
                                             <td className="p-3 font-semibold">{u._count?.bookings || 0}</td>
                                             <td className="p-3">
                                                  <span className="badge badge-sm badge-success text-white font-bold">{u.status}</span>
                                             </td>
                                             <td className="p-3 text-right space-x-1.5">
                                                  {u.role !== 'SUPER_ADMIN' && (
                                                       <button
                                                            onClick={() => handleDelete(u.id)}
                                                            className="btn btn-xs rounded-none bg-red-600 hover:bg-red-700 text-white"
                                                       >
                                                            <Trash2 className="w-3 h-3" />
                                                       </button>
                                                  )}
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </div>

               {/* Create Staff Modal */}
               {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                         <div className="bg-white dark:bg-[#202020] p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
                              <h3 className="text-lg font-bold font-serif uppercase text-gray-900 dark:text-white">
                                   Create Staff / Admin Account
                              </h3>

                              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                                   <div className="grid grid-cols-2 gap-2">
                                        <div>
                                             <label className="block font-bold uppercase mb-1">First Name *</label>
                                             <input
                                                  type="text"
                                                  required
                                                  value={formData.firstName}
                                                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                             />
                                        </div>
                                        <div>
                                             <label className="block font-bold uppercase mb-1">Last Name *</label>
                                             <input
                                                  type="text"
                                                  required
                                                  value={formData.lastName}
                                                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                  className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Email Address *</label>
                                        <input
                                             type="email"
                                             required
                                             value={formData.email}
                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Password *</label>
                                        <input
                                             type="password"
                                             required
                                             minLength="6"
                                             value={formData.password}
                                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Phone Number</label>
                                        <input
                                             type="text"
                                             value={formData.phone}
                                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Role</label>
                                        <select
                                             value={formData.role}
                                             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020]"
                                        >
                                             <option value="STAFF">Hotel Staff</option>
                                             <option value="ADMIN">Hotel Admin</option>
                                        </select>
                                   </div>

                                   <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                             type="button"
                                             onClick={() => setIsModalOpen(false)}
                                             className="btn btn-sm rounded-none btn-ghost uppercase text-xs"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={isCreating}
                                             className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs"
                                        >
                                             {isCreating ? 'Creating...' : 'Create Account'}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
}
