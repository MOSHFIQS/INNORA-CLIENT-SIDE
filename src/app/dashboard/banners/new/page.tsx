'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import MediaUploader from '@/components/shared/MediaUploader';
import { useCreateBannerMutation } from '@/redux/api/settingApi';
import { useRouter } from 'next/navigation';
import {
     Image as ImageIcon,
     Sparkles,
     ArrowLeft,
     Save,
     Loader2,
     Sliders,
     ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateBannerPage() {
     const router = useRouter();
     const [createBanner, { isLoading }] = useCreateBannerMutation();

     const [formData, setFormData] = useState({
          title: '',
          subtitle: '',
          description: '',
          badgeText: 'Curated Luxury Collection',
          buttonText: 'Reserve Your Experience',
          buttonLink: '/rooms',
          secondaryButtonText: 'Explore Suites',
          secondaryButtonLink: '/rooms',
          image: '',
          order: 1,
          isActive: true,
     });

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!formData.title.trim()) {
               toast.error('Slide headline is required');
               return;
          }

          if (!formData.image) {
               toast.error('Slide background photograph is required');
               return;
          }

          const payload = {
               title: formData.title.trim(),
               subtitle: formData.subtitle.trim() || null,
               description: formData.description.trim() || null,
               badgeText: formData.badgeText.trim() || null,
               buttonText: formData.buttonText.trim() || 'Explore',
               buttonLink: formData.buttonLink.trim() || '/rooms',
               secondaryButtonText: formData.secondaryButtonText.trim() || null,
               secondaryButtonLink: formData.secondaryButtonLink.trim() || null,
               image: formData.image,
               order: Number(formData.order || 0),
               isActive: formData.isActive,
          };

          try {
               await createBanner(payload).unwrap();
               toast.success('Hero banner slide created successfully!');
               router.push('/dashboard/banners');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to create banner slide');
          }
     };

     return (
          <div className="space-y-6 max-w-4xl">
               <PageHeader
                    title="Add Hero Banner Slide"
                    description="Craft high-impact promotional carousel slides and call-to-actions for the homepage."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Hero Banners', href: '/dashboard/banners' },
                         { label: 'New Slide' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/banners"
                              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back to Carousel</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Slide Content */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Sparkles className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Slide Typography & Headlines
                              </h3>
                         </div>

                         <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                   <div className="space-y-1 sm:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Headline Title *
                                        </label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.title}
                                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                             placeholder="e.g. Architectural Grandeur Meets Oceanfront Serenity"
                                             className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>

                                   <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                             Top Badge Tagline
                                        </label>
                                        <input
                                             type="text"
                                             value={formData.badgeText}
                                             onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                             placeholder="e.g. Signature Penthouse"
                                             className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Secondary Subtitle / Hook
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="e.g. Experience Michelin-starred culinary artistry and private suites."
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Interactive Call to Actions */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <ExternalLink className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Buttons & Display Order
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Primary Button Text
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
                                        Primary Button Link
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Display Order
                                   </label>
                                   <input
                                        type="number"
                                        min="0"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="flex items-center gap-2 pt-6">
                                   <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                             type="checkbox"
                                             checked={formData.isActive}
                                             onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                             className="w-4 h-4 text-[#b99d75] rounded-none focus:ring-0"
                                        />
                                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Active / Live</span>
                                   </label>
                              </div>
                         </div>
                    </div>

                    {/* Background Visual Asset */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <MediaUploader
                              value={formData.image}
                              onChange={(img) => setFormData({ ...formData, image: img })}
                              multiple={false}
                              label="Slide Panoramic Cover Photograph *"
                              hint="High resolution panoramic photo (1920x1080 recommended)"
                         />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                         <Link
                              href="/dashboard/banners"
                              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              Cancel
                         </Link>

                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-8 py-3 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-md font-serif"
                         >
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Save Slide</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
