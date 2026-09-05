'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import MediaUploader from '@/components/shared/MediaUploader';
import { useCreateRoomMutation } from '@/redux/api/roomApi';
import { useRouter } from 'next/navigation';
import {
     BedDouble,
     DollarSign,
     Sparkles,
     Layers,
     Users,
     Maximize2,
     Tag,
     Check,
     Save,
     ArrowLeft,
     Loader2,
     Plus,
     Trash2,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AVAILABLE_AMENITIES = [
     'Ocean Panoramic Balcony',
     'Private Marble Jacuzzi',
     'Butler & Concierge Service',
     'King Signature Plush Bed',
     'Nespresso Artisan Bar',
     'High-Speed Wi-Fi 6',
     'Complimentary Champagne',
     'Molton Brown Toiletries',
     'Smart Climate Control',
     'Walk-In Rain Shower',
     'Executive Work Desk',
     'Soundproof Floor-to-Ceiling Windows',
     '24/7 Room Dining',
     'Personal Safety Vault',
];

const ROOM_TYPES = [
     { label: 'Deluxe Suite', value: 'DELUXE' },
     { label: 'Executive Suite', value: 'EXECUTIVE' },
     { label: 'Presidential Suite', value: 'PRESIDENTIAL' },
     { label: 'Standard Room', value: 'STANDARD' },
     { label: 'Family Suite', value: 'FAMILY' },
     { label: 'Royal Penthouse', value: 'SUITE' },
];

export default function CreateRoomPage() {
     const router = useRouter();
     const [createRoom, { isLoading }] = useCreateRoomMutation();

     const [formData, setFormData] = useState({
          title: '',
          roomNumber: '',
          floor: 1,
          type: 'DELUXE',
          bedType: 'King Bed',
          pricePerNight: '',
          discount: 0,
          maxGuests: 2,
          roomSizeSqFt: 450,
          view: 'Ocean View',
          status: 'AVAILABLE',
          isAvailable: true,
          isFeatured: false,
          shortDescription: '',
          description: '',
          features: [
               'Ocean Panoramic Balcony',
               'High-Speed Wi-Fi 6',
               'Smart Climate Control',
          ],
          images: [],
     });

     const [customFeature, setCustomFeature] = useState('');

     const handleToggleFeature = (feat) => {
          setFormData((prev) => {
               const exists = prev.features.includes(feat);
               return {
                    ...prev,
                    features: exists
                         ? prev.features.filter((f) => f !== feat)
                         : [...prev.features, feat],
               };
          });
     };

     const handleAddCustomFeature = () => {
          if (!customFeature.trim()) return;
          if (!formData.features.includes(customFeature.trim())) {
               setFormData((prev) => ({
                    ...prev,
                    features: [...prev.features, customFeature.trim()],
               }));
          }
          setCustomFeature('');
     };

     const handleRemoveFeature = (feat) => {
          setFormData((prev) => ({
               ...prev,
               features: prev.features.filter((f) => f !== feat),
          }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!formData.title.trim()) {
               toast.error('Suite title is required');
               return;
          }

          if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
               toast.error('Please specify a valid nightly rate');
               return;
          }

          const mainImage = formData.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
          const gallery = formData.images.slice(1);

          const payload = {
               title: formData.title.trim(),
               roomNumber: formData.roomNumber.trim() || String(Math.floor(100 + Math.random() * 900)),
               floor: Number(formData.floor || 1),
               type: formData.type,
               bedType: formData.bedType,
               pricePerNight: Number(formData.pricePerNight),
               discount: Number(formData.discount || 0),
               maxGuests: Number(formData.maxGuests || 2),
               roomSizeSqFt: Number(formData.roomSizeSqFt || 400),
               view: formData.view,
               status: formData.status,
               isAvailable: formData.isAvailable,
               isFeatured: formData.isFeatured,
               shortDescription: formData.shortDescription || `${formData.type} luxury accommodation with premium amenities.`,
               description: formData.description || formData.shortDescription || 'Experience unmatched hospitality, custom Italian bedding, and world-class luxury.',
               features: formData.features,
               images: {
                    main: mainImage,
                    gallery: gallery,
               },
          };

          try {
               await createRoom(payload).unwrap();
               toast.success('Luxury suite created successfully!');
               router.push('/dashboard/rooms');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to create luxury suite');
          }
     };

     return (
          <div className="space-y-6 max-w-5xl mx-auto">
               <PageHeader
                    title="Register New Luxury Suite"
                    description="Configure suite inventory, pricing structure, bespoke amenities, and high-resolution visual assets."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Suites & Rooms', href: '/dashboard/rooms' },
                         { label: 'New Suite' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/rooms"
                              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Back to Inventory</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Primary Suite Information */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <BedDouble className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Primary Suite Specifications
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1 sm:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Suite Name / Title *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Presidential Panoramic Ocean Suite"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Room / Suite Number *
                                   </label>
                                   <input
                                        type="text"
                                        required
                                        value={formData.roomNumber}
                                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                        placeholder="e.g. 801"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Suite Category
                                   </label>
                                   <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-medium"
                                   >
                                        {ROOM_TYPES.map((t) => (
                                             <option key={t.value} value={t.value}>
                                                  {t.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Floor Level
                                   </label>
                                   <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Bed Arrangement
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.bedType}
                                        onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                                        placeholder="e.g. 1 King Bed, 2 Queen Beds"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Rates & Capacity */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <DollarSign className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Financial Rates & Dimensions
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Nightly Rate (USD) *
                                   </label>
                                   <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
                                        <input
                                             type="number"
                                             required
                                             min="1"
                                             value={formData.pricePerNight}
                                             onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                             placeholder="450"
                                             className="w-full pl-7 pr-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-bold"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Discount / Promo ($)
                                   </label>
                                   <input
                                        type="number"
                                        min="0"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Max Guests
                                   </label>
                                   <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.maxGuests}
                                        onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Size (Sq. Ft.)
                                   </label>
                                   <input
                                        type="number"
                                        min="100"
                                        value={formData.roomSizeSqFt}
                                        onChange={(e) => setFormData({ ...formData, roomSizeSqFt: Number(e.target.value) || 0 })}
                                        placeholder="500"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none font-mono"
                                   />
                              </div>

                              <div className="space-y-1 sm:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Scenic View Type
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.view}
                                        onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                                        placeholder="e.g. Panoramic Pacific Ocean & Sunset Coast"
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Initial Status
                                   </label>
                                   <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   >
                                        <option value="AVAILABLE">AVAILABLE</option>
                                        <option value="BOOKED">BOOKED</option>
                                        <option value="MAINTENANCE">MAINTENANCE</option>
                                        <option value="CLEANING">CLEANING</option>
                                   </select>
                              </div>

                              <div className="flex items-center gap-6 pt-5">
                                   <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                             type="checkbox"
                                             checked={formData.isAvailable}
                                             onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                             className="w-4 h-4 text-[#b99d75] rounded-none focus:ring-0"
                                        />
                                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Live Booking</span>
                                   </label>

                                   <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                             type="checkbox"
                                             checked={formData.isFeatured}
                                             onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                             className="w-4 h-4 text-[#b99d75] rounded-none focus:ring-0"
                                        />
                                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Featured</span>
                                   </label>
                              </div>
                         </div>
                    </div>

                    {/* Suite Visual Media */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Sparkles className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Suite Photography & Showcase Images
                              </h3>
                         </div>

                         <MediaUploader
                              value={formData.images}
                              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                              multiple={true}
                              label="Suite Visual Gallery"
                              hint="The first image will be set as the main cover photo for the showcase."
                         />
                    </div>

                    {/* Amenities & Luxury Inclusions */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Tag className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Amenities & Bespoke Features
                              </h3>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {AVAILABLE_AMENITIES.map((amenity) => {
                                   const isSelected = formData.features.includes(amenity);
                                   return (
                                        <button
                                             key={amenity}
                                             type="button"
                                             onClick={() => handleToggleFeature(amenity)}
                                             className={`px-3 py-2 text-left text-xs font-semibold flex items-center justify-between border transition cursor-pointer ${
                                                  isSelected
                                                       ? 'bg-[#b99d75]/15 border-[#b99d75] text-[#b99d75] font-bold'
                                                       : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                             }`}
                                        >
                                             <span>{amenity}</span>
                                             {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#b99d75]" />}
                                        </button>
                                   );
                              })}
                         </div>

                         {/* Custom Feature Add */}
                         <div className="pt-2 flex items-center gap-2">
                              <input
                                   type="text"
                                   value={customFeature}
                                   onChange={(e) => setCustomFeature(e.target.value)}
                                   placeholder="Add custom signature amenity..."
                                   className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                              <button
                                   type="button"
                                   onClick={handleAddCustomFeature}
                                   className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                              >
                                   <Plus className="w-3.5 h-3.5" />
                                   <span>Add</span>
                              </button>
                         </div>

                         {/* Selected Features Chips */}
                         <div className="flex flex-wrap gap-2 pt-2">
                              {formData.features.map((f) => (
                                   <span
                                        key={f}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#b99d75]/10 text-[#b99d75] border border-[#b99d75]/30 text-[11px] font-bold uppercase"
                                   >
                                        <span>{f}</span>
                                        <button
                                             type="button"
                                             onClick={() => handleRemoveFeature(f)}
                                             className="text-[#b99d75] hover:text-rose-500"
                                        >
                                             <Trash2 className="w-3 h-3" />
                                        </button>
                                   </span>
                              ))}
                         </div>
                    </div>

                    {/* Suite Copy & Description */}
                    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                         <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <Layers className="w-4 h-4 text-[#b99d75]" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                   Editorial Narrative & Suite Description
                              </h3>
                         </div>

                         <div className="space-y-4">
                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Short Summary (Card View)
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        placeholder="e.g. Expansive oceanfront retreat with private wraparound veranda."
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>

                              <div className="space-y-1">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Detailed Narrative & Story
                                   </label>
                                   <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the architectural luxury, custom furnishings, ambient lighting, and sensory atmosphere of the suite..."
                                        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                         <Link
                              href="/dashboard/rooms"
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
                              <span>Save & Register Suite</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
