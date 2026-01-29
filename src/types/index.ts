import type { SupportedLanguage } from '@/lib/constants';

// ============================================================================
// DATABASE TYPES (matching Supabase schema)
// ============================================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  slug: string;
  title_pt_br: string;
  title_es: string;
  title_en_us: string;
  author: string;
  author_birth_year: number | null;
  author_death_year: number | null;
  publication_year: number;
  century: number; // e.g., -4 for 4th century BC, 19 for 19th century AD
  description_pt_br: string | null;
  description_es: string | null;
  description_en_us: string | null;
  original_language: string;
  cover_icon: string; // Lucide icon name
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title_pt_br: string;
  title_es: string;
  title_en_us: string;
  created_at: string;
}

export interface Fragment {
  id: string;
  chapter_id: string;
  fragment_number: number;
  content_pt_br: string;
  content_es: string;
  content_en_us: string;
  created_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  donation_value: number;
  donation_currency: string;
  donation_verified: boolean;
  referral: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id: string;
  fragment_id: string;
  fragment_number: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FRONTEND TYPES
// ============================================================================

export interface LocalizedBook {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorBirthYear: number | null;
  authorDeathYear: number | null;
  publicationYear: number;
  century: number;
  description: string | null;
  originalLanguage: string;
  coverIcon: string;
}

export interface LocalizedChapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  fragmentCount?: number;
  isLocked?: boolean;
  progress?: ChapterProgress;
}

export interface LocalizedFragment {
  id: string;
  chapterId: string;
  fragmentNumber: number;
  content: string;
}

export interface ChapterProgress {
  completedFragments: number;
  totalFragments: number;
  lastReadFragmentId: string | null;
}

export interface BookProgress {
  bookId: string;
  chapters: Record<string, ChapterProgress>;
  lastReadChapterId: string | null;
  lastReadFragmentId: string | null;
}

// ============================================================================
// FOLDER/DESKTOP TYPES
// ============================================================================

export interface CenturyFolder {
  century: number;
  romanNumeral: string;
  bookIds: string[];
}

export interface DesktopItem {
  type: 'folder' | 'book';
  id: string;
  label: string;
  icon: string;
  position?: { x: number; y: number };
}

// ============================================================================
// ACCESS CONTROL TYPES
// ============================================================================

export type AccessLevel = 'free' | 'signup_required' | 'donation_required' | 'owned';

export interface AccessCheck {
  canRead: boolean;
  accessLevel: AccessLevel;
  fragmentsRead: number;
  isFirstBook: boolean;
  hasChapterOneReward: boolean;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface ModalState {
  type: 'auth' | 'donation' | 'error' | 'profile' | 'tableOfContents' | null;
  data?: unknown;
}

export interface ReaderState {
  bookId: string | null;
  chapterId: string | null;
  fragmentId: string | null;
  fragmentIndex: number;
  totalFragments: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLocalizedTitle(book: Book, language: SupportedLanguage): string {
  switch (language) {
    case 'pt-BR':
      return book.title_pt_br;
    case 'es':
      return book.title_es;
    case 'en-US':
      return book.title_en_us;
    default:
      return book.title_en_us;
  }
}

export function getLocalizedDescription(book: Book, language: SupportedLanguage): string | null {
  switch (language) {
    case 'pt-BR':
      return book.description_pt_br;
    case 'es':
      return book.description_es;
    case 'en-US':
      return book.description_en_us;
    default:
      return book.description_en_us;
  }
}

export function getLocalizedChapterTitle(chapter: Chapter, language: SupportedLanguage): string {
  switch (language) {
    case 'pt-BR':
      return chapter.title_pt_br;
    case 'es':
      return chapter.title_es;
    case 'en-US':
      return chapter.title_en_us;
    default:
      return chapter.title_en_us;
  }
}

export function getLocalizedContent(fragment: Fragment, language: SupportedLanguage): string {
  switch (language) {
    case 'pt-BR':
      return fragment.content_pt_br;
    case 'es':
      return fragment.content_es;
    case 'en-US':
      return fragment.content_en_us;
    default:
      return fragment.content_en_us;
  }
}

export function toLocalizedBook(book: Book, language: SupportedLanguage): LocalizedBook {
  return {
    id: book.id,
    slug: book.slug,
    title: getLocalizedTitle(book, language),
    author: book.author,
    authorBirthYear: book.author_birth_year,
    authorDeathYear: book.author_death_year,
    publicationYear: book.publication_year,
    century: book.century,
    description: getLocalizedDescription(book, language),
    originalLanguage: book.original_language,
    coverIcon: book.cover_icon,
  };
}

export function toLocalizedChapter(chapter: Chapter, language: SupportedLanguage): LocalizedChapter {
  return {
    id: chapter.id,
    bookId: chapter.book_id,
    chapterNumber: chapter.chapter_number,
    title: getLocalizedChapterTitle(chapter, language),
  };
}

export function toLocalizedFragment(fragment: Fragment, language: SupportedLanguage): LocalizedFragment {
  return {
    id: fragment.id,
    chapterId: fragment.chapter_id,
    fragmentNumber: fragment.fragment_number,
    content: getLocalizedContent(fragment, language),
  };
}
