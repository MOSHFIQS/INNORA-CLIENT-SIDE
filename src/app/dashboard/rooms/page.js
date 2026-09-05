'use client';

import React, { useState } from 'react';
import {
     useGetRoomsQuery,
     useCreateRoomMutation,
     useUpdateRoomMutation,
     useToggleRoomAvailabilityMutation,
     useDeleteRoomMutation,
} from '@/redux/api/roomApi';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, CheckCircle, XCircle, Star, Search } from 'lucide-react';

export default function RoomsManagementPage() {
     const [search, setSearch] = useState('');
     const [typeFilter, setTypeFilter] = useState('');
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingRoom, setEditingRoom] = useState(null);

     const { data: rooms = [], isLoading } = useGetRoomsQuery({
          search: search || undefined,
          type: typeFilter || undefined,
     });

     const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
     const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
     const [toggleAvailability] = useToggleRoomAvailabilityMutation();
     const [deleteRoom] = useDeleteRoomMutation();

     const [formData, setFormData] = useState({
          roomId: '',
          roomNumber: '',
          floor: 1,
          title: '',
          shortDescription: '',
          description: '',
          type: 'DELUXE',
          bedType: 'King',
          pricePerNight: 200,
          maxGuests: 2,
          roomSizeSqFt: 350,
          view: 'Ocean',
          mainImage: '',
     });

     const openCreateModal = () => {
          setEditingRoom(null);
          setFormData({
               roomId: `${Math.floor(100 + Math.random() * 900)}`,
               roomNumber: `${Math.floor(100 + Math.random() * 900)}`,
               floor: 1,
               title: '',
               shortDescription: '',
               description: '',
               type: 'DELUXE',
               bedType: 'King',
               pricePerNight: 200,
               maxGuests: 2,
               roomSizeSqFt: 350,
               view: 'Ocean',
               mainImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
          });
          setIsModalOpen(true);
     };

     const openEditModal = (room) => {
          setEditingRoom(room);
          setFormData({
               roomId: room.roomId,
               roomNumber: room.roomNumber,
               floor: room.floor || 1,
               title: room.title,
               shortDescription: room.shortDescription || '',
               description: room.description || '',
               type: room.type,
               bedType: room.bedType,
               pricePerNight: room.pricePerNight,
               maxGuests: room.maxGuests,
               roomSizeSqFt: room.roomSizeSqFt,
               view: room.view,
               mainImage: room.images?.main || '',
          });
          setIsModalOpen(true);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const payload = {
               roomId: formData.roomId,
               roomNumber: formData.roomNumber,
               floor: Number(formData.floor),
               title: formData.title,
               shortDescription: formData.shortDescription,
               description: formData.description,
               type: formData.type,
               bedType: formData.bedType,
               pricePerNight: Number(formData.pricePerNight),
               maxGuests: Number(formData.maxGuests),
               roomSizeSqFt: Number(formData.roomSizeSqFt),
               view: formData.view,
               images: {
                    main: formData.mainImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                    gallery: [],
               },
          };

          try {
               if (editingRoom) {
                    await updateRoom({ id: editingRoom.id || editingRoom._id, ...payload }).unwrap();
                    toast.success('Room updated successfully');
               } else {
                    await createRoom(payload).unwrap();
                    toast.success('New room created successfully');
               }
               setIsModalOpen(false);
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to save room details');
          }
     };

     const handleToggle = async (room) => {
          try {
               await toggleAvailability(room.id || room._id).unwrap();
               toast.success(`Room #${room.roomNumber} availability toggled`);
          } catch (err) {
               toast.error('Failed to toggle status');
          }
     };

     const handleDelete = async (room) => {
          if (!confirm(`Are you sure you want to delete Room #${room.roomNumber} (${room.title})?`)) return;
          try {
               await deleteRoom(room.id || room._id).unwrap();
               toast.success('Room deleted successfully');
          } catch (err) {
               toast.error('Failed to delete room');
          }
     };

     if (isLoading) return <Loading />;

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                         <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              Rooms & Suites Inventory
                         </h1>
                         <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                              Manage Hotel Inventory, Availability, and Nightly Pricing
                         </p>
                    </div>

                    <button
                         onClick={openCreateModal}
                         className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                         <Plus className="w-4 h-4" />
                         <span>Add New Suite</span>
                    </button>
               </div>

               {/* Filter bar */}
               <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#202020] p-4 border border-gray-200 dark:border-gray-800">
                    <div className="relative flex-1 min-w-[200px]">
                         <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                         <input
                              type="text"
                              placeholder="Search rooms..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                         />
                    </div>
                    <select
                         value={typeFilter}
                         onChange={(e) => setTypeFilter(e.target.value)}
                         className="py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white focus:outline-none focus:border-[#b99d75]"
                    >
                         <option value="">All Types</option>
                         <option value="DELUXE">Deluxe</option>
                         <option value="PRESIDENTIAL">Presidential</option>
                         <option value="SUITE">Suite</option>
                         <option value="EXECUTIVE">Executive</option>
                         <option value="FAMILY">Family</option>
                         <option value="STANDARD">Standard</option>
                    </select>
               </div>

               {/* Table */}
               <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-[11px] text-gray-500">
                                   <tr>
                                        <th className="p-3">Room #</th>
                                        <th className="p-3">Title & Type</th>
                                        <th className="p-3">Bed & Guests</th>
                                        <th className="p-3">Rate/Night</th>
                                        <th className="p-3">Rating</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                   {rooms.map((room) => (
                                        <tr key={room.id || room._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                             <td className="p-3 font-bold text-[#b99d75]">{room.roomNumber}</td>
                                             <td className="p-3">
                                                  <div className="font-bold text-gray-900 dark:text-white">{room.title}</div>
                                                  <div className="text-[10px] text-gray-400">{room.type} • Floor {room.floor}</div>
                                             </td>
                                             <td className="p-3">
                                                  {room.bedType} • Max {room.maxGuests}
                                             </td>
                                             <td className="p-3 font-bold text-gray-900 dark:text-white">
                                                  ${room.pricePerNight}
                                             </td>
                                             <td className="p-3">
                                                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                       <Star className="w-3.5 h-3.5 fill-current" /> {room.rating}
                                                  </div>
                                             </td>
                                             <td className="p-3">
                                                  <button
                                                       onClick={() => handleToggle(room)}
                                                       className={`badge badge-sm font-bold uppercase cursor-pointer ${
                                                            room.isAvailable ? 'badge-success text-white' : 'badge-error text-white'
                                                       }`}
                                                  >
                                                       {room.isAvailable ? 'Available' : 'Occupied / Maint'}
                                                  </button>
                                             </td>
                                             <td className="p-3 text-right space-x-2">
                                                  <button
                                                       onClick={() => openEditModal(room)}
                                                       className="btn btn-xs rounded-none bg-sky-600 hover:bg-sky-700 text-white"
                                                  >
                                                       <Edit className="w-3 h-3" />
                                                  </button>
                                                  <button
                                                       onClick={() => handleDelete(room)}
                                                       className="btn btn-xs rounded-none bg-red-600 hover:bg-red-700 text-white"
                                                  >
                                                       <Trash2 className="w-3 h-3" />
                                                  </button>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </div>

               {/* Add / Edit Room Modal */}
               {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                         <div className="bg-white dark:bg-[#202020] p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4 my-8">
                              <h3 className="text-lg font-bold font-serif uppercase text-gray-900 dark:text-white">
                                   {editingRoom ? 'Edit Room Details' : 'Add New Luxury Suite'}
                              </h3>

                              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                   <div>
                                        <label className="block font-bold uppercase mb-1">Room ID *</label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.roomId}
                                             onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>
                                   <div>
                                        <label className="block font-bold uppercase mb-1">Room Number *</label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.roomNumber}
                                             onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <label className="block font-bold uppercase mb-1">Suite Title *</label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.title}
                                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Room Type</label>
                                        <select
                                             value={formData.type}
                                             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020]"
                                        >
                                             <option value="DELUXE">Deluxe</option>
                                             <option value="PRESIDENTIAL">Presidential</option>
                                             <option value="SUITE">Suite</option>
                                             <option value="EXECUTIVE">Executive</option>
                                             <option value="FAMILY">Family</option>
                                             <option value="STANDARD">Standard</option>
                                        </select>
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Bed Type</label>
                                        <input
                                             type="text"
                                             value={formData.bedType}
                                             onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Price Per Night ($) *</label>
                                        <input
                                             type="number"
                                             required
                                             min="1"
                                             value={formData.pricePerNight}
                                             onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Max Guests</label>
                                        <input
                                             type="number"
                                             min="1"
                                             value={formData.maxGuests}
                                             onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">Floor</label>
                                        <input
                                             type="number"
                                             min="1"
                                             value={formData.floor}
                                             onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block font-bold uppercase mb-1">View</label>
                                        <input
                                             type="text"
                                             value={formData.view}
                                             onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <label className="block font-bold uppercase mb-1">Main Image URL</label>
                                        <input
                                             type="url"
                                             value={formData.mainImage}
                                             onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <label className="block font-bold uppercase mb-1">Short Description</label>
                                        <input
                                             type="text"
                                             value={formData.shortDescription}
                                             onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent"
                                        />
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <label className="block font-bold uppercase mb-1">Full Description</label>
                                        <textarea
                                             rows="3"
                                             value={formData.description}
                                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                             className="w-full p-2.5 border border-gray-300 dark:border-gray-700 bg-transparent resize-none"
                                        ></textarea>
                                   </div>

                                   <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                             type="button"
                                             onClick={() => setIsModalOpen(false)}
                                             className="btn btn-sm rounded-none btn-ghost uppercase text-xs"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={isCreating || isUpdating}
                                             className="btn btn-sm rounded-none bg-[#b99d75] hover:bg-[#a68c65] text-white uppercase text-xs"
                                        >
                                             {isCreating || isUpdating ? 'Saving...' : 'Save Room'}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
}
