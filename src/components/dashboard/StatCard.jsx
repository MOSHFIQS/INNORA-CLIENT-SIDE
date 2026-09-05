'use client';

import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'text-[#b99d75]' }) {
     return (
          <div className="bg-white dark:bg-[#202020] p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
               <div className="space-y-1">
                    <p className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                         {title}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold font-serif text-gray-900 dark:text-white">
                         {value}
                    </p>
                    {subtitle && (
                         <p className="text-[11px] text-gray-500">
                              {subtitle}
                         </p>
                    )}
               </div>
               {Icon && (
                    <div className={`p-3 bg-gray-100 dark:bg-[#2a2a2a] rounded-none ${color}`}>
                         <Icon className="w-6 h-6" />
                    </div>
               )}
          </div>
     );
}
