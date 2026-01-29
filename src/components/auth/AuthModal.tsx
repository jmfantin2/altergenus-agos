'use client';

import { useState } from 'react';
import { useTranslation, useModal } from '@/hooks';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button, Input } from '@/components/ui';
import { Icon } from '@/lib/icons';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  initialMode?: AuthMode;
  reward?: boolean;
  bookId?: string;
}

export function AuthModal({ initialMode = 'login', reward = false, bookId }: AuthModalProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const setUser = useAppStore((state) => state.setUser);
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        if (data.user) {
          setUser(data.user);
          
          // If first book reward, grant chapter 1
          if (reward && bookId) {
            await fetch('/api/books/reward-first-book', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookId }),
            });
          }
          
          closeModal();
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        if (data.user) {
          setUser(data.user);
          closeModal();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-ag-background border border-ag-border w-full max-w-sm shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border">
          <h2 className="text-lg font-sans font-medium text-ag-primary">
            {mode === 'login' ? t('auth.login') : t('auth.signup')}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 text-ag-primary hover:text-ag-accent transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        {/* Reward banner */}
        {mode === 'signup' && reward && (
          <div className="px-4 py-3 bg-green-500/10 border-b border-ag-border">
            <div className="flex items-center gap-2 text-green-600">
              <Icon name="gift" size={18} />
              <p className="text-sm font-sans">{t('auth.loginPrompt.reward')}</p>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-sm font-sans text-red-500">{error}</p>
            </div>
          )}
          
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          
          {mode === 'signup' && (
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          )}
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            {mode === 'login' ? t('auth.login') : t('auth.signup')}
          </Button>
          
          {mode === 'login' && (
            <button
              type="button"
              className="w-full text-sm font-sans text-ag-accent hover:text-ag-primary transition-colors"
            >
              {t('auth.forgotPassword')}
            </button>
          )}
        </form>
        
        {/* Divider */}
        <div className="px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-ag-border" />
            <span className="text-xs font-sans text-ag-accent">
              {t('auth.orContinueWith')}
            </span>
            <div className="flex-1 h-px bg-ag-border" />
          </div>
        </div>
        
        {/* Social login */}
        <div className="p-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.google')}
          </Button>
        </div>
        
        {/* Toggle mode */}
        <div className="px-4 pb-4 text-center">
          <p className="text-sm font-sans text-ag-accent">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-ag-primary hover:underline"
            >
              {mode === 'login' ? t('auth.signup') : t('auth.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
