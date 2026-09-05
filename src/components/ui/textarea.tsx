import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
     extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
     ({ className, ...props }, ref) => {
          return (
               <textarea
                    className={cn(
                         'flex min-h-[80px] w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs text-gray-900 dark:text-white shadow-xs placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#b99d75] disabled:cursor-not-allowed disabled:opacity-50',
                         className
                    )}
                    ref={ref}
                    {...props}
               />
          );
     }
);
Textarea.displayName = 'Textarea';

export { Textarea };
