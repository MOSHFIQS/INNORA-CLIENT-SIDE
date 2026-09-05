'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import DataTable from '@/components/shared/DataTable';
import { useGetAuditLogsQuery } from '@/redux/api/auditLogApi';
import { Activity, ShieldAlert, Eye, Terminal } from 'lucide-react';

export default function AuditLogsPage() {
     const [search, setSearch] = useState('');
     const [actionFilter, setActionFilter] = useState('ALL');
     const [sortKey, setSortKey] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const { data: logsData, isLoading, error } = useGetAuditLogsQuery();

     const filteredLogs = useMemo(() => {
          const rawLogs = Array.isArray(logsData) ? logsData : logsData?.data || [];
          return rawLogs.filter((log) => {
               const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
               const term = search.toLowerCase().trim();
               const matchesSearch =
                    !term ||
                    log.action?.toLowerCase().includes(term) ||
                    log.user?.email?.toLowerCase().includes(term) ||
                    log.ipAddress?.toLowerCase().includes(term) ||
                    log.entityType?.toLowerCase().includes(term);

               return matchesAction && matchesSearch;
          }).sort((a, b) => {
               let valA = new Date(a.createdAt || 0).getTime();
               let valB = new Date(b.createdAt || 0).getTime();
               if (sortDirection === 'asc') return valA - valB;
               return valB - valA;
          });
     }, [logsData, actionFilter, search, sortDirection]);

     const columns = [
          {
               key: 'action',
               label: 'Event Action',
               sortable: true,
               render: (log) => (
                    <Link
                         href={`/dashboard/audit-logs/${log.id || log._id}`}
                         className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-gray-100 dark:bg-gray-800 text-[#b99d75] border border-gray-200 dark:border-gray-700 hover:border-[#b99d75] transition"
                    >
                         {log.action}
                    </Link>
               ),
          },
          {
               key: 'user',
               label: 'Actor / User',
               render: (log) => (
                    <div>
                         <strong className="text-gray-900 dark:text-white block text-xs">
                              {log.user?.fullName || log.user?.email || log.userId || 'System'}
                         </strong>
                         {log.user?.role && (
                              <span className="text-[10px] text-gray-500 uppercase font-semibold">
                                   {log.user.role}
                              </span>
                         )}
                    </div>
               ),
          },
          {
               key: 'ipAddress',
               label: 'Network IP',
               render: (log) => (
                    <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                         {log.ipAddress || '127.0.0.1'}
                    </span>
               ),
          },
          {
               key: 'entityType',
               label: 'Entity Target',
               render: (log) => (
                    <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                         {log.entityType || 'General'}
                    </span>
               ),
          },
          {
               key: 'createdAt',
               label: 'Timestamp',
               sortable: true,
               render: (log) => (
                    <span className="text-gray-500 text-[11px] whitespace-nowrap">
                         {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                    </span>
               ),
          },
          {
               key: 'actions',
               label: 'Actions',
               headerClassName: 'text-right',
               className: 'text-right',
               render: (log) => (
                    <Link
                         href={`/dashboard/audit-logs/${log.id || log._id}`}
                         className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-[#b99d75] text-gray-700 dark:text-gray-300 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer inline-flex items-center gap-1"
                         title="Inspect Payload"
                    >
                         <Eye className="w-3 h-3" />
                         <span>Inspect</span>
                    </Link>
               ),
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title="Security & System Audit Trail"
                    description="Cryptographically tracked security logs, authentication attempts, reservation state changes, and administrative actions."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Audit Logs' },
                    ]}
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search audit events by action, user, IP address..."
                    filters={[
                         {
                              key: 'action',
                              label: 'Action Type',
                              value: actionFilter,
                              onChange: setActionFilter,
                              options: [
                                   { label: 'All Actions', value: 'ALL' },
                                   { label: 'LOGIN', value: 'LOGIN' },
                                   { label: 'LOGOUT', value: 'LOGOUT' },
                                   { label: 'BOOKING_CREATED', value: 'BOOKING_CREATED' },
                                   { label: 'BOOKING_CANCELLED', value: 'BOOKING_CANCELLED' },
                                   { label: 'ROOM_CREATED', value: 'ROOM_CREATED' },
                                   { label: 'ADMIN_ACTION', value: 'ADMIN_ACTION' },
                              ],
                         },
                    ]}
                    onReset={() => {
                         setSearch('');
                         setActionFilter('ALL');
                    }}
                    totalCount={filteredLogs.length}
               />

               <DataTable
                    columns={columns}
                    data={filteredLogs}
                    loading={isLoading}
                    error={error}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, dir) => {
                         setSortKey(key);
                         setSortDirection(dir);
                    }}
                    emptyMessage="No audit logs recorded for the selected filter."
               />
          </div>
     );
}
