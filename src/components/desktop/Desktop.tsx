'use client';

import { useAppStore } from '@/lib/store';
import { useResponsive } from '@/hooks';
import { FolderIcon } from './FolderIcon';
import { BottomBar } from './BottomBar';
import type { CenturyFolder } from '@/types';

interface DesktopProps {
  folders: CenturyFolder[];
}

export function Desktop({ folders }: DesktopProps) {
  const { isMobile } = useResponsive();
  const openFolder = useAppStore((state) => state.openFolder);
  
  const handleOpenFolder = (century: number) => {
    openFolder(century.toString());
  };
  
  return (
    <div className="min-h-screen bg-ag-background pb-14 md:pb-16">
      {/* Desktop grid */}
      <div className="p-4 md:p-8">
        <div 
          className={`
            grid gap-4 md:gap-6
            ${isMobile 
              ? 'grid-cols-3 sm:grid-cols-4' 
              : 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
            }
          `}
        >
          {folders.map((folder) => (
            <FolderIcon
              key={folder.century}
              romanNumeral={folder.romanNumeral}
              bookCount={folder.bookIds.length}
              onClick={() => handleOpenFolder(folder.century)}
              onDoubleClick={() => handleOpenFolder(folder.century)}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom bar (taskbar) */}
      <BottomBar />
    </div>
  );
}
