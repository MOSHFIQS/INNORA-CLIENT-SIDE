'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Inbox } from 'lucide-react';

export interface Column<T = any> {
     key: string;
     label: string;
     sortable?: boolean;
     headerClassName?: string;
     className?: string;
     render?: (item: T, index: number) => React.ReactNode;
     [key: string]: any;
}

export interface DataTableProps<T = any> {
     columns?: Column<T>[];
     data?: T[];
     keyExtractor?: (item: T, idx: number) => string | number;
     emptyMessage?: string;
     loading?: boolean;
     error?: any;
     skeletonRows?: number;
     sortKey?: string;
     sortDirection?: 'asc' | 'desc' | string;
     onSortChange?: (key: string, direction: 'asc' | 'desc' | string) => void;
     [key: string]: any;
}

export default function DataTable<T = any>({
     columns = [],
     data = [],
     keyExtractor = (item: any, idx: number) => item?.id || item?._id || idx,
     emptyMessage = 'No records found matching criteria.',
     loading = false,
     error = null,
     skeletonRows = 5,
     sortKey,
     sortDirection = 'asc',
     onSortChange,
}: DataTableProps<T>) {
     const rows = Array.isArray(data) ? data : [];

     const handleSort = (column: Column<T>) => {
          if (!column.sortable || !onSortChange) return;
          const nextDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
          onSortChange(column.key, nextDirection);
     };

     if (error) {
          const errorText = typeof error === 'string' ? error : error?.message || 'Unable to load data';
          return (
               <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-none border border-rose-500/30 bg-rose-500/5 p-8 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                         <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                         <p className="font-semibold text-rose-500 text-sm">Failed to load records</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">{errorText}</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1c] shadow-xs">
               <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                         <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              <tr>
                                   {columns.map((column) => {
                                        const isSorted = sortKey === column.key;
                                        const SortIcon = !isSorted
                                             ? ArrowUpDown
                                             : sortDirection === 'asc'
                                             ? ArrowUp
                                             : ArrowDown;

                                        return (
                                             <th
                                                  key={column.key}
                                                  className={`px-4 py-3.5 select-none ${column.headerClassName || ''} ${column.className || ''}`}
                                             >
                                                  {column.sortable ? (
                                                       <button
                                                            type="button"
                                                            onClick={() => handleSort(column)}
                                                            className="flex items-center gap-1.5 font-bold hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                                                       >
                                                            <span>{column.label}</span>
                                                            <SortIcon
                                                                 className={`w-3.5 h-3.5 ${
                                                                      isSorted ? 'text-[#b99d75]' : 'text-gray-400 opacity-60'
                                                                 }`}
                                                            />
                                                       </button>
                                                  ) : (
                                                       <span>{column.label}</span>
                                                  )}
                                             </th>
                                        );
                                   })}
                              </tr>
                         </thead>

                         <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 font-normal">
                              {loading ? (
                                   Array.from({ length: skeletonRows }).map((_, rIdx) => (
                                        <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                                             {columns.map((col, cIdx) => (
                                                  <td key={`skeleton-${rIdx}-${cIdx}`} className="px-4 py-3.5">
                                                       <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-sm w-3/4" />
                                                  </td>
                                             ))}
                                        </tr>
                                   ))
                              ) : rows.length === 0 ? (
                                   <tr>
                                        <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                                             <div className="flex flex-col items-center justify-center gap-2">
                                                  <Inbox className="w-8 h-8 text-gray-400 opacity-50" />
                                                  <p className="text-xs font-semibold">{emptyMessage}</p>
                                             </div>
                                        </td>
                                   </tr>
                              ) : (
                                   rows.map((item, index) => {
                                        const rowKey = keyExtractor(item, index);
                                        return (
                                             <tr
                                                  key={rowKey}
                                                  className="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors"
                                             >
                                                  {columns.map((column) => (
                                                       <td
                                                            key={`${rowKey}-${column.key}`}
                                                            className={`px-4 py-3.5 align-middle ${column.className || ''}`}
                                                       >
                                                            {column.render ? column.render(item, index) : item[column.key]}
                                                       </td>
                                                  ))}
                                             </tr>
                                        );
                                   })
                              )}
                         </tbody>
                    </table>
               </div>
          </div>
     );
}
