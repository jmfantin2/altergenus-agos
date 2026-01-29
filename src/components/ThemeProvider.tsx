'use client';

import { useEffect } from 'react';
import { useTheme, useResponsive } from '@/hooks';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme
  useTheme();
  
  // Initialize responsive detection
  useResponsive();
  
  return <>{children}</>;
}
