import { createServerSupabaseClient } from './server';
import type {
  Book,
  Chapter,
  Fragment,
  UserBook,
  ReadingProgress,
} from '@/types';
import { FREE_FRAGMENTS_LIMIT } from '@/lib/constants';

// ============================================================================
// BOOK QUERIES
// ============================================================================

export async function getBooks(): Promise<Book[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('publication_year', { ascending: true });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data || [];
}

export async function getBookById(bookId: string): Promise<Book | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (error) {
    console.error('Error fetching book:', error);
    return null;
  }

  return data;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching book by slug:', error);
    return null;
  }

  return data;
}

export async function getBooksByCentury(century: number): Promise<Book[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('century', century)
    .order('publication_year', { ascending: true });

  if (error) {
    console.error('Error fetching books by century:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// CHAPTER QUERIES
// ============================================================================

export async function getChaptersByBookId(bookId: string): Promise<Chapter[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }

  return data || [];
}

export async function getChapterById(
  chapterId: string,
): Promise<Chapter | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single();

  if (error) {
    console.error('Error fetching chapter:', error);
    return null;
  }

  return data;
}

// ============================================================================
// FRAGMENT QUERIES
// ============================================================================

export async function getFragmentsByChapterId(
  chapterId: string,
): Promise<Fragment[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('fragments')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('fragment_number', { ascending: true });

  if (error) {
    console.error('Error fetching fragments:', error);
    return [];
  }

  return data || [];
}

export async function getFragmentById(
  fragmentId: string,
): Promise<Fragment | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('fragments')
    .select('*')
    .eq('id', fragmentId)
    .single();

  if (error) {
    console.error('Error fetching fragment:', error);
    return null;
  }

  return data;
}

export async function getFragmentCountByChapterId(
  chapterId: string,
): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('fragments')
    .select('*', { count: 'exact', head: true })
    .eq('chapter_id', chapterId);

  if (error) {
    console.error('Error counting fragments:', error);
    return 0;
  }

  return count || 0;
}

// ============================================================================
// USER BOOK QUERIES
// ============================================================================

export async function getUserBooks(userId: string): Promise<UserBook[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users_books')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user books:', error);
    return [];
  }

  return data || [];
}

export async function getUserBook(
  userId: string,
  bookId: string,
): Promise<UserBook | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users_books')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error fetching user book:', error);
    return null;
  }

  return data;
}

export async function createUserBook(
  userId: string,
  bookId: string,
  donationValue: number = 0.44,
  donationCurrency: string = 'BRL',
  referral: string | null = null,
): Promise<UserBook | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users_books')
    .insert({
      user_id: userId,
      book_id: bookId,
      donation_value: donationValue,
      donation_currency: donationCurrency,
      donation_verified: false,
      referral,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user book:', error);
    return null;
  }

  return data;
}

export async function getUserBookCount(userId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('users_books')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error counting user books:', error);
    return 0;
  }

  return count || 0;
}

// ============================================================================
// READING PROGRESS QUERIES
// ============================================================================

export async function getReadingProgress(
  userId: string,
  bookId: string,
): Promise<ReadingProgress | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching reading progress:', error);
    return null;
  }

  return data;
}

export async function upsertReadingProgress(
  userId: string,
  bookId: string,
  chapterId: string,
  fragmentId: string,
  fragmentNumber: number,
): Promise<ReadingProgress | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('reading_progress')
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
        chapter_id: chapterId,
        fragment_id: fragmentId,
        fragment_number: fragmentNumber,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,book_id',
      },
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting reading progress:', error);
    return null;
  }

  return data;
}

export async function getAllReadingProgress(
  userId: string,
): Promise<ReadingProgress[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching all reading progress:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// ACCESS CONTROL
// ============================================================================

export async function countFragmentsReadInBook(
  userId: string | null,
  bookId: string,
  sessionFragmentsRead: number = 0,
): Promise<number> {
  if (!userId) {
    // For anonymous users, we rely on session storage count
    return sessionFragmentsRead;
  }

  const progress = await getReadingProgress(userId, bookId);
  return progress?.fragment_number || 0;
}

export async function canAccessFragment(
  userId: string | null,
  bookId: string,
  fragmentNumber: number,
  isChapterOne: boolean,
  sessionFragmentsRead: number = 0,
): Promise<{
  canAccess: boolean;
  reason:
    | 'free'
    | 'within_limit'
    | 'signup_required'
    | 'donation_required'
    | 'owned';
}> {
  // Check if within free limit (12 fragments, but never completing chapter 1)
  if (fragmentNumber <= FREE_FRAGMENTS_LIMIT && !isChapterOne) {
    return { canAccess: true, reason: 'free' };
  }

  // Anonymous user beyond limit
  if (!userId) {
    // For anonymous users, check session fragments read
    if (sessionFragmentsRead < FREE_FRAGMENTS_LIMIT && !isChapterOne) {
      return { canAccess: true, reason: 'within_limit' };
    }
    return { canAccess: false, reason: 'signup_required' };
  }

  // Check if user owns the book
  const userBook = await getUserBook(userId, bookId);
  if (userBook) {
    return { canAccess: true, reason: 'owned' };
  }

  // Check if this is user's first book (they get chapter 1 free after signup)
  const userBookCount = await getUserBookCount(userId);
  if (userBookCount === 0 && isChapterOne) {
    // This is their first book and it's chapter 1
    return { canAccess: true, reason: 'within_limit' };
  }

  // Beyond chapter 1 on first book, or any chapter on subsequent books
  return { canAccess: false, reason: 'donation_required' };
}
