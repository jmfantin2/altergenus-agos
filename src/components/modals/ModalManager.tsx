'use client';

import { useModal } from '@/hooks';
import { AuthModal } from '@/components/auth';
import { DonationModal } from './DonationModal';
import { ProfileModal } from './ProfileModal';
import { ErrorDialog } from '@/components/ui';

export function ModalManager() {
  const { modal, closeModal } = useModal();
  
  if (!modal.type) return null;
  
  switch (modal.type) {
    case 'auth':
      const authData = modal.data as { 
        mode?: 'login' | 'signup'; 
        reward?: boolean; 
        bookId?: string; 
      } | undefined;
      return (
        <AuthModal 
          initialMode={authData?.mode || 'login'}
          reward={authData?.reward}
          bookId={authData?.bookId}
        />
      );
    
    case 'donation':
      const donationData = modal.data as { bookId: string } | undefined;
      if (!donationData?.bookId) return null;
      return <DonationModal bookId={donationData.bookId} />;
    
    case 'profile':
      return <ProfileModal />;
    
    case 'error':
      const errorData = modal.data as { 
        title?: string; 
        message: string; 
        onRetry?: () => void; 
      } | undefined;
      if (!errorData?.message) return null;
      return (
        <ErrorDialog
          title={errorData.title}
          message={errorData.message}
          onRetry={errorData.onRetry}
          onClose={closeModal}
        />
      );
    
    default:
      return null;
  }
}
