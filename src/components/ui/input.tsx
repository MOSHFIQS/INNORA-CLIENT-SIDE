import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
     extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
     ({ className, type, ...props }, ref) => {
          return (
               <input
                    type={type}
                    className={cn(
                         'flex h-9 w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-1 text-xs text-gray-900 dark:text-white shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#b99d75] disabled:cursor-not-allowed disabled:opacity-50',
                         className
                    )}
                    ref={ref}
                    {...props}
               />
          );
     }
);
Input.displayName = 'Input';

export { Input };
