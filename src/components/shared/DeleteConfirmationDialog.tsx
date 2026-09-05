'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import FormDialog from './FormDialog';

export interface DeleteConfirmationDialogProps {
     isOpen: boolean;
     onClose: () => void;
     onConfirm: () => void;
     title?: string;
     message?: string;
     isLoading?: boolean;
     confirmLabel?: string;
}

export default function DeleteConfirmationDialog({
     isOpen,
     onClose,
     onConfirm,
     title = 'Confirm Deletion',
     message = 'Are you sure you want to delete this item? This action cannot be undone.',
     isLoading = false,
     confirmLabel = 'Delete',
}: DeleteConfirmationDialogProps) {
     return (
          <FormDialog isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
               <div className="space-y-4 pt-1">
                    <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                         <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                         <p className="text-xs leading-relaxed font-medium">
                              {message}
                         </p>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                         <button
                              type="button"
                              onClick={onClose}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                         >
                              Cancel
                         </button>
                         <button
                              type="button"
                              onClick={onConfirm}
                              disabled={isLoading}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{confirmLabel}</span>
                         </button>
                    </div>
               </div>
          </FormDialog>
     );
}
