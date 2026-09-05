'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
     // Booking Statuses
     CONFIRMED: { label: 'Confirmed', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     CHECKED_IN: { label: 'Checked In', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
     CHECKED_OUT: { label: 'Checked Out', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
     COMPLETED: { label: 'Completed', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
     CANCELLED: { label: 'Cancelled', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
     PENDING: { label: 'Pending', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },

     // Room Statuses
     AVAILABLE: { label: 'Available', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     BOOKED: { label: 'Booked', className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
     MAINTENANCE: { label: 'Maintenance', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
     CLEANING: { label: 'Cleaning', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },

     // Inquiry Statuses
     CONTACTED: { label: 'Contacted', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
     RESOLVED: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     CLOSED: { label: 'Closed', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },

     // Review Statuses
     APPROVED: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     REJECTED: { label: 'Rejected', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },

     // User Roles
     SUPER_ADMIN: { label: 'Super Admin', className: 'bg-[#b99d75]/20 text-[#b99d75] border-[#b99d75]/40 font-bold' },
     ADMIN: { label: 'Admin', className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
     STAFF: { label: 'Staff', className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
     CUSTOMER: { label: 'Guest', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },

     // User Statuses
     ACTIVE: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     INACTIVE: { label: 'Inactive', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },
     SUSPENDED: { label: 'Suspended', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },

     // Payment Statuses
     PAID: { label: 'Paid', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
     UNPAID: { label: 'Unpaid', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
     REFUNDED: { label: 'Refunded', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
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
          className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
     };

     return (
          <Badge
               variant="outline"
               className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-[10px] font-bold tracking-wider uppercase border',
                    config.className,
                    className
               )}
          >
               <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
               <span>{config.label}</span>
          </Badge>
     );
}
