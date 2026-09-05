'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';

export interface CustomAction {
     label: string;
     icon?: React.ComponentType<{ className?: string }>;
     onClick: () => void;
}

export interface ActionsMenuProps {
     onView?: () => void;
     onEdit?: () => void;
     onDelete?: () => void;
     onStatusChange?: (status: string) => void;
     customActions?: CustomAction[];
     viewLabel?: string;
     editLabel?: string;
     deleteLabel?: string;
}

export default function ActionsMenu({
     onView,
     onEdit,
     onDelete,
     onStatusChange,
     customActions = [],
     viewLabel = 'View Details',
     editLabel = 'Edit',
     deleteLabel = 'Delete',
}: ActionsMenuProps) {
     const [isOpen, setIsOpen] = useState(false);
     const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          const handleClickOutside = (event) => {
               if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setIsOpen(false);
               }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     return (
          <div className="relative inline-block text-left" ref={menuRef}>
               <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                    title="Actions"
               >
                    <MoreHorizontal className="w-4 h-4" />
               </button>

               {isOpen && (
                    <div className="absolute right-0 z-30 mt-1 w-44 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 shadow-xl py-1 text-xs font-medium">
                         {onView && (
                              <button
                                   type="button"
                                   onClick={() => {
                                        setIsOpen(false);
                                        onView();
                                   }}
                                   className="flex w-full items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#b99d75]/10 hover:text-[#b99d75] transition cursor-pointer"
                              >
                                   <Eye className="w-3.5 h-3.5 text-gray-400" />
                                   <span>{viewLabel}</span>
                              </button>
                         )}

                         {onEdit && (
                              <button
                                   type="button"
                                   onClick={() => {
                                        setIsOpen(false);
                                        onEdit();
                                   }}
                                   className="flex w-full items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#b99d75]/10 hover:text-[#b99d75] transition cursor-pointer"
                              >
                                   <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                                   <span>{editLabel}</span>
                              </button>
                         )}

                         {customActions.map((action, idx) => (
                              <button
                                   key={idx}
                                   type="button"
                                   onClick={() => {
                                        setIsOpen(false);
                                        action.onClick();
                                   }}
                                   className="flex w-full items-center gap-2.5 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#b99d75]/10 hover:text-[#b99d75] transition cursor-pointer"
                              >
                                   {action.icon && <action.icon className="w-3.5 h-3.5 text-gray-400" />}
                                   <span>{action.label}</span>
                              </button>
                         ))}

                         {onDelete && (
                              <button
                                   type="button"
                                   onClick={() => {
                                        setIsOpen(false);
                                        onDelete();
                                   }}
                                   className="flex w-full items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition border-t border-gray-100 dark:border-gray-800 cursor-pointer"
                              >
                                   <Trash2 className="w-3.5 h-3.5" />
                                   <span>{deleteLabel}</span>
                              </button>
                         )}
                    </div>
               )}
          </div>
     );
}
