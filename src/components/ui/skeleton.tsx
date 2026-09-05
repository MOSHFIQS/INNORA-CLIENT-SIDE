import { cn } from '@/lib/utils';

function Skeleton({
     className,
     ...props
}: React.HTMLAttributes<HTMLDivElement>) {
     return (
          <div
               className={cn(
                    'animate-pulse bg-gray-200 dark:bg-gray-800/80 rounded-none',
                    className
               )}
               {...props}
          />
     );
}

export { Skeleton };
