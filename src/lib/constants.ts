// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export const SUPPORTED_LANGUAGES = ['pt-BR', 'es', 'en-US'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

export const PORTUGUESE_SPEAKING_COUNTRIES = [
  'BR', // Brazil
  'PT', // Portugal
  'AO', // Angola
  'MZ', // Mozambique
  'CV', // Cape Verde
  'GW', // Guinea-Bissau
  'ST', // São Tomé and Príncipe
  'TL', // Timor-Leste
  'MO', // Macau
] as const;

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  'pt-BR': 'Português',
  'es': 'Español',
  'en-US': 'English',
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  'pt-BR': '🇧🇷',
  'es': '🇪🇸',
  'en-US': '🇺🇸',
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const THEME_MODES = ['system', 'light', 'dark'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export interface ThemeColors {
  primary: string;      // Text/foreground color
  background: string;   // Background color
  accent: string;       // Secondary/accent color
  surface: string;      // Surface/card color
  border: string;       // Border color
}

export interface Theme {
  id: string;
  name: Record<SupportedLanguage, string>;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  isPremium: boolean;
}

export const THEMES: Record<string, Theme> = {
  default: {
    id: 'default',
    name: {
      'pt-BR': 'Padrão',
      'es': 'Predeterminado',
      'en-US': 'Default',
    },
    colors: {
      light: {
        primary: '#131313',
        background: '#e3e3e3',
        accent: '#7B7B7B',
        surface: '#f5f5f5',
        border: '#d1d1d1',
      },
      dark: {
        primary: '#e3e3e3',
        background: '#131313',
        accent: '#7B7B7B',
        surface: '#1f1f1f',
        border: '#2a2a2a',
      },
    },
    isPremium: false,
  },
  sepia: {
    id: 'sepia',
    name: {
      'pt-BR': 'Sépia',
      'es': 'Sepia',
      'en-US': 'Sepia',
    },
    colors: {
      light: {
        primary: '#3d3229',
        background: '#f4ecd8',
        accent: '#8b7355',
        surface: '#faf6eb',
        border: '#d4c9b5',
      },
      dark: {
        primary: '#e8dcc8',
        background: '#1a1612',
        accent: '#8b7355',
        surface: '#2a241e',
        border: '#3d3229',
      },
    },
    isPremium: true,
  },
  midnight: {
    id: 'midnight',
    name: {
      'pt-BR': 'Meia-noite',
      'es': 'Medianoche',
      'en-US': 'Midnight',
    },
    colors: {
      light: {
        primary: '#1a1a2e',
        background: '#eef1f5',
        accent: '#4a4e69',
        surface: '#f8f9fc',
        border: '#c9cdd4',
      },
      dark: {
        primary: '#e0e4eb',
        background: '#0f0f1a',
        accent: '#6b70a0',
        surface: '#1a1a2e',
        border: '#2a2a4a',
      },
    },
    isPremium: true,
  },
};

// ============================================================================
// ACCESS RULES
// ============================================================================

export const FREE_FRAGMENTS_LIMIT = 12;
export const FIRST_BOOK_CHAPTER_REWARD = true;

// ============================================================================
// DONATION CONFIGURATION
// ============================================================================

export const DONATION_CONFIG = {
  pixKey: 'altergenus@gmail.com',
  defaultValue: 0.44,
  defaultCurrency: 'BRL',
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const ICON_STROKE_WIDTH = 1.5;
