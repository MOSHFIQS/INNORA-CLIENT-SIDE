'use client';

import React from 'react';
import FormDialog from './FormDialog';
import StatusBadge from './StatusBadge';
import {
     Calendar,
     BedDouble,
     User,
     Mail,
     Phone,
     DollarSign,
     CreditCard,
     Clock,
     Shield,
     FileText,
     CheckCircle,
     MapPin,
     Sparkles,
} from 'lucide-react';

export interface BookingDetailModalProps {
     isOpen: boolean;
     onClose: () => void;
     booking?: any;
}

export function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
     if (!booking) return null;

     const room = booking.room || {};
     const guestsCount = booking.guests || booking.guestCount || 1;
     const price = booking.totalAmount || booking.price || room.price || 0;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Reservation Dossier"
               description={`Booking Reference: #${booking.bookingNumber || booking.id?.slice(-8)}`}
               maxWidth="max-w-2xl"
          >
               <div className="space-y-6 pt-1">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#b99d75]/10 border border-[#b99d75]/30">
                         <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                   <StatusBadge status={booking.status} />
                                   <StatusBadge status={booking.paymentStatus || 'PAID'} />
                              </div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">
                                   Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                              </p>
                         </div>
                         <div className="text-right">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                                   Total Investment
                              </span>
                              <span className="text-2xl font-black text-[#b99d75]">
                                   ${Number(price).toLocaleString()}
                              </span>
                         </div>
                    </div>

                    {/* Suite Information */}
                    <div className="border border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-[#202020] space-y-3">
                         <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                              <BedDouble className="w-4 h-4 text-[#b99d75]" /> Suite Details
                         </h4>
                         <div className="flex flex-col sm:flex-row gap-4 items-start">
                              {room.images?.[0] && (
                                   <img
                                        src={room.images[0]}
                                        alt={room.title || 'Suite'}
                                        className="w-full sm:w-28 h-20 object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                                   />
                              )}
                              <div className="space-y-1 flex-1">
                                   <h5 className="text-sm font-bold text-gray-900 dark:text-white font-serif">
                                        {booking.title || room.title || 'Luxury Suite'}
                                   </h5>
                                   <p className="text-xs text-gray-500">
                                        Suite #{room.roomNumber || 'N/A'} • Type: {room.type || 'DELUXE'} • Floor: {room.floor || 1}
                                   </p>
                                   <p className="text-xs text-gray-500">
                                        Capacity: {room.capacity || guestsCount} Guests • Bed: {room.bedType || 'King Bed'}
                                   </p>
                              </div>
                         </div>
                    </div>

                    {/* Stay & Guest Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="border border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-[#202020] space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                   <Calendar className="w-4 h-4 text-[#b99d75]" /> Stay Timeline
                              </h4>
                              <div className="space-y-1 text-xs">
                                   <p>
                                        <span className="text-gray-500">Scheduled Date:</span>{' '}
                                        <strong className="text-gray-900 dark:text-white">{booking.date || 'Standard Stay'}</strong>
                                   </p>
                                   {booking.checkInDate && (
                                        <p>
                                             <span className="text-gray-500">Check-in:</span>{' '}
                                             <strong className="text-gray-900 dark:text-white">
                                                  {new Date(booking.checkInDate).toLocaleDateString()}
                                             </strong>
                                        </p>
                                   )}
                                   {booking.checkOutDate && (
                                        <p>
                                             <span className="text-gray-500">Check-out:</span>{' '}
                                             <strong className="text-gray-900 dark:text-white">
                                                  {new Date(booking.checkOutDate).toLocaleDateString()}
                                             </strong>
                                        </p>
                                   )}
                              </div>
                         </div>

                         <div className="border border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-[#202020] space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                   <User className="w-4 h-4 text-[#b99d75]" /> Primary Guest
                              </h4>
                              <div className="space-y-1 text-xs">
                                   <p>
                                        <span className="text-gray-500">Name:</span>{' '}
                                        <strong className="text-gray-900 dark:text-white">{booking.name || booking.user?.fullName || 'Guest'}</strong>
                                   </p>
                                   <p>
                                        <span className="text-gray-500">Email:</span>{' '}
                                        <strong className="text-gray-900 dark:text-white">{booking.email || booking.user?.email || 'N/A'}</strong>
                                   </p>
                                   <p>
                                        <span className="text-gray-500">Phone:</span>{' '}
                                        <strong className="text-gray-900 dark:text-white">{booking.phone || booking.user?.phone || 'N/A'}</strong>
                                   </p>
                              </div>
                         </div>
                    </div>

                    {booking.specialRequests && (
                         <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-xs">
                              <strong className="text-amber-700 dark:text-amber-400 block mb-1">Special Guest Instructions:</strong>
                              <p className="text-gray-700 dark:text-gray-300">{booking.specialRequests}</p>
                         </div>
                    )}
               </div>
          </FormDialog>
     );
}

export interface InquiryDetailModalProps {
     isOpen: boolean;
     onClose: () => void;
     inquiry?: any;
}

export function InquiryDetailModal({ isOpen, onClose, inquiry }: InquiryDetailModalProps) {
     if (!inquiry) return null;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Guest Inquiry Details"
               description={`Received: ${new Date(inquiry.createdAt).toLocaleString()}`}
               maxWidth="max-w-lg"
          >
               <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                         <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{inquiry.name}</h4>
                              <p className="text-xs text-gray-500">{inquiry.email} {inquiry.phone ? `• ${inquiry.phone}` : ''}</p>
                         </div>
                         <StatusBadge status={inquiry.status} />
                    </div>

                    <div className="space-y-1.5">
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Subject</span>
                         <p className="text-xs font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2.5 border border-gray-200 dark:border-gray-700">
                              {inquiry.subject || 'General Inquiry'}
                         </p>
                    </div>

                    <div className="space-y-1.5">
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Message</span>
                         <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap leading-relaxed">
                              {inquiry.message}
                         </div>
                    </div>

                    {inquiry.adminNotes && (
                         <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-[#b99d75] uppercase tracking-wider block">Staff Notes / Response</span>
                              <div className="text-xs text-gray-700 dark:text-gray-300 bg-[#b99d75]/10 p-3 border border-[#b99d75]/30">
                                   {inquiry.adminNotes}
                              </div>
                         </div>
                    )}
               </div>
          </FormDialog>
     );
}

export interface AuditLogDetailModalProps {
     isOpen: boolean;
     onClose: () => void;
     log?: any;
}

export function AuditLogDetailModal({ isOpen, onClose, log }: AuditLogDetailModalProps) {
     if (!log) return null;

     return (
          <FormDialog
               isOpen={isOpen}
               onClose={onClose}
               title="Audit Event Detail"
               description={`Event Timestamp: ${new Date(log.createdAt).toLocaleString()}`}
               maxWidth="max-w-xl"
          >
               <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                         <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="text-gray-500 block text-[10px] uppercase font-bold">Action</span>
                              <strong className="text-gray-900 dark:text-white font-mono">{log.action}</strong>
                         </div>
                         <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="text-gray-500 block text-[10px] uppercase font-bold">Actor User</span>
                              <strong className="text-gray-900 dark:text-white truncate block">{log.user?.email || log.userId || 'System'}</strong>
                         </div>
                         <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="text-gray-500 block text-[10px] uppercase font-bold">IP Address</span>
                              <strong className="text-gray-900 dark:text-white font-mono">{log.ipAddress || '127.0.0.1'}</strong>
                         </div>
                         <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="text-gray-500 block text-[10px] uppercase font-bold">Entity Type</span>
                              <strong className="text-gray-900 dark:text-white">{log.entityType || 'General'}</strong>
                         </div>
                    </div>

                    {log.details && (
                         <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Raw Event Payload</span>
                              <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 border border-gray-800">
                                   {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                              </pre>
                         </div>
                    )}
               </div>
          </FormDialog>
     );
}
