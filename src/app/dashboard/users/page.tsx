'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import { useGetUsersQuery, useDeleteUserMutation } from '@/redux/api/userApi';
import { Users, PlusCircle, Edit3, Trash2, ShieldCheck, Mail, Phone, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UsersManagementPage() {
     const { user: currentUser, isSuperAdmin, isAdmin } = useAuth();
     const canCreate = isSuperAdmin || isAdmin;
     const canDelete = isSuperAdmin;

     const [search, setSearch] = useState('');
     const [roleFilter, setRoleFilter] = useState('ALL');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const [deletingUser, setDeletingUser] = useState(null);

     const { data: usersData, isLoading, error } = useGetUsersQuery();
     const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

     const filteredUsers = useMemo(() => {
          const rawUsers = Array.isArray(usersData) ? usersData : usersData?.data || [];
          return rawUsers.filter((u) => {
               const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
               const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
               const term = search.toLowerCase().trim();
               const name = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim();
               const matchesSearch =
                    !term ||
                    name.toLowerCase().includes(term) ||
                    u.email?.toLowerCase().includes(term) ||
                    u.phone?.toLowerCase().includes(term);

               return matchesRole && matchesStatus && matchesSearch;
          }).sort((a, b) => {
               let valA = a[sortKey];
               let valB = b[sortKey];
               if (sortKey === 'createdAt') {
                    valA = new Date(a.createdAt || 0).getTime();
                    valB = new Date(b.createdAt || 0).getTime();
               }
               if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
               if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
               return 0;
          });
     }, [usersData, roleFilter, statusFilter, search, sortKey, sortDirection]);

     const handleConfirmDelete = async () => {
          if (!deletingUser) return;
          try {
               await deleteUser(deletingUser.id || deletingUser._id).unwrap();
               toast.success('User account deleted');
               setDeletingUser(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete user');
          }
     };

     const columns = [
          {
               key: 'fullName',
               label: 'User Profile',
               sortable: true,
               render: (u) => {
                    const name = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User';
                    const initial = name[0]?.toUpperCase() || 'U';
                    const targetId = u.id || u._id;
                    return (
                         <Link href={`/dashboard/users/${targetId}`} className="flex items-center gap-3 group">
                              {u.avatarUrl || u.avatar ? (
                                   <img src={u.avatarUrl || u.avatar} alt={name} className="w-8 h-8 rounded-none object-cover shrink-0 border border-gray-200 dark:border-gray-700" />
                              ) : (
                                   <div className="w-8 h-8 rounded-none bg-[#b99d75]/20 text-[#b99d75] border border-[#b99d75]/40 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                        {initial}
                                   </div>
                              )}
                              <div>
                                   <strong className="text-gray-900 dark:text-white block text-xs group-hover:text-[#b99d75] transition">
                                        {name}
                                   </strong>
                                   <span className="text-[10px] text-gray-400">
                                        ID: {u.id?.slice(0, 8)}
                                   </span>
                              </div>
                         </Link>
                    );
               },
          },
          {
               key: 'email',
               label: 'Contact Coordinates',
               sortable: true,
               render: (u) => (
                    <div>
                         <span className="text-gray-900 dark:text-white text-xs block">{u.email}</span>
                         {u.phone && <span className="text-[10px] text-gray-400">{u.phone}</span>}
                    </div>
               ),
          },
          {
               key: 'role',
               label: 'Assigned Role',
               sortable: true,
               render: (u) => <StatusBadge status={u.role} />,
          },
          {
               key: 'status',
               label: 'Status',
               sortable: true,
               render: (u) => <StatusBadge status={u.status || 'ACTIVE'} />,
          },
          {
               key: 'createdAt',
               label: 'Member Since',
               sortable: true,
               render: (u) => (
                    <span className="text-gray-500 text-[11px] whitespace-nowrap font-mono">
                         {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
               ),
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (u) => {
                    const targetId = u.id || u._id;
                    return (
                         <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              <Link
                                   href={`/dashboard/users/${targetId}`}
                                   className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                   title="View User Dossier"
                              >
                                   <Eye className="w-3.5 h-3.5" />
                              </Link>

                              {canCreate && (
                                   <Link
                                        href={`/dashboard/users/${targetId}/edit`}
                                        className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        title="Edit User & Permissions"
                                   >
                                        <Edit3 className="w-3.5 h-3.5" />
                                   </Link>
                              )}

                              {canDelete && u.id !== currentUser?.id && u.role !== 'SUPER_ADMIN' && (
                                   <button
                                        type="button"
                                        onClick={() => setDeletingUser(u)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                        title="Delete User"
                                   >
                                        <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                              )}
                         </div>
                    );
               },
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title="User Directory & Roles"
                    description="Supervise hotel accounts, staff credentials, role-based authorization, and guest profiles."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Users & Staff' },
                    ]}
                    actions={
                         canCreate && (
                              <Link
                                   href="/dashboard/users/new"
                                   className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                              >
                                   <PlusCircle className="w-4 h-4" />
                                   <span>Create Staff / User</span>
                              </Link>
                         )
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by name, email, phone..."
                    filters={[
                         {
                              key: 'role',
                              label: 'Role',
                              value: roleFilter,
                              onChange: setRoleFilter,
                              options: [
                                   { label: 'All Roles', value: 'ALL' },
                                   { label: 'Super Admin', value: 'SUPER_ADMIN' },
                                   { label: 'Admin', value: 'ADMIN' },
                                   { label: 'Staff', value: 'STAFF' },
                                   { label: 'Guest (Customer)', value: 'CUSTOMER' },
                              ],
                         },
                         {
                              key: 'status',
                              label: 'Status',
                              value: statusFilter,
                              onChange: setStatusFilter,
                              options: [
                                   { label: 'All Statuses', value: 'ALL' },
                                   { label: 'Active', value: 'ACTIVE' },
                                   { label: 'Inactive', value: 'INACTIVE' },
                                   { label: 'Suspended', value: 'SUSPENDED' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setRoleFilter('ALL');
                         setStatusFilter('ALL');
                    }}
                    totalCount={filteredUsers.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredUsers}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No user accounts matched the filter criteria."
               />

               <DeleteConfirmationDialog
                    isOpen={Boolean(deletingUser)}
                    onClose={() => setDeletingUser(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete User Account"
                    message={`Are you sure you wish to permanently delete user account "${deletingUser?.email}"?`}
                    confirmLabel="Delete Account"
                    isLoading={isDeleting}
               />
          </div>
     );
}
