import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createUserBook, getUserBook } from '@/lib/supabase';
import { DONATION_CONFIG } from '@/lib/constants';

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
    
    const { bookId, donationValue, donationCurrency } = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { error: 'bookId is required' },
        { status: 400 }
      );
    }
    
    // Check if user already owns the book
    const existingUserBook = await getUserBook(user.id, bookId);
    
    if (existingUserBook) {
      return NextResponse.json(
        { error: 'User already owns this book' },
        { status: 400 }
      );
    }
    
    // Create user book with donation (honor system for now)
    const userBook = await createUserBook(
      user.id,
      bookId,
      donationValue || DONATION_CONFIG.defaultValue,
      donationCurrency || DONATION_CONFIG.defaultCurrency,
      null // No referral for now
    );
    
    if (!userBook) {
      return NextResponse.json(
        { error: 'Failed to record donation' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, userBook });
  } catch (error) {
    console.error('Error recording donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
