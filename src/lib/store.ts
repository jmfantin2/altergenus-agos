import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { SupportedLanguage, ThemeMode } from '@/lib/constants';
import type { ModalState, ReaderState } from '@/types';
import { DEFAULT_LANGUAGE, PORTUGUESE_SPEAKING_COUNTRIES } from '@/lib/constants';

// ============================================================================
// LANGUAGE DETECTION
// ============================================================================

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  // Try to detect from navigator
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage;
  
  if (browserLang?.startsWith('pt')) {
    return 'pt-BR';
  }
  
  if (browserLang?.startsWith('es')) {
    return 'es';
  }
  
  return DEFAULT_LANGUAGE;
}

// ============================================================================
// STORE TYPES
// ============================================================================

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Language
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  themeId: string;
  setThemeId: (id: string) => void;
  
  // UI State
  isStartMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  toggleStartMenu: () => void;
  
  // Modal
  modal: ModalState;
  openModal: (type: ModalState['type'], data?: unknown) => void;
  closeModal: () => void;
  
  // Active Window (folder or book being viewed)
  activeWindow: {
    type: 'folder' | 'book' | null;
    id: string | null;
  };
  openFolder: (folderId: string) => void;
  openBook: (bookId: string) => void;
  closeWindow: () => void;
  
  // Reader State
  reader: ReaderState;
  setReader: (state: Partial<ReaderState>) => void;
  resetReader: () => void;
  
  // Session-based reading tracking (for anonymous users)
  sessionFragmentsRead: Record<string, number>; // bookId -> count
  incrementSessionFragments: (bookId: string) => void;
  resetSessionFragments: () => void;
  
  // Mobile
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

// ============================================================================
// INITIAL STATES
// ============================================================================

const initialReaderState: ReaderState = {
  bookId: null,
  chapterId: null,
  fragmentId: null,
  fragmentIndex: 0,
  totalFragments: 0,
};

// ============================================================================
// STORE
// ============================================================================

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Language
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language }),
      
      // Theme
      themeMode: 'system',
      setThemeMode: (themeMode) => set({ themeMode }),
      themeId: 'default',
      setThemeId: (themeId) => set({ themeId }),
      
      // UI State
      isStartMenuOpen: false,
      setStartMenuOpen: (isStartMenuOpen) => set({ isStartMenuOpen }),
      toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
      
      // Modal
      modal: { type: null },
      openModal: (type, data) => set({ modal: { type, data }, isStartMenuOpen: false }),
      closeModal: () => set({ modal: { type: null } }),
      
      // Active Window
      activeWindow: { type: null, id: null },
      openFolder: (folderId) => set({ 
        activeWindow: { type: 'folder', id: folderId },
        isStartMenuOpen: false,
      }),
      openBook: (bookId) => set({ 
        activeWindow: { type: 'book', id: bookId },
        isStartMenuOpen: false,
      }),
      closeWindow: () => set({ 
        activeWindow: { type: null, id: null },
        reader: initialReaderState,
      }),
      
      // Reader State
      reader: initialReaderState,
      setReader: (newState) => set((state) => ({
        reader: { ...state.reader, ...newState },
      })),
      resetReader: () => set({ reader: initialReaderState }),
      
      // Session fragments (not persisted)
      sessionFragmentsRead: {},
      incrementSessionFragments: (bookId) => set((state) => ({
        sessionFragmentsRead: {
          ...state.sessionFragmentsRead,
          [bookId]: (state.sessionFragmentsRead[bookId] || 0) + 1,
        },
      })),
      resetSessionFragments: () => set({ sessionFragmentsRead: {} }),
      
      // Mobile
      isMobile: false,
      setIsMobile: (isMobile) => set({ isMobile }),
    }),
    {
      name: 'altergenus-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        language: state.language,
        themeMode: state.themeMode,
        themeId: state.themeId,
        sessionFragmentsRead: state.sessionFragmentsRead,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, detect language if not already set
        if (state && state.language === DEFAULT_LANGUAGE) {
          const detectedLang = detectInitialLanguage();
          if (detectedLang !== DEFAULT_LANGUAGE) {
            state.setLanguage(detectedLang);
          }
        }
      },
    }
  )
);

// ============================================================================
// SELECTORS (for performance optimization)
// ============================================================================

export const selectUser = (state: AppState) => state.user;
export const selectLanguage = (state: AppState) => state.language;
export const selectTheme = (state: AppState) => ({
  mode: state.themeMode,
  id: state.themeId,
});
export const selectModal = (state: AppState) => state.modal;
export const selectActiveWindow = (state: AppState) => state.activeWindow;
export const selectReader = (state: AppState) => state.reader;
export const selectIsMobile = (state: AppState) => state.isMobile;
