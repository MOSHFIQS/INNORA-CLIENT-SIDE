'use client';

import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export interface FilterOption {
     label: string;
     value: string;
     [key: string]: any;
}

export interface FilterItem {
     key: string;
     value: string;
     options: FilterOption[];
     onChange: (value: string) => void;
     label?: string;
     placeholder?: string;
     [key: string]: any;
}

export interface SearchFilterBarProps {
     search?: string;
     onSearchChange?: (value: string) => void;
     searchPlaceholder?: string;
     filters?: FilterItem[];
     onReset?: () => void;
     totalCount?: number | string;
     actionButton?: React.ReactNode;
     className?: string;
     [key: string]: any;
}

export default function SearchFilterBar({
     search = '',
     onSearchChange,
     searchPlaceholder = 'Search records...',
     filters = [],
     onReset,
     totalCount,
     actionButton,
     className = '',
}: SearchFilterBarProps) {
     const hasActiveFilters = Boolean(search) || filters.some((f) => f.value && f.value !== 'ALL' && f.value !== '');

     return (
          <div className={`space-y-3 mb-4 ${className}`}>
               <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search & Filters Row */}
                    <div className="flex flex-1 flex-wrap items-center gap-2.5">
                         {/* Search Input */}
                         {onSearchChange && (
                              <div className="relative flex-1 min-w-[220px] max-w-md">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                   <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="w-full pl-9 pr-4 py-2 text-xs rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#b99d75] transition"
                                   />
                              </div>
                         )}

                         {/* Dropdown Filters */}
                         {filters.map((filter) => (
                              <div key={filter.key} className="min-w-[130px]">
                                   <select
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 font-medium focus:outline-none focus:border-[#b99d75] transition cursor-pointer"
                                   >
                                        {filter.options.map((opt) => (
                                             <option key={opt.value} value={opt.value}>
                                                  {opt.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>
                         ))}

                         {/* Reset Filters */}
                         {hasActiveFilters && onReset && (
                              <button
                                   type="button"
                                   onClick={onReset}
                                   className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer"
                                   title="Reset all filters"
                              >
                                   <RotateCcw className="w-3.5 h-3.5" />
                                   <span>Reset</span>
                              </button>
                         )}
                    </div>

                    {/* Right side: Count & Action */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                         {totalCount !== undefined && (
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                   Total: <span className="text-gray-900 dark:text-white">{totalCount}</span>
                              </span>
                         )}
                         {actionButton}
                    </div>
               </div>
          </div>
     );
}
