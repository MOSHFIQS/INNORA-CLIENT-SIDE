'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import {
     useGetBannersQuery,
     useUpdateBannerMutation,
     useDeleteBannerMutation,
} from '@/redux/api/settingApi';
import { Image as ImageIcon, PlusCircle, Edit3, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BannersManagementPage() {
     const { isSuperAdmin, isAdmin } = useAuth();
     const canEdit = isSuperAdmin || isAdmin;

     const [deletingBanner, setDeletingBanner] = useState(null);

     const { data: bannersData, isLoading, error } = useGetBannersQuery();
     const [updateBanner] = useUpdateBannerMutation();
     const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

     const banners = Array.isArray(bannersData) ? bannersData : bannersData?.data || [];

     const handleToggleActive = async (banner) => {
          try {
               await updateBanner({
                    id: banner.id || banner._id,
                    isActive: !banner.isActive,
               }).unwrap();
               toast.success(`Slide ${!banner.isActive ? 'activated' : 'deactivated'}`);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to toggle banner status');
          }
     };

     const handleConfirmDelete = async () => {
          if (!deletingBanner) return;
          try {
               await deleteBanner(deletingBanner.id || deletingBanner._id).unwrap();
               toast.success('Banner slide removed');
               setDeletingBanner(null);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to delete banner');
          }
     };

     const columns = [
          {
               key: 'image',
               label: 'Slide Preview',
               render: (b) => (
                    <div className="w-24 h-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                         <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    </div>
               ),
          },
          {
               key: 'title',
               label: 'Headline & Subtitle',
               render: (b) => (
                    <div className="max-w-md">
                         <strong className="text-gray-900 dark:text-white font-serif block text-xs">
                              {b.title}
                         </strong>
                         <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                              {b.subtitle || 'No subtitle provided'}
                         </p>
                    </div>
               ),
          },
          {
               key: 'button',
               label: 'Call To Action',
               render: (b) => (
                    <div className="text-xs">
                         <span className="font-bold text-[#b99d75] block">{b.buttonText || 'Explore'}</span>
                         <span className="text-[10px] text-gray-400 block font-mono">{b.buttonLink || '/rooms'}</span>
                    </div>
               ),
          },
          {
               key: 'order',
               label: 'Order',
               render: (b) => (
                    <span className="font-bold font-mono text-xs text-gray-700 dark:text-gray-300">
                         #{b.order || 0}
                    </span>
               ),
          },
          {
               key: 'isActive',
               label: 'Live Status',
               render: (b) => (
                    <button
                         type="button"
                         onClick={() => handleToggleActive(b)}
                         className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase transition rounded-none cursor-pointer ${
                              b.isActive !== false
                                   ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                   : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-700'
                         }`}
                    >
                         {b.isActive !== false ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                         <span>{b.isActive !== false ? 'Active' : 'Draft'}</span>
                    </button>
               ),
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (b) => (
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                         <Link
                              href={`/dashboard/banners/${b.id || b._id}/edit`}
                              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#b99d75] hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer inline-flex items-center"
                              title="Edit Banner"
                         >
                              <Edit3 className="w-3.5 h-3.5" />
                         </Link>

                         <button
                              type="button"
                              onClick={() => setDeletingBanner(b)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                              title="Delete Banner"
                         >
                              <Trash2 className="w-3.5 h-3.5" />
                         </button>
                    </div>
               ),
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title="Hero Banner Carousel"
                    description="Curate promotional slides, luxury highlights, and call-to-action buttons for the homepage showcase."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Hero Banners' },
                    ]}
                    actions={
                         canEdit && (
                              <Link
                                   href="/dashboard/banners/new"
                                   className="flex items-center gap-2 px-4 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                              >
                                   <PlusCircle className="w-4 h-4" />
                                   <span>Add Slide</span>
                              </Link>
                         )
                    }
               />

               <DataTable
                    columns={columns}
                    data={banners}
                    loading={isLoading}
                    error={error}
                    emptyMessage="No hero banners configured yet."
               />

               {/* Delete Dialog */}
               <DeleteConfirmationDialog
                    isOpen={Boolean(deletingBanner)}
                    onClose={() => setDeletingBanner(null)}
                    onConfirm={handleConfirmDelete}
                    title="Remove Banner Slide"
                    message={`Are you sure you wish to delete slide "${deletingBanner?.title}"?`}
                    confirmLabel="Delete Slide"
                    isLoading={isDeleting}
               />
          </div>
     );
}
