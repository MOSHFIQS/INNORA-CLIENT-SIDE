'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/api/settingApi';
import { Settings, Save, Loader2, Hotel, Phone, Mail, MapPin, Clock, DollarSign, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HotelSettingsPage() {
     const { data: settingsData, isLoading } = useGetSettingsQuery();
     const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

     const [formData, setFormData] = useState({
          hotelName: 'INNORA Luxury Resort & Spa',
          tagline: 'A Sanctuary of Refinement and Timeless Elegance',
          email: 'concierge@innora.com',
          phone: '+1 (800) 555-4666',
          address: '777 Oceanfront Boulevard, Paradise Cove, CA 90265',
          currency: 'USD',
          taxRate: 12,
          checkInTime: '15:00',
          checkOutTime: '11:00',
          heroTitle: 'Where Architectural Grandeur Meets Oceanfront Serenity',
          heroSubtitle: 'Immerse yourself in world-class hospitality, Michelin-starred culinary journeys, and private panoramic suites.',
          facebook: 'https://facebook.com/innorahotel',
          instagram: 'https://instagram.com/innorahotel',
          twitter: 'https://twitter.com/innorahotel',
     });

     useEffect(() => {
          if (settingsData) {
               setFormData((prev) => ({
                    ...prev,
                    ...settingsData,
               }));
          }
     }, [settingsData]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
               await updateSettings({
                    ...formData,
                    taxRate: Number(formData.taxRate || 0),
               }).unwrap();
               toast.success('Hotel site configuration updated');
          } catch (err: any) {
               toast.error(err?.data?.message || 'Failed to update hotel settings');
          }
     };

     return (
          <div className="space-y-6 max-w-5xl">
               <PageHeader
                    title="Hotel Site Configuration"
                    description="Configure property contact information, check-in policies, tax rates, and brand identity."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Hotel Settings' },
                    ]}
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Hotel Info */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Hotel className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Hotel Identity & Contact
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1 sm:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Hotel Property Name *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.hotelName}
                                        onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Contact Email
                                   </label>
                                   <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Telephone
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

                    {/* Operational Policies & Currency */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Clock className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Operational Policies & Rates
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Check-in Time
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.checkInTime}
                                        onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                                        placeholder="15:00"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Check-out Time
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.checkOutTime}
                                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                                        placeholder="11:00"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Currency Code
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        placeholder="USD"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Hospitality Tax (%)
                                   </label>
                                   <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={formData.taxRate}
                                        onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Hero Showcase Texts */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Globe className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Homepage Hero Showcase Copy
                              </h3>
                         </div>

                         <div className="space-y-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Hero Headline Title
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.heroTitle}
                                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Hero Tagline Description
                                   </label>
                                   <textarea
                                        rows={2}
                                        value={formData.heroSubtitle}
                                        onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end">
                         <button
                              type="submit"
                              disabled={isSaving}
                              className="flex items-center gap-2 px-8 py-3 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-md"
                         >
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              <span>Save Hotel Settings</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
