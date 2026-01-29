import React, { Suspense } from 'react';
import { headers } from 'next/headers';
import { LoadingScreen } from '@/components/ui';
import { BOOKS_BY_CENTURY, getRomanNumeralForCentury } from '@/lib/books';
import {
  PORTUGUESE_SPEAKING_COUNTRIES,
  DEFAULT_LANGUAGE,
} from '@/lib/constants';
import type { CenturyFolder } from '@/types';
import { DesktopWrapper } from './DesktopWrapper';

// Get folders with book counts
function getCenturyFolders(): CenturyFolder[] {
  return Object.entries(BOOKS_BY_CENTURY)
    .filter(([_, bookIds]) => bookIds.length > 0)
    .map(([century, bookIds]) => ({
      century: parseInt(century),
      romanNumeral: getRomanNumeralForCentury(parseInt(century)),
      bookIds,
    }))
    .sort((a, b) => a.century - b.century);
}

// Detect language from headers
async function detectLanguage(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const country = headersList.get('x-vercel-ip-country');

  // Check if country is Portuguese-speaking
  if (
    country &&
    PORTUGUESE_SPEAKING_COUNTRIES.includes(
      country as (typeof PORTUGUESE_SPEAKING_COUNTRIES)[number],
    )
  ) {
    return 'pt-BR';
  }

  // Check accept-language header
  if (acceptLanguage) {
    if (acceptLanguage.startsWith('pt')) return 'pt-BR';
    if (acceptLanguage.startsWith('es')) return 'es';
  }

  return DEFAULT_LANGUAGE;
}

function DesktopContent({ initialLanguage }: { initialLanguage: string }) {
  const folders = getCenturyFolders();

  // For demo purposes, let's add some sample folders if none exist
  const demoFolders: CenturyFolder[] =
    folders.length > 0
      ? folders
      : [{ century: -4, romanNumeral: '-IV', bookIds: ['demo-1'] }];

  return (
    <DesktopWrapper initialLanguage={initialLanguage} folders={demoFolders} />
  );
}

export default async function HomePage() {
  const initialLanguage = await detectLanguage();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <DesktopContent initialLanguage={initialLanguage} />
    </Suspense>
  );
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;
