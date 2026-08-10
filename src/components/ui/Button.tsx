import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          {
            'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700': variant === 'outline',
            'bg-red-50 text-red-600 hover:bg-red-100': variant === 'danger',
            'bg-transparent hover:bg-slate-100 text-slate-700': variant === 'ghost',
            
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md', // Large touch target
            'h-14 px-8 text-lg': size === 'lg',
            'h-12 w-12': size === 'icon', // Square button for icons
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button };
