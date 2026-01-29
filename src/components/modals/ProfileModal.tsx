'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useModal } from '@/hooks';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';
import { Icon } from '@/lib/icons';

interface UserStats {
  booksOwned: number;
  totalDonations: number;
  readingProgress: Array<{
    bookTitle: string;
    progress: number;
  }>;
}

export function ProfileModal() {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  
  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/profile/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    closeModal();
  };
  
  if (!user) {
    closeModal();
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-ag-background border border-ag-border w-full max-w-sm shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border">
          <h2 className="text-lg font-sans font-medium text-ag-primary">
            {t('profile.title')}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 text-ag-primary hover:text-ag-accent transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b border-ag-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-ag-primary flex items-center justify-center">
              <Icon name="user" size={24} className="text-ag-background" />
            </div>
            <div>
              <p className="text-sm font-sans font-medium text-ag-primary">
                {user.email}
              </p>
              <p className="text-xs font-sans text-ag-accent">
                {user.user_metadata?.full_name || 'Reader'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin">
                <Icon name="hourglass" size={24} className="text-ag-accent" />
              </div>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ag-surface p-3 rounded border border-ag-border">
                  <p className="text-2xl font-sans font-bold text-ag-primary">
                    {stats.booksOwned}
                  </p>
                  <p className="text-xs font-sans text-ag-accent">
                    {t('profile.booksOwned')}
                  </p>
                </div>
                <div className="bg-ag-surface p-3 rounded border border-ag-border">
                  <p className="text-2xl font-sans font-bold text-ag-primary">
                    R$ {stats.totalDonations.toFixed(2)}
                  </p>
                  <p className="text-xs font-sans text-ag-accent">
                    {t('profile.donations')}
                  </p>
                </div>
              </div>
              
              {stats.readingProgress.length > 0 && (
                <div>
                  <p className="text-xs font-sans text-ag-accent mb-2">
                    {t('profile.readingProgress')}
                  </p>
                  <div className="space-y-2">
                    {stats.readingProgress.slice(0, 3).map((item, index) => (
                      <div key={index} className="bg-ag-surface p-2 rounded border border-ag-border">
                        <p className="text-sm font-sans text-ag-primary truncate mb-1">
                          {item.bookTitle}
                        </p>
                        <div className="w-full h-1.5 bg-ag-accent/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-ag-primary"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-sm font-sans text-ag-accent py-4">
              No stats available
            </p>
          )}
        </div>
        
        {/* Logout button */}
        <div className="p-4 border-t border-ag-border">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleLogout}
            icon="log-out"
          >
            {t('menu.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
