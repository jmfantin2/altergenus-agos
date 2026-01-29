'use client';

import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/hooks';
import { LANGUAGE_FLAGS } from '@/lib/constants';
import { StartMenu } from './StartMenu';

export function BottomBar() {
  const { language, setLanguage } = useTranslation();

  const isStartMenuOpen = useAppStore((state) => state.isStartMenuOpen);
  const toggleStartMenu = useAppStore((state) => state.toggleStartMenu);

  // Cycle through languages
  const handleLanguageClick = () => {
    const languages = ['pt-BR', 'es', 'en-US'] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 md:h-14 bg-ag-surface border-t border-ag-border z-50">
      <div className="relative h-full flex items-center justify-between px-4">
        {/* Left side - Language toggle */}
        <button
          onClick={handleLanguageClick}
          className="flex items-center gap-2 px-3 py-1.5 text-ag-primary hover:bg-ag-background rounded transition-colors"
          aria-label="Change language"
        >
          <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
          <span className="hidden sm:inline text-sm font-sans">
            {language.toUpperCase()}
          </span>
        </button>

        {/* Center - AGOS Start Button */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button
            onClick={toggleStartMenu}
            className={`
              px-6 py-2 font-bytesized text-xl tracking-wider transition-all
              ${
                isStartMenuOpen
                  ? 'bg-ag-primary text-ag-background'
                  : 'bg-ag-background text-ag-primary hover:bg-ag-primary hover:text-ag-background'
              }
              border border-ag-border
            `}
            aria-label="Open start menu"
            aria-expanded={isStartMenuOpen}
          >
            agOS
          </button>

          {/* Start Menu */}
          <StartMenu />
        </div>

        {/* Right side - Empty for now, could add clock or notifications */}
        <div className="w-16">{/* Placeholder for symmetry */}</div>
      </div>
    </div>
  );
}
