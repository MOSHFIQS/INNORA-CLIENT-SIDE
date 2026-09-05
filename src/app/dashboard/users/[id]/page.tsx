'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import Loading from '@/app/loading';
import { useGetUserByIdQuery } from '@/redux/api/userApi';
import { useParams } from 'next/navigation';
import {
     User,
     Shield,
     Mail,
     Phone,
     MapPin,
     Calendar,
     ArrowLeft,
     Edit3,
     CheckCircle,
     Clock,
     CalendarCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage() {
     const params = useParams();
     const userId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

     const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: !userId });

     if (isLoading) return <Loading />;

     if (!user) {
          return (
               <div className="p-12 text-center bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 font-semibold">User account not found.</p>
                    <Link href="/dashboard/users" className="text-xs text-[#b99d75] font-bold underline mt-2 block">
                         Return to User Directory
                    </Link>
               </div>
          );
     }

     const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
     const avatar = user.avatarUrl || user.avatar;

     return (
          <div className="space-y-6 max-w-4xl">
               <PageHeader
                    title={`User Dossier: ${name}`}
                    description={`ID: ${user.id} • Registered Member`}
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Users & Staff', href: '/dashboard/users' },
                         { label: name },
                    ]}
                    actions={
                         <div className="flex items-center gap-2">
                              <Link
                                   href="/dashboard/users"
                                   className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                              >
                                   <ArrowLeft className="w-4 h-4" />
                                   <span>Back</span>
                              </Link>

                              <Link
                                   href={`/dashboard/users/${user.id || userId}/edit`}
                                   className="flex items-center gap-1.5 px-4 py-2 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                              >
                                   <Edit3 className="w-4 h-4" />
                                   <span>Edit User</span>
                              </Link>
                         </div>
                    }
               />

               {/* Profile Header Card */}
               <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-[#b99d75]/20 text-[#b99d75] border-2 border-[#b99d75]/40 flex items-center justify-center font-black text-2xl uppercase shrink-0 overflow-hidden">
                         {avatar ? (
                              <img src={avatar} alt={name} className="w-full h-full object-cover" />
                         ) : (
                              name[0] || 'U'
                         )}
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                         <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <h2 className="text-xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   {name}
                              </h2>
                              <StatusBadge status={user.role} />
                              <StatusBadge status={user.status || 'ACTIVE'} />
                         </div>
                         <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                         {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                    </div>
               </div>

               {/* Account Coordinates & Metadata */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Member Since</span>
                         <span className="text-sm font-bold text-gray-900 dark:text-white block font-mono">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                         </span>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Address</span>
                         <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block truncate">
                              {user.address || 'Not specified'}
                         </span>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Last Active</span>
                         <span className="text-xs font-mono text-gray-600 dark:text-gray-400 block">
                              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Recent session active'}
                         </span>
                    </div>
               </div>

               {/* Biography / Internal Notes */}
               {user.bio && (
                    <div className="p-5 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
                         <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Staff Biography & Notes
                         </h3>
                         <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                              &ldquo;{user.bio}&rdquo;
                         </p>
                    </div>
               )}
          </div>
     );
}
