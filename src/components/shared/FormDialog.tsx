'use client';

import React from 'react';
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
     return (
          <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
               <DialogContent className={cn('p-0 overflow-hidden', maxWidth)}>
                    <DialogHeader className="p-5">
                         <DialogTitle>{title}</DialogTitle>
                         {description && (
                              <DialogDescription>{description}</DialogDescription>
                         )}
                    </DialogHeader>
                    <div className="p-6 pt-0 overflow-y-auto max-h-[75vh] space-y-4 text-xs text-gray-700 dark:text-gray-300">
                         {children}
                    </div>
               </DialogContent>
          </Dialog>
     );
}
