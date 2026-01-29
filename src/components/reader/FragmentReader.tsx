'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  useTranslation, 
  useResponsive, 
  useKeyboardNavigation, 
  useSwipeGesture 
} from '@/hooks';
import { Icon } from '@/lib/icons';
import { ProgressBar } from '@/components/ui';
import type { LocalizedFragment, LocalizedChapter } from '@/types';

interface FragmentReaderProps {
  chapter: LocalizedChapter;
  fragments: LocalizedFragment[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onOpenTOC: () => void;
}

export function FragmentReader({
  chapter,
  fragments,
  currentIndex,
  onNext,
  onPrevious,
  onClose,
  onOpenTOC,
}: FragmentReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  const currentFragment = fragments[currentIndex];
  const progress = ((currentIndex + 1) / fragments.length) * 100;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < fragments.length - 1;
  
  // Handle navigation with animation direction
  const handleNext = useCallback(() => {
    if (canGoNext) {
      setDirection('right');
      onNext();
    }
  }, [canGoNext, onNext]);
  
  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setDirection('left');
      onPrevious();
    }
  }, [canGoPrevious, onPrevious]);
  
  // Reset direction after animation
  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => setDirection(null), 300);
      return () => clearTimeout(timer);
    }
  }, [direction, currentIndex]);
  
  // Keyboard navigation (desktop)
  useKeyboardNavigation(
    handlePrevious,
    handleNext,
    onClose
  );
  
  // Swipe gestures (mobile)
  useSwipeGesture(
    containerRef,
    handleNext,   // Swipe left = next
    handlePrevious // Swipe right = previous
  );
  
  // Handle tap zones on mobile (like Instagram stories)
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e 
      ? e.changedTouches[0].clientX 
      : e.clientX;
    
    const relativeX = clientX - rect.left;
    const third = rect.width / 3;
    
    if (relativeX < third) {
      handlePrevious();
    } else if (relativeX > third * 2) {
      handleNext();
    }
    // Middle third does nothing (or could open TOC)
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-ag-background flex flex-col z-40"
      onClick={handleTap}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border bg-ag-surface shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 -ml-2 text-ag-primary hover:text-ag-accent transition-colors"
          aria-label="Close"
        >
          <Icon name="x" size={20} />
        </button>
        
        <div className="flex-1 text-center px-4">
          <h2 className="text-sm font-sans font-medium text-ag-primary truncate">
            {chapter.title}
          </h2>
          <p className="text-xs font-sans text-ag-accent">
            {t('reader.fragment')} {currentIndex + 1} / {fragments.length}
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTOC();
          }}
          className="p-2 -mr-2 text-ag-primary hover:text-ag-accent transition-colors"
          aria-label={t('reader.tableOfContents')}
        >
          <Icon name="list" size={20} />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="px-4 py-2 bg-ag-surface border-b border-ag-border shrink-0">
        <ProgressBar progress={progress} size="sm" />
      </div>
      
      {/* Fragment content */}
      <div className="flex-1 overflow-auto">
        <div 
          className={`
            max-w-2xl mx-auto px-6 py-8 md:px-8 md:py-12
            ${direction === 'right' ? 'animate-slide-in-right' : ''}
            ${direction === 'left' ? 'animate-slide-in-left' : ''}
          `}
        >
          <p className="font-serif text-lg md:text-xl leading-relaxed text-ag-primary">
            {currentFragment?.content}
          </p>
        </div>
      </div>
      
      {/* Navigation controls (desktop) */}
      {!isMobile && (
        <>
          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            disabled={!canGoPrevious}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2
              p-3 rounded-full bg-ag-surface/80 backdrop-blur-sm
              text-ag-primary hover:bg-ag-surface
              transition-all
              ${!canGoPrevious ? 'opacity-30 cursor-not-allowed' : ''}
            `}
            aria-label="Previous fragment"
          >
            <Icon name="chevron-left" size={24} />
          </button>
          
          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={!canGoNext}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2
              p-3 rounded-full bg-ag-surface/80 backdrop-blur-sm
              text-ag-primary hover:bg-ag-surface
              transition-all
              ${!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}
            `}
            aria-label="Next fragment"
          >
            <Icon name="chevron-right" size={24} />
          </button>
        </>
      )}
      
      {/* Mobile tap hint (shown briefly) */}
      {isMobile && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-4 text-xs font-sans text-ag-accent/50">
            <span>&#8592; {t('reader.chapter')}</span>
            <span>|</span>
            <span>{t('reader.chapter')} &#8594;</span>
          </div>
        </div>
      )}
    </div>
  );
}
