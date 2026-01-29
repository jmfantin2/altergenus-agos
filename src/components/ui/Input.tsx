'use client';

import { forwardRef } from 'react';
import { Icon } from '@/lib/icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-sans text-ag-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ag-accent">
              <Icon name={icon} size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 
              bg-ag-surface text-ag-primary 
              border border-ag-border 
              font-sans text-base
              placeholder:text-ag-accent
              focus:outline-none focus:border-ag-primary
              transition-colors
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
