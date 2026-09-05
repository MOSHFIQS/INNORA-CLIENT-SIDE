import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
     'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 cursor-pointer',
     {
          variants: {
               variant: {
                    default:
                         'bg-[#b99d75] text-white shadow hover:bg-[#a68c65]',
                    luxury:
                         'bg-[#b99d75] text-white hover:bg-[#a68c65] shadow-xs',
                    destructive:
                         'bg-rose-600 text-white shadow-xs hover:bg-rose-700',
                    outline:
                         'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
                    secondary:
                         'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs hover:bg-gray-200 dark:hover:bg-gray-700',
                    ghost:
                         'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                    link:
                         'text-[#b99d75] underline-offset-4 hover:underline',
               },
               size: {
                    default: 'h-9 px-4 py-2',
                    sm: 'h-8 px-3 text-[11px]',
                    xs: 'h-7 px-2.5 text-[10px]',
                    lg: 'h-11 px-8 text-sm',
                    icon: 'h-9 w-9',
                    iconSm: 'h-7 w-7',
               },
          },
          defaultVariants: {
               variant: 'default',
               size: 'default',
          },
     }
);

export interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          VariantProps<typeof buttonVariants> {
     asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, asChild = false, ...props }, ref) => {
          const Comp = asChild ? Slot : 'button';
          return (
               <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props}
               />
          );
     }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
