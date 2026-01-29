'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { t as translateFn } from '@/lib/translations';
import { THEMES, BREAKPOINTS } from '@/lib/constants';
import type { SupportedLanguage, ThemeMode } from '@/lib/constants';
import type { ThemeColors } from '@/lib/constants';

// ============================================================================
// TRANSLATION HOOK
// ============================================================================

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  
  const t = useCallback(
    (key: Parameters<typeof translateFn>[0]) => translateFn(key, language),
    [language]
  );
  
  return { t, language, setLanguage };
}

// ============================================================================
// THEME HOOK
// ============================================================================

export function useTheme() {
  const themeMode = useAppStore((state) => state.themeMode);
  const themeId = useAppStore((state) => state.themeId);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const setThemeId = useAppStore((state) => state.setThemeId);
  
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  
  // Resolve system theme
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        setResolvedMode(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setResolvedMode(themeMode);
    }
  }, [themeMode]);
  
  // Get current theme colors
  const theme = THEMES[themeId] || THEMES.default;
  const colors: ThemeColors = theme.colors[resolvedMode];
  
  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--ag-primary', colors.primary);
    root.style.setProperty('--ag-background', colors.background);
    root.style.setProperty('--ag-accent', colors.accent);
    root.style.setProperty('--ag-surface', colors.surface);
    root.style.setProperty('--ag-border', colors.border);
    
    // Also set class for dark mode
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colors, resolvedMode]);
  
  return {
    themeMode,
    themeId,
    resolvedMode,
    colors,
    setThemeMode,
    setThemeId,
    isPremiumTheme: theme.isPremium,
    availableThemes: THEMES,
  };
}

// ============================================================================
// RESPONSIVE HOOK
// ============================================================================

export function useResponsive() {
  const isMobile = useAppStore((state) => state.isMobile);
  const setIsMobile = useAppStore((state) => state.setIsMobile);
  
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  
  useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS.tablet);
      setIsTablet(width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop);
      setIsDesktop(width >= BREAKPOINTS.desktop);
    };
    
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, [setIsMobile]);
  
  return { isMobile, isTablet, isDesktop };
}

// ============================================================================
// MODAL HOOK
// ============================================================================

export function useModal() {
  const modal = useAppStore((state) => state.modal);
  const openModal = useAppStore((state) => state.openModal);
  const closeModal = useAppStore((state) => state.closeModal);
  
  return { modal, openModal, closeModal };
}

// ============================================================================
// CLIPBOARD HOOK
// ============================================================================

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      console.error('Failed to copy to clipboard');
      return false;
    }
  }, []);
  
  return { copied, copy };
}

// ============================================================================
// KEYBOARD NAVIGATION HOOK
// ============================================================================

export function useKeyboardNavigation(
  onLeft?: () => void,
  onRight?: () => void,
  onEscape?: () => void
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onLeft?.();
          break;
        case 'ArrowRight':
          onRight?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onLeft, onRight, onEscape]);
}

// ============================================================================
// SWIPE GESTURE HOOK
// ============================================================================

export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement>,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = endX - startX;
      const diffY = endY - startY;
      
      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, threshold]);
}

// ============================================================================
// OUTSIDE CLICK HOOK
// ============================================================================

export function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
