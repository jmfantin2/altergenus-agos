'use client';

import { useTranslation, useModal } from '@/hooks';
import { Icon } from '@/lib/icons';

interface ErrorDialogProps {
  title?: string;
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
}

export function ErrorDialog({ title, message, onClose, onRetry }: ErrorDialogProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  
  const handleClose = () => {
    onClose?.();
    closeModal();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
      <div 
        className="bg-ag-surface border-2 border-ag-border shadow-lg max-w-sm w-full animate-fade-in"
        style={{
          // Windows 95/98 style 3D border effect
          borderTopColor: 'var(--ag-surface)',
          borderLeftColor: 'var(--ag-surface)',
          borderBottomColor: 'var(--ag-primary)',
          borderRightColor: 'var(--ag-primary)',
        }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-ag-primary">
          <span className="text-ag-background text-sm font-sans font-medium">
            {title || t('error.title')}
          </span>
          <button
            onClick={handleClose}
            className="w-5 h-5 flex items-center justify-center bg-ag-surface hover:bg-ag-background transition-colors"
            style={{
              borderTopColor: 'var(--ag-surface)',
              borderLeftColor: 'var(--ag-surface)',
              borderBottomColor: 'var(--ag-primary)',
              borderRightColor: 'var(--ag-primary)',
              borderWidth: '2px',
            }}
          >
            <Icon name="x" size={12} className="text-ag-primary" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 flex gap-4">
          {/* Error icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <Icon name="x" size={24} className="text-white" strokeWidth={3} />
            </div>
          </div>
          
          {/* Message */}
          <p className="text-ag-primary font-sans text-sm leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-center gap-2 px-4 pb-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-1 bg-ag-surface text-ag-primary font-sans text-sm border-2 hover:bg-ag-background transition-colors"
              style={{
                borderTopColor: 'var(--ag-surface)',
                borderLeftColor: 'var(--ag-surface)',
                borderBottomColor: 'var(--ag-primary)',
                borderRightColor: 'var(--ag-primary)',
              }}
            >
              {t('error.retry')}
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-6 py-1 bg-ag-surface text-ag-primary font-sans text-sm border-2 hover:bg-ag-background transition-colors"
            style={{
              borderTopColor: 'var(--ag-surface)',
              borderLeftColor: 'var(--ag-surface)',
              borderBottomColor: 'var(--ag-primary)',
              borderRightColor: 'var(--ag-primary)',
            }}
          >
            {t('error.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
