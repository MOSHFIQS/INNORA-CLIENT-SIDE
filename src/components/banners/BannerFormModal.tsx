'use client';

import React, { useState, useEffect } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import MediaUploader from '@/components/shared/MediaUploader';
import { useCreateBannerMutation, useUpdateBannerMutation } from '@/redux/api/settingApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface BannerFormModalProps {
     isOpen: boolean;
     onClose: () => void;
     initialData?: any;
}

export default function BannerFormModal({ isOpen, onClose, initialData = null }: BannerFormModalProps) {
     const isEditing = Boolean(initialData);
     const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
     const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

     const [formData, setFormData] = useState({
          title: '',
          subtitle: '',
          image: '',
          buttonText: 'Explore Suites',
          buttonLink: '/rooms',
          order: 0,
          isActive: true,
     });

     useEffect(() => {
          if (initialData) {
               setFormData({
                    title: initialData.title || '',
                    subtitle: initialData.subtitle || '',
                    image: initialData.image || '',
                    buttonText: initialData.buttonText || 'Explore Suites',
                    buttonLink: initialData.buttonLink || '/rooms',
                    order: initialData.order || 0,
                    isActive: initialData.isActive !== false,
               });
          } else {
               setFormData({
                    title: '',
                    subtitle: '',
                    image: '',
                    buttonText: 'Explore Suites',
                    buttonLink: '/rooms',
                    order: 0,
                    isActive: true,
               });
          }
     }, [initialData, isOpen]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!formData.title || !formData.image) {
               toast.error('Banner title and image are required');
               return;
          }

          const payload = {
               ...formData,
               order: Number(formData.order || 0),
          };

          try {
               if (isEditing) {
                    await updateBanner({ id: initialData.id || initialData._id, ...payload }).unwrap();
                    toast.success('Hero banner slide updated');
               } else {
                    await createBanner(payload).unwrap();
                    toast.success('Hero banner slide created');
               }
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to save banner slide');
          }
     };

     const isLoading = isCreating || isUpdating;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title={isEditing ? 'Edit Hero Banner Slide' : 'Add Hero Banner Slide'}
               description="Showcase luxury suites and promotional highlights on the homepage."
               maxWidth="max-w-lg"
          >
               <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Headline Title *
                         </label>
                         <input
                              type="text"
                              required
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="e.g. Unrivaled Luxury by the Azure Coast"
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Subtitle / Description
                         </label>
                         <textarea
                              rows={2}
                              value={formData.subtitle}
                              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                              placeholder="e.g. Experience bespoke luxury suites and world-class hospitality."
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>

                    <MediaUploader
                         value={formData.image}
                         onChange={(img) => setFormData({ ...formData, image: img })}
                         multiple={false}
                         label="Banner Background Image *"
                         hint="Recommended 1920x1080 high-res image"
                    />

                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Button CTA Text
                              </label>
                              <input
                                   type="text"
                                   value={formData.buttonText}
                                   onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Button Target Link
                              </label>
                              <input
                                   type="text"
                                   value={formData.buttonLink}
                                   onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center pt-2">
                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Display Order
                              </label>
                              <input
                                   type="number"
                                   min="0"
                                   value={formData.order}
                                   onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 pt-5">
                              <input
                                   type="checkbox"
                                   checked={formData.isActive}
                                   onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                   className="checkbox checkbox-sm rounded-none checkbox-warning"
                              />
                              Active on Live Site
                         </label>
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
                              <span>{isEditing ? 'Save Slide' : 'Create Slide'}</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
