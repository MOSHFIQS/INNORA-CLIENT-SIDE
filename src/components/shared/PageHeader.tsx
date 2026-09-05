'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
     label: string;
     href?: string;
     [key: string]: any;
}

export interface PageHeaderProps {
     title: string;
     description?: string;
     badge?: string | number;
     breadcrumbs?: BreadcrumbItem[];
     actions?: React.ReactNode;
     className?: string;
     [key: string]: any;
}

export default function PageHeader({
     title,
     description,
     badge,
     breadcrumbs = [],
     actions,
     className = '',
}: PageHeaderProps) {
     return (
          <div className={`space-y-2.5 mb-6 ${className}`}>
               {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                         {breadcrumbs.map((crumb, idx) => (
                              <React.Fragment key={crumb.label || idx}>
                                   {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600 shrink-0" />}
                                   {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-[#b99d75] transition">
                                             {crumb.label}
                                        </Link>
                                   ) : (
                                        <span className="text-gray-800 dark:text-gray-200 font-bold">{crumb.label}</span>
                                   )}
                              </React.Fragment>
                         ))}
                    </nav>
               )}

               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                         <div className="flex items-center gap-2.5 flex-wrap">
                              <h1 className="text-2xl md:text-3xl font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   {title}
                              </h1>
                              {badge && (
                                   <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#b99d75]/15 text-[#b99d75] border border-[#b99d75]/30">
                                        {badge}
                                   </span>
                              )}
                         </div>
                         {description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-2xl">
                                   {description}
                              </p>
                         )}
                    </div>

                    {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
               </div>
          </div>
     );
}
