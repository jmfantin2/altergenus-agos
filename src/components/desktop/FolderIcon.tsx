'use client';

import { Icon } from '@/lib/icons';
import { useResponsive } from '@/hooks';

interface FolderIconProps {
  romanNumeral: string;
  bookCount: number;
  onClick: () => void;
  onDoubleClick?: () => void;
}

export function FolderIcon({
  romanNumeral,
  bookCount,
  onClick,
  onDoubleClick,
}: FolderIconProps) {
  const { isMobile } = useResponsive();

  const handleClick = () => {
    if (isMobile) {
      // Single tap opens on mobile
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
      className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-ag-surface/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ag-accent"
      aria-label={`${romanNumeral} century folder with ${bookCount} books`}
    >
      {/* Folder with roman numeral */}
      <div className="relative">
        {/* Folder icon */}
        <div className="w-16 h-14 md:w-20 md:h-16 flex items-center justify-center text-ag-primary">
          <Icon name="folder" size={56} className="md:hidden" />
          <Icon name="folder" size={64} className="hidden md:block" />
        </div>

        {/* Roman numeral overlay on folder */}
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className="text-ag-primary font-sans font-bold text-sm md:text-base tracking-wide drop-shadow-md">
            {romanNumeral}
          </span>
        </div>

        {/* Book count badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-ag-primary flex items-center justify-center">
          <span className="text-ag-background text-xs font-sans font-medium">
            {bookCount}
          </span>
        </div>
      </div>
    </button>
  );
}
