'use client';

import React from 'react';
import { Desktop } from '@/components/desktop';
import { ActiveWindowManager } from '@/components/ActiveWindowManager';
import { useAppStore } from '@/lib/store';
import type { CenturyFolder } from '@/types';

export function DesktopWrapper({
  initialLanguage,
  folders,
}: {
  initialLanguage: string;
  folders: CenturyFolder[];
}) {
  const setLanguage = useAppStore((state) => state.setLanguage);

  // Set initial language on mount
  React.useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage as Parameters<typeof setLanguage>[0]);
    }
  }, [initialLanguage, setLanguage]);

  return (
    <>
      <Desktop folders={folders} />
      <ActiveWindowManager />
    </>
  );
}
