'use client';

import React, { useState, useEffect } from 'react';
import FormDialog from '@/components/shared/FormDialog';
import MediaUploader from '@/components/shared/MediaUploader';
import { useCreateRoomMutation, useUpdateRoomMutation } from '@/redux/api/roomApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ROOM_TYPES = ['DELUXE', 'SUITE', 'STANDARD', 'EXECUTIVE', 'PRESIDENTIAL', 'FAMILY'];
const ROOM_STATUSES = ['AVAILABLE', 'BOOKED', 'MAINTENANCE', 'CLEANING'];

const DEFAULT_AMENITIES = [
     'High-Speed WiFi',
     'Smart 4K TV',
     'King Size Bed',
     'Private Balcony',
     'Mini Bar',
     'Jacuzzi Bath',
     'Ocean View',
     'Espresso Machine',
     '24/7 Room Service',
     'Air Conditioning',
     'In-Room Safe',
     'Luxury Toiletries',
];

export interface RoomFormModalProps {
     isOpen: boolean;
     onClose: () => void;
     initialData?: any;
}

export default function RoomFormModal({ isOpen, onClose, initialData = null }: RoomFormModalProps) {
     const isEditing = Boolean(initialData);
     const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
     const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

     const [formData, setFormData] = useState({
          title: '',
          roomNumber: '',
          type: 'DELUXE',
          price: '',
          discount: 0,
          capacity: 2,
          bedType: 'King Size Bed',
          size: '450 sq ft',
          floor: 1,
          description: '',
          amenities: [] as string[],
          images: [] as string[],
          status: 'AVAILABLE',
          isFeatured: false,
          isAvailable: true,
     });

     useEffect(() => {
          if (initialData) {
               setFormData({
                    title: initialData.title || '',
                    roomNumber: initialData.roomNumber || '',
                    type: initialData.type || 'DELUXE',
                    price: initialData.price || '',
                    discount: initialData.discount || 0,
                    capacity: initialData.capacity || 2,
                    bedType: initialData.bedType || 'King Size Bed',
                    size: initialData.size || '450 sq ft',
                    floor: initialData.floor || 1,
                    description: initialData.description || '',
                    amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
                    images: Array.isArray(initialData.images) ? initialData.images : initialData.image ? [initialData.image] : [],
                    status: initialData.status || 'AVAILABLE',
                    isFeatured: Boolean(initialData.isFeatured),
                    isAvailable: initialData.isAvailable !== false,
               });
          } else {
               setFormData({
                    title: '',
                    roomNumber: '',
                    type: 'DELUXE',
                    price: '',
                    discount: 0,
                    capacity: 2,
                    bedType: 'King Size Bed',
                    size: '450 sq ft',
                    floor: 1,
                    description: '',
                    amenities: ['High-Speed WiFi', 'Smart 4K TV', '24/7 Room Service'],
                    images: [],
                    status: 'AVAILABLE',
                    isFeatured: false,
                    isAvailable: true,
               });
          }
     }, [initialData, isOpen]);

     const toggleAmenity = (amenity: string) => {
          setFormData((prev) => {
               const exists = prev.amenities.includes(amenity);
               return {
                    ...prev,
                    amenities: exists
                         ? prev.amenities.filter((a) => a !== amenity)
                         : [...prev.amenities, amenity],
               };
          });
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!formData.title || !formData.price) {
               toast.error('Suite title and price are required');
               return;
          }

          const payload = {
               ...formData,
               price: Number(formData.price),
               discount: Number(formData.discount || 0),
               capacity: Number(formData.capacity || 2),
               floor: Number(formData.floor || 1),
               isAvailable: formData.status === 'AVAILABLE',
          };

          try {
               if (isEditing) {
                    await updateRoom({ id: initialData.id || initialData._id, ...payload }).unwrap();
                    toast.success('Suite updated successfully');
               } else {
                    await createRoom(payload).unwrap();
                    toast.success('Suite created successfully');
               }
               onClose();
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to save suite');
          }
     };

     const isLoading = isCreating || isUpdating;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title={isEditing ? 'Edit Suite Specifications' : 'Register New Luxury Suite'}
               description="Configure luxury suite details, pricing, amenities, and high-resolution photography."
               maxWidth="max-w-3xl"
          >
               <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Basic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Suite Title *
                              </label>
                              <input
                                   type="text"
                                   required
                                   value={formData.title}
                                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                   placeholder="e.g. Royal Presidential Oceanfront Suite"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Room Number / Code
                              </label>
                              <input
                                   type="text"
                                   value={formData.roomNumber}
                                   onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                   placeholder="e.g. 504"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Suite Category
                              </label>
                              <select
                                   value={formData.type}
                                   onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              >
                                   {ROOM_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                             {t}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Nightly Rate ($) *
                              </label>
                              <input
                                   type="number"
                                   required
                                   min="0"
                                   value={formData.price}
                                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                   placeholder="e.g. 450"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Discount ($)
                              </label>
                              <input
                                   type="number"
                                   min="0"
                                   value={formData.discount}
                                   onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                                   placeholder="e.g. 50"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Guest Capacity
                              </label>
                              <input
                                   type="number"
                                   min="1"
                                   max="12"
                                   value={formData.capacity}
                                   onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) || 1 })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Bed Configuration
                              </label>
                              <input
                                   type="text"
                                   value={formData.bedType}
                                   onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                                   placeholder="e.g. 1 King or 2 Queen Beds"
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Room Status
                              </label>
                              <select
                                   value={formData.status}
                                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                   className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              >
                                   {ROOM_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                             {s}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="flex items-center gap-6 pt-4">
                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="checkbox checkbox-sm rounded-none checkbox-warning"
                                   />
                                   Featured Luxury Suite
                              </label>
                         </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Description & Experience Notes
                         </label>
                         <textarea
                              rows={3}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Describe the architectural ambiance, luxury furnishings, and exclusive amenities..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                         />
                    </div>

                    {/* Amenities Checklist */}
                    <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                              Included Luxury Amenities
                         </label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {DEFAULT_AMENITIES.map((amenity) => {
                                   const checked = formData.amenities.includes(amenity);
                                   return (
                                        <button
                                             type="button"
                                             key={amenity}
                                             onClick={() => toggleAmenity(amenity)}
                                             className={`px-3 py-1.5 text-[11px] font-semibold text-left border transition cursor-pointer ${
                                                  checked
                                                       ? 'bg-[#b99d75]/15 border-[#b99d75] text-[#b99d75]'
                                                       : 'bg-gray-50 dark:bg-[#202020] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                             }`}
                                        >
                                             {checked ? '✓ ' : '+ '}
                                             {amenity}
                                        </button>
                                   );
                              })}
                         </div>
                    </div>

                    {/* Photos */}
                    <MediaUploader
                         value={formData.images}
                         onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                         multiple={true}
                         maxFiles={6}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <button
                              type="button"
                              onClick={onClose}
                              disabled={isLoading}
                              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#b99d75] hover:bg-[#a68c65] text-white transition disabled:opacity-50 cursor-pointer shadow-sm"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{isEditing ? 'Update Suite' : 'Create Suite'}</span>
                         </button>
                    </div>
               </form>
          </FormDialog>
     );
}
