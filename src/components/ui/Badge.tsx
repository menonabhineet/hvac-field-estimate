import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'neutral';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          {
        'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300': variant === 'default',
        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300': variant === 'success',
        'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300': variant === 'warning',
        'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300': variant === 'neutral',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
