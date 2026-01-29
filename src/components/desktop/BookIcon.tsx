'use client';

import { Icon } from '@/lib/icons';
import { useResponsive } from '@/hooks';
import type { LocalizedBook } from '@/types';

interface BookIconProps {
  book: LocalizedBook;
  onClick: () => void;
  onDoubleClick?: () => void;
}

export function BookIcon({ book, onClick, onDoubleClick }: BookIconProps) {
  const { isMobile } = useResponsive();
  
  const handleClick = () => {
    if (isMobile) {
      onClick();
    }
  };
  
  const handleDoubleClick = () => {
    if (!isMobile && onDoubleClick) {
      onDoubleClick();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-ag-surface/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ag-accent w-full max-w-[120px]"
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book icon */}
      <div className="w-12 h-14 md:w-14 md:h-16 flex items-center justify-center text-ag-primary">
        <Icon name={book.coverIcon || 'book'} size={40} className="md:hidden" />
        <Icon name={book.coverIcon || 'book'} size={48} className="hidden md:block" />
      </div>
      
      {/* Title */}
      <div className="text-center">
        <p className="text-xs md:text-sm font-sans text-ag-primary line-clamp-2 leading-tight">
          {book.title}
        </p>
        <p className="text-[10px] md:text-xs font-sans text-ag-accent mt-0.5 truncate">
          {book.author}
        </p>
      </div>
    </button>
  );
}
