import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
     'inline-flex items-center rounded-none border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
     {
          variants: {
               variant: {
                    default:
                         'border-transparent bg-[#b99d75] text-white hover:bg-[#a68c65]',
                    secondary:
                         'border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
                    destructive:
                         'border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
                    outline: 'text-foreground border-gray-300 dark:border-gray-700',
                    success:
                         'border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                    warning:
                         'border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
                    info:
                         'border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
                    gold:
                         'border-transparent bg-[#b99d75]/20 text-[#b99d75] border-[#b99d75]/40',
               },
          },
          defaultVariants: {
               variant: 'default',
          },
     }
);

export interface BadgeProps
     extends React.HTMLAttributes<HTMLDivElement>,
          VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
     return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
