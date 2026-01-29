import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUserBooks, getAllReadingProgress, getBookById } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user's books
    const userBooks = await getUserBooks(user.id);
    
    // Calculate total donations
    const totalDonations = userBooks.reduce((sum, ub) => sum + ub.donation_value, 0);
    
    // Get reading progress
    const progressRecords = await getAllReadingProgress(user.id);
    
    // Build reading progress with book titles
    const readingProgress: Array<{ bookTitle: string; progress: number }> = [];
    
    for (const record of progressRecords) {
      const book = await getBookById(record.book_id);
      if (book) {
        // This is a simplified progress - in production you'd calculate actual chapter/fragment progress
        readingProgress.push({
          bookTitle: book.title_en_us, // Default to English for now
          progress: Math.min(100, (record.fragment_number / 50) * 100), // Rough estimate
        });
      }
    }
    
    return NextResponse.json({
      booksOwned: userBooks.length,
      totalDonations,
      readingProgress,
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
