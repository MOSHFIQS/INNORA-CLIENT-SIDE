'use client';

import React from 'react';

const statusConfig = {
     // Booking Statuses
     CONFIRMED: { label: 'Confirmed', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     CHECKED_IN: { label: 'Checked In', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
     CHECKED_OUT: { label: 'Checked Out', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
     COMPLETED: { label: 'Completed', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
     CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
     PENDING: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },

     // Room Statuses
     AVAILABLE: { label: 'Available', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     BOOKED: { label: 'Booked', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
     MAINTENANCE: { label: 'Maintenance', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
     CLEANING: { label: 'Cleaning', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },

     // Inquiry Statuses
     CONTACTED: { label: 'Contacted', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
     RESOLVED: { label: 'Resolved', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     CLOSED: { label: 'Closed', bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },

     // Review Statuses
     APPROVED: { label: 'Approved', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     REJECTED: { label: 'Rejected', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },

     // User Roles
     SUPER_ADMIN: { label: 'Super Admin', bg: 'bg-[#b99d75]/20 text-[#b99d75] border-[#b99d75]/40 font-bold' },
     ADMIN: { label: 'Admin', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
     STAFF: { label: 'Staff', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
     CUSTOMER: { label: 'Guest', bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },

     // User Statuses
     ACTIVE: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     INACTIVE: { label: 'Inactive', bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },
     SUSPENDED: { label: 'Suspended', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },

     // Payment Statuses
     PAID: { label: 'Paid', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     UNPAID: { label: 'Unpaid', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
     REFUNDED: { label: 'Refunded', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
};

export interface StatusBadgeProps {
     status?: string | null;
     className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
     if (!status) return null;
     const normalized = String(status).toUpperCase();
     const config = statusConfig[normalized] || {
          label: status,
          bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
     };

     return (
          <span
               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase ${config.bg} ${className}`}
          >
               <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
               {config.label}
          </span>
     );
}
