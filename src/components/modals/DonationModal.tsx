'use client';

import { useState } from 'react';
import { useTranslation, useModal, useClipboard } from '@/hooks';
import { useAppStore } from '@/lib/store';
import { DONATION_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui';
import { Icon } from '@/lib/icons';

interface DonationModalProps {
  bookId: string;
}

export function DonationModal({ bookId }: DonationModalProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { copied, copy } = useClipboard();
  const user = useAppStore((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCopyPix = () => {
    copy(DONATION_CONFIG.pixKey);
  };
  
  const handleConfirmDonation = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          donationValue: DONATION_CONFIG.defaultValue,
          donationCurrency: DONATION_CONFIG.defaultCurrency,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record donation');
      }
      
      setSuccess(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        closeModal();
        // Reload the page to refresh access
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-ag-background border border-ag-border w-full max-w-sm p-6 text-center shadow-xl animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <Icon name="check" size={32} className="text-green-500" />
          </div>
          <h2 className="text-lg font-sans font-medium text-ag-primary mb-2">
            {t('donation.thankYou')}
          </h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-ag-background border border-ag-border w-full max-w-sm shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border">
          <h2 className="text-lg font-sans font-medium text-ag-primary">
            {t('donation.title')}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 text-ag-primary hover:text-ag-accent transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm font-sans text-ag-primary leading-relaxed">
            {t('donation.description')}
          </p>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-sm font-sans text-red-500">{error}</p>
            </div>
          )}
          
          {/* Pix key */}
          <div className="bg-ag-surface border border-ag-border p-4 rounded">
            <p className="text-xs font-sans text-ag-accent mb-2">
              {t('donation.pixKey')}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-ag-primary break-all">
                {DONATION_CONFIG.pixKey}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyPix}
                icon={copied ? 'check' : 'copy'}
              >
                {copied ? t('donation.copied') : t('donation.copy')}
              </Button>
            </div>
          </div>
          
          {/* Confirm button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={handleConfirmDonation}
            loading={loading}
            icon="check"
          >
            {t('donation.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
