import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createUserBook, getUserBookCount } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { bookId } = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { error: 'bookId is required' },
        { status: 400 }
      );
    }
    
    // Check if this is indeed the user's first book
    const bookCount = await getUserBookCount(user.id);
    
    if (bookCount > 0) {
      return NextResponse.json(
        { error: 'User already has books' },
        { status: 400 }
      );
    }
    
    // Grant the first book for free (chapter 1 only marked as owned)
    const userBook = await createUserBook(
      user.id,
      bookId,
      0, // Free
      'BRL',
      'first-book-reward'
    );
    
    if (!userBook) {
      return NextResponse.json(
        { error: 'Failed to create user book' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, userBook });
  } catch (error) {
    console.error('Error rewarding first book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
