'use client';

import { forwardRef } from 'react';
import { Icon } from '@/lib/icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ag-accent disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-ag-primary text-ag-background hover:opacity-90 active:opacity-80',
      secondary: 'bg-ag-surface text-ag-primary border border-ag-border hover:bg-ag-background active:opacity-90',
      ghost: 'bg-transparent text-ag-primary hover:bg-ag-surface active:bg-ag-border',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };
    
    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 20,
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="animate-spin">
            <Icon name="hourglass" size={iconSizes[size]} />
          </span>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Icon name={icon} size={iconSizes[size]} />
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <Icon name={icon} size={iconSizes[size]} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
