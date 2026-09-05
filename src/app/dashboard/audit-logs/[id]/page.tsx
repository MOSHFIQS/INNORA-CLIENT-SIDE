'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import { useGetAuditLogByIdQuery } from '@/redux/api/auditLogApi';
import {
     Shield,
     Terminal,
     ArrowLeft,
     Calendar,
     User,
     Globe,
     Activity,
     Loader2,
     Layers,
     Database,
} from 'lucide-react';

export default function AuditLogDetailPage() {
     const params = useParams();
     const logId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

     const { data: logData, isLoading, error } = useGetAuditLogByIdQuery(logId);
     const log = logData?.data || logData;

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#b99d75]" />
               </div>
          );
     }

     if (error || !log) {
          return (
               <div className="space-y-6">
                    <PageHeader
                         title="Audit Record Not Found"
                         breadcrumbs={[
                              { label: 'Dashboard', href: '/dashboard' },
                              { label: 'Audit Logs', href: '/dashboard/audit-logs' },
                              { label: 'Detail' },
                         ]}
                    />
                    <div className="bg-white dark:bg-[#1a1a1a] p-8 border border-gray-200 dark:border-gray-800 text-center space-y-4">
                         <p className="text-gray-500 text-xs">The requested security audit log could not be found.</p>
                         <Link
                              href="/dashboard/audit-logs"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#b99d75] text-white text-xs font-bold uppercase tracking-wider"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back to Audit Logs</span>
                         </Link>
                    </div>
               </div>
          );
     }

     return (
          <div className="space-y-6 max-w-5xl mx-auto">
               <PageHeader
                    title="Security Audit Inspection"
                    description={`Event Record: ${log.action} — Security ID: ${log.id || log._id}`}
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Audit Logs', href: '/dashboard/audit-logs' },
                         { label: `Log #${(log.id || log._id).toString().slice(-6)}` },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/audit-logs"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                         </Link>
                    }
               />

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Event Metadata & Payload JSON */}
                    <div className="lg:col-span-2 space-y-6">
                         {/* Event Header Card */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                                   <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                             <Shield className="w-5 h-5 text-[#b99d75]" />
                                        </div>
                                        <div>
                                             <span className="text-[10px] font-bold uppercase tracking-widest text-[#b99d75] block">
                                                  Security Action
                                             </span>
                                             <h2 className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                                                  {log.action}
                                             </h2>
                                        </div>
                                   </div>
                                   <span className="px-3 py-1 bg-[#b99d75]/10 text-[#b99d75] border border-[#b99d75]/20 text-xs font-mono font-bold">
                                        {log.entityType || 'SYSTEM'}
                                   </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-xs">
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Timestamp
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5">
                                             <Calendar className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                                        </span>
                                   </div>
                                   <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                             Target Entity ID
                                        </span>
                                        <span className="font-mono text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mt-0.5 truncate">
                                             <Database className="w-3.5 h-3.5 text-[#b99d75]" />
                                             {log.entityId || 'N/A'}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* Payload Inspector Card */}
                         <div className="bg-[#1e1e1e] border border-gray-800 p-6 md:p-8 space-y-4 shadow-md text-white font-mono">
                              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                                   <div className="flex items-center gap-2 text-xs text-amber-400">
                                        <Terminal className="w-4 h-4" />
                                        <span className="font-bold tracking-wider uppercase">Event Payload Inspection</span>
                                   </div>
                                   <span className="text-[10px] text-gray-400">JSON Format</span>
                              </div>

                              <pre className="text-xs text-emerald-400 overflow-x-auto p-4 bg-black/40 border border-gray-800 leading-relaxed max-h-[400px]">
                                   {log.details || log.metadata || log.payload
                                        ? JSON.stringify(log.details || log.metadata || log.payload, null, 2)
                                        : JSON.stringify({ event: log.action, status: 'SUCCESS', target: log.entityType }, null, 2)}
                              </pre>
                         </div>
                    </div>

                    {/* Right Column: Actor & Network Telemetry */}
                    <div className="space-y-6">
                         {/* Actor Profile */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <User className="w-4 h-4 text-[#b99d75]" />
                                   <span>Actor Profile</span>
                              </h3>

                              <div className="space-y-3 text-xs">
                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">Full Name</span>
                                        <strong className="text-gray-900 dark:text-white">
                                             {log.user?.fullName || log.userId || 'System Service'}
                                        </strong>
                                   </div>

                                   {log.user?.email && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">Email</span>
                                             <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                                                  {log.user.email}
                                             </span>
                                        </div>
                                   )}

                                   {log.user?.role && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">Assigned Role</span>
                                             <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase text-[#b99d75]">
                                                  {log.user.role}
                                             </span>
                                        </div>
                                   )}

                                   {log.user?.id && (
                                        <Link
                                             href={`/dashboard/users/${log.user.id}`}
                                             className="inline-block text-[#b99d75] hover:underline font-bold text-[11px] pt-1"
                                        >
                                             View Actor Profile &rarr;
                                        </Link>
                                   )}
                              </div>
                         </div>

                         {/* Network Telemetry */}
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                   <Globe className="w-4 h-4 text-[#b99d75]" />
                                   <span>Network Telemetry</span>
                              </h3>

                              <div className="space-y-3 text-xs">
                                   <div>
                                        <span className="text-gray-400 text-[10px] uppercase block">IP Address</span>
                                        <span className="font-mono text-gray-900 dark:text-white font-bold">
                                             {log.ipAddress || '127.0.0.1'}
                                        </span>
                                   </div>

                                   {log.userAgent && (
                                        <div>
                                             <span className="text-gray-400 text-[10px] uppercase block">User Agent</span>
                                             <span className="text-gray-500 font-mono text-[10px] break-all">
                                                  {log.userAgent}
                                             </span>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
