'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface FormDialogProps {
     isOpen: boolean;
     onClose: () => void;
     title: string;
     description?: string;
     children: React.ReactNode;
     maxWidth?: string;
}

export default function FormDialog({
     isOpen,
     onClose,
     title,
     description,
     children,
     maxWidth = 'max-w-2xl',
}: FormDialogProps) {
     useEffect(() => {
          const handleKeyDown = (e) => {
               if (e.key === 'Escape' && isOpen) {
                    onClose?.();
               }
          };
          if (isOpen) {
               document.body.style.overflow = 'hidden';
               window.addEventListener('keydown', handleKeyDown);
          }
          return () => {
               document.body.style.overflow = '';
               window.removeEventListener('keydown', handleKeyDown);
          };
     }, [isOpen, onClose]);

     if (!isOpen) return null;

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
               {/* Backdrop */}
               <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
                    onClick={onClose}
               />

               {/* Dialog Panel */}
               <div
                    className={`relative w-full ${maxWidth} bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col`}
               >
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-800/80">
                         <div className="space-y-1">
                              <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                                   {title}
                              </h3>
                              {description && (
                                   <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {description}
                                   </p>
                              )}
                         </div>
                         <button
                              type="button"
                              onClick={onClose}
                              className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-none transition"
                         >
                              <X className="w-5 h-5" />
                         </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-gray-700 dark:text-gray-300">
                         {children}
                    </div>
               </div>
          </div>
     );
}
