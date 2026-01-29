'use client';

import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation, useTheme, useOutsideClick, useModal } from '@/hooks';
import { Icon } from '@/lib/icons';
import { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_LABELS, 
  LANGUAGE_FLAGS,
  THEME_MODES,
  THEMES,
} from '@/lib/constants';
import type { SupportedLanguage, ThemeMode } from '@/lib/constants';

export function StartMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, language, setLanguage } = useTranslation();
  const { themeMode, setThemeMode, themeId, setThemeId, availableThemes } = useTheme();
  const { openModal } = useModal();
  
  const user = useAppStore((state) => state.user);
  const isOpen = useAppStore((state) => state.isStartMenuOpen);
  const setStartMenuOpen = useAppStore((state) => state.setStartMenuOpen);
  
  useOutsideClick(menuRef, () => setStartMenuOpen(false), isOpen);
  
  if (!isOpen) return null;
  
  const handleLogin = () => {
    openModal('auth');
  };
  
  const handleLogout = () => {
    // Will be handled by auth component
    setStartMenuOpen(false);
  };
  
  const handleProfile = () => {
    openModal('profile');
  };
  
  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-ag-surface border border-ag-border shadow-xl animate-slide-up z-50"
    >
      {/* User section */}
      {user && (
        <div className="p-4 border-b border-ag-border">
          <button
            onClick={handleProfile}
            className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-ag-primary flex items-center justify-center">
              <Icon name="user" size={20} className="text-ag-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans font-medium text-ag-primary truncate">
                {user.email}
              </p>
              <p className="text-xs font-sans text-ag-accent">
                {t('menu.profile')}
              </p>
            </div>
          </button>
        </div>
      )}
      
      {/* Menu items */}
      <div className="p-2">
        {/* Theme selector */}
        <div className="p-2">
          <p className="text-xs font-sans text-ag-accent mb-2 px-2">
            {t('menu.theme')}
          </p>
          <div className="flex gap-1">
            {THEME_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={`
                  flex-1 px-2 py-1.5 text-xs font-sans rounded transition-colors
                  ${themeMode === mode 
                    ? 'bg-ag-primary text-ag-background' 
                    : 'text-ag-primary hover:bg-ag-background'
                  }
                `}
              >
                {t(`theme.${mode}` as keyof typeof t)}
              </button>
            ))}
          </div>
          
          {/* Premium themes */}
          <div className="mt-2">
            <p className="text-[10px] font-sans text-ag-accent mb-1 px-2">
              {t('theme.premium')}
            </p>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(availableThemes).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => setThemeId(id)}
                  disabled={theme.isPremium} // Premium themes disabled for now
                  className={`
                    px-2 py-1 text-xs font-sans rounded transition-colors
                    ${themeId === id 
                      ? 'bg-ag-primary text-ag-background' 
                      : 'text-ag-primary hover:bg-ag-background'
                    }
                    ${theme.isPremium ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {theme.name[language]}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-ag-border my-2" />
        
        {/* Language selector */}
        <div className="p-2">
          <p className="text-xs font-sans text-ag-accent mb-2 px-2">
            {t('menu.language')}
          </p>
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm font-sans transition-colors
                  ${language === lang 
                    ? 'bg-ag-primary text-ag-background' 
                    : 'text-ag-primary hover:bg-ag-background'
                  }
                `}
              >
                <span>{LANGUAGE_FLAGS[lang]}</span>
                <span>{LANGUAGE_LABELS[lang]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-ag-border my-2" />
        
        {/* Login/Logout */}
        <div className="p-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm font-sans text-ag-primary hover:bg-ag-background transition-colors"
            >
              <Icon name="log-out" size={16} />
              <span>{t('menu.logout')}</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm font-sans text-ag-primary hover:bg-ag-background transition-colors"
            >
              <Icon name="log-in" size={16} />
              <span>{t('menu.login')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
