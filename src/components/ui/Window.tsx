'use client';

import { useRef } from 'react';
import { useOutsideClick, useResponsive } from '@/hooks';
import { Icon } from '@/lib/icons';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export function Window({ title, children, onClose, className = '' }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  
  // Close on outside click (desktop only)
  useOutsideClick(windowRef, onClose, !isMobile);
  
  if (isMobile) {
    // Full-screen mobile view
    return (
      <div className="fixed inset-0 bg-ag-background z-40 flex flex-col animate-slide-up">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border bg-ag-surface">
          <h2 className="text-lg font-sans font-medium text-ag-primary truncate">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-ag-primary hover:text-ag-accent transition-colors"
            aria-label="Close"
          >
            <Icon name="x" size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className={`flex-1 overflow-auto ${className}`}>
          {children}
        </div>
      </div>
    );
  }
  
  // Desktop modal-like window
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-40 p-8">
      <div
        ref={windowRef}
        className={`
          bg-ag-background border border-ag-border shadow-2xl
          w-full max-w-3xl max-h-[80vh]
          flex flex-col
          animate-fade-in
          ${className}
        `}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-ag-border bg-ag-surface shrink-0">
          <h2 className="text-base font-sans font-medium text-ag-primary truncate">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-ag-primary hover:text-ag-accent transition-colors"
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
