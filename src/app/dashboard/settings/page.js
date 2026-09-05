'use client';

import React, { useState, useEffect } from 'react';
import {
     useGetSettingsQuery,
     useUpdateSettingsMutation,
     useGetBannersQuery,
     useCreateBannerMutation,
     useDeleteBannerMutation,
} from '@/redux/api/settingApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Settings, Image, Plus, Trash2, Save } from 'lucide-react';

export default function SettingsManagementPage() {
     const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
     const { data: banners = [], isLoading: isBannersLoading } = useGetBannersQuery();
     const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();
     const [createBanner, { isLoading: isCreatingBanner }] = useCreateBannerMutation();
     const [deleteBanner] = useDeleteBannerMutation();

     const [siteName, setSiteName] = useState('');
     const [tagline, setTagline] = useState('');
     const [email, setEmail] = useState('');
     const [phone, setPhone] = useState('');
     const [address, setAddress] = useState('');
     const [checkInTime, setCheckInTime] = useState('14:00');
     const [checkOutTime, setCheckOutTime] = useState('11:00');
     const [cancellationPolicy, setCancellationPolicy] = useState('');

     const [newBanner, setNewBanner] = useState({
          title: '',
          subtitle: '',
          description: '',
          badgeText: '',
          image: '',
     });

     useEffect(() => {
          if (settings) {
               setSiteName(settings.siteName || '');
               setTagline(settings.tagline || '');
               setEmail(settings.email || '');
               setPhone(settings.phone || '');
               setAddress(settings.address || '');
               setCheckInTime(settings.checkInTime || '14:00');
               setCheckOutTime(settings.checkOutTime || '11:00');
               setCancellationPolicy(settings.cancellationPolicy || '');
          }
     }, [settings]);

     const handleSaveSettings = async (e) => {
          e.preventDefault();
          try {
               await updateSettings({
                    siteName,
                    tagline,
                    email,
                    phone,
                    address,
                    checkInTime,
                    checkOutTime,
                    cancellationPolicy,
               }).unwrap();
               toast.success('Site settings saved successfully');
          } catch {
               toast.error('Failed to save settings');
          }
     };

     const handleCreateBanner = async (e) => {
          e.preventDefault();
          try {
               await createBanner(newBanner).unwrap();
               toast.success('Hero banner slide created');
               setNewBanner({ title: '', subtitle: '', description: '', badgeText: '', image: '' });
          } catch {
               toast.error('Failed to create banner');
          }
     };

     const handleDeleteBanner = async (id) => {
          try {
               await deleteBanner(id).unwrap();
               toast.success('Banner deleted');
          } catch {
               toast.error('Failed to delete banner');
          }
     };

     if (isSettingsLoading || isBannersLoading) return <Loading />;

     return (
          <div className="space-y-8 max-w-5xl">
               <div>
                    <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                         Hotel Site Settings & Banners
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                         Configure site branding, contact information, check-in rules, and hero slides
                    </p>
               </div>

               {/* Hotel Information Form */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#b99d75] font-serif border-b border-gray-100 dark:border-gray-800 pb-2">
                         General Hotel Information
                    </h2>

                    <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                         <div>
                              <label className="block font-bold uppercase mb-1">Hotel Site Name</label>
                              <input
                                   type="text"
                                   value={siteName}
                                   onChange={(e) => setSiteName(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Brand Tagline</label>
                              <input
                                   type="text"
                                   value={tagline}
                                   onChange={(e) => setTagline(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div>
                              <label className="block font-bold uppercase mb-1">Official Email</label>
                              <input
                                   type="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Front Desk Phone</label>
                              <input
                                   type="text"
                                   value={phone}
                                   onChange={(e) => setPhone(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div className="col-span-1 md:col-span-2">
                              <label className="block font-bold uppercase mb-1">Physical Address</label>
                              <input
                                   type="text"
                                   value={address}
                                   onChange={(e) => setAddress(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div>
                              <label className="block font-bold uppercase mb-1">Check-in Time</label>
                              <input
                                   type="text"
                                   value={checkInTime}
                                   onChange={(e) => setCheckInTime(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <div>
                              <label className="block font-bold uppercase mb-1">Check-out Time</label>
                              <input
                                   type="text"
                                   value={checkOutTime}
                                   onChange={(e) => setCheckOutTime(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>

                         <div className="col-span-1 md:col-span-2">
                              <label className="block font-bold uppercase mb-1">Cancellation Policy</label>
                              <textarea
                                   rows="2"
                                   value={cancellationPolicy}
                                   onChange={(e) => setCancellationPolicy(e.target.value)}
                                   className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent resize-none"
                              ></textarea>
                         </div>

                         <div className="col-span-1 md:col-span-2 flex justify-end">
                              <button
                                   type="submit"
                                   disabled={isUpdatingSettings}
                                   className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1"
                              >
                                   <Save className="w-3.5 h-3.5" />
                                   <span>{isUpdatingSettings ? 'Saving...' : 'Save Settings'}</span>
                              </button>
                         </div>
                    </form>
               </div>

               {/* Banner Slides Section */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#b99d75] font-serif border-b border-gray-100 dark:border-gray-800 pb-2">
                         Homepage Hero Banner Slides
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {banners.map((b) => (
                              <div key={b.id} className="relative border border-gray-200 dark:border-gray-700 overflow-hidden group">
                                   <img src={b.image} alt={b.title} className="w-full h-36 object-cover" />
                                   <div className="p-3 bg-gray-50 dark:bg-gray-800/80 space-y-1">
                                        <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{b.title}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{b.subtitle}</p>
                                   </div>
                                   <button
                                        onClick={() => handleDeleteBanner(b.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white shadow rounded-none"
                                        title="Delete Banner"
                                   >
                                        <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                              </div>
                         ))}
                    </div>

                    {/* Add Banner Form */}
                    <form onSubmit={handleCreateBanner} className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
                         <h3 className="font-bold uppercase tracking-wider text-xs">Add New Banner Slide</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                   type="text"
                                   placeholder="Title *"
                                   required
                                   value={newBanner.title}
                                   onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                   className="p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                              <input
                                   type="text"
                                   placeholder="Subtitle"
                                   value={newBanner.subtitle}
                                   onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                   className="p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                              <input
                                   type="text"
                                   placeholder="Badge Text (e.g. 5-Star Luxury)"
                                   value={newBanner.badgeText}
                                   onChange={(e) => setNewBanner({ ...newBanner, badgeText: e.target.value })}
                                   className="p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                              <input
                                   type="url"
                                   placeholder="Image URL *"
                                   required
                                   value={newBanner.image}
                                   onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                                   className="p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                              />
                         </div>
                         <button
                              type="submit"
                              disabled={isCreatingBanner}
                              className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1"
                         >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isCreatingBanner ? 'Adding...' : 'Add Banner Slide'}</span>
                         </button>
                    </form>
               </div>
          </div>
     );
}
