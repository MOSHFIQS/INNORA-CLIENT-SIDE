'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatsCardProps {
     title: string;
     value: string | number;
     subtitle?: string;
     icon?: LucideIcon | React.ComponentType<any>;
     trend?: string;
     trendType?: 'positive' | 'negative' | 'neutral' | string;
     color?: 'gold' | 'emerald' | 'blue' | 'purple' | 'amber' | string;
     href?: string;
}

export default function StatsCard({
     title,
     value,
     subtitle,
     icon: Icon,
     trend,
     trendType = 'positive',
     color = 'gold',
     href,
}: StatsCardProps) {
     const colorMap = {
          gold: {
               iconBg: 'bg-[#b99d75]/10 text-[#b99d75] border-[#b99d75]/20',
               badge: 'text-[#b99d75]',
          },
          emerald: {
               iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
               badge: 'text-emerald-500',
          },
          blue: {
               iconBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
               badge: 'text-blue-500',
          },
          purple: {
               iconBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
               badge: 'text-purple-500',
          },
          amber: {
               iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
               badge: 'text-amber-500',
          },
     };

     const activeColor = colorMap[color] || colorMap.gold;

     const CardContent = (
          <div className="group relative overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200/80 dark:border-gray-800 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#b99d75]/40 flex flex-col justify-between h-full">
               <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                         <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate">
                              {title}
                         </p>
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                              {value}
                         </h3>
                    </div>

                    {Icon && (
                         <div className={`p-2.5 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 ${activeColor.iconBg}`}>
                              <Icon className="w-5 h-5" />
                         </div>
                    )}
               </div>

               {(subtitle || trend) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                         {subtitle && (
                              <span className="text-gray-500 dark:text-gray-400 font-medium truncate">
                                   {subtitle}
                              </span>
                         )}
                         {trend && (
                              <span
                                   className={`flex items-center gap-0.5 font-bold shrink-0 ml-2 ${
                                        trendType === 'positive'
                                             ? 'text-emerald-500'
                                             : trendType === 'negative'
                                             ? 'text-rose-500'
                                             : 'text-gray-500'
                                   }`}
                              >
                                   {trendType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
                                   {trendType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
                                   {trend}
                              </span>
                         )}
                    </div>
               )}
          </div>
     );

     if (href) {
          return (
               <Link href={href} className="block h-full">
                    {CardContent}
               </Link>
          );
     }

     return CardContent;
}
