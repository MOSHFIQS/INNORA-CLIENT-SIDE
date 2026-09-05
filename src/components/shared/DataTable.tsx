'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Inbox } from 'lucide-react';
import {
     Table,
     TableHeader,
     TableBody,
     TableRow,
     TableHead,
     TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

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
          <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] shadow-xs">
               <Table>
                    <TableHeader>
                         <TableRow>
                              {columns.map((column) => {
                                   const isSorted = sortKey === column.key;
                                   const SortIcon = !isSorted
                                        ? ArrowUpDown
                                        : sortDirection === 'asc'
                                        ? ArrowUp
                                        : ArrowDown;

                                   return (
                                        <TableHead
                                             key={column.key}
                                             className={`select-none ${column.headerClassName || ''} ${column.className || ''}`}
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
                                        </TableHead>
                                   );
                              })}
                         </TableRow>
                    </TableHeader>

                    <TableBody>
                         {loading ? (
                              Array.from({ length: skeletonRows }).map((_, rIdx) => (
                                   <TableRow key={`skeleton-${rIdx}`}>
                                        {columns.map((col, cIdx) => (
                                             <TableCell key={`skeleton-${rIdx}-${cIdx}`}>
                                                  <Skeleton className="h-4 w-3/4" />
                                             </TableCell>
                                        ))}
                                   </TableRow>
                              ))
                         ) : rows.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                             <Inbox className="w-8 h-8 text-gray-400 opacity-50" />
                                             <p className="text-xs font-semibold">{emptyMessage}</p>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         ) : (
                              rows.map((item, index) => {
                                   const rowKey = keyExtractor(item, index);
                                   return (
                                        <TableRow key={rowKey}>
                                             {columns.map((column) => (
                                                  <TableCell
                                                       key={`${rowKey}-${column.key}`}
                                                       className={column.className || ''}
                                                  >
                                                       {column.render ? column.render(item, index) : item[column.key]}
                                                  </TableCell>
                                             ))}
                                        </TableRow>
                                   );
                              })
                         )}
                    </TableBody>
               </Table>
          </div>
     );
}
