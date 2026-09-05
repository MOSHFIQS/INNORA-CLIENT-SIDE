'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import FormDialog from './FormDialog';
import { Button } from '@/components/ui/button';

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
                         <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={onClose}
                              disabled={isLoading}
                         >
                              Cancel
                         </Button>
                         <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={onConfirm}
                              disabled={isLoading}
                         >
                              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{confirmLabel}</span>
                         </Button>
                    </div>
               </div>
          </FormDialog>
     );
}
