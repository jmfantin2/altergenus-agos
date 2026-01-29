import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUserBook, getUserBookCount } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        owns: false,
        isFirstBook: true,
        hasReward: false,
      });
    }
    
    const userBook = await getUserBook(user.id, bookId);
    const bookCount = await getUserBookCount(user.id);
    
    return NextResponse.json({
      owns: !!userBook,
      isFirstBook: bookCount === 0 || (bookCount === 1 && !!userBook),
      hasReward: userBook?.referral === 'first-book-reward',
    });
  } catch (error) {
    console.error('Error checking ownership:', error);
    return NextResponse.json(
      { error: 'Failed to check ownership' },
      { status: 500 }
    );
  }
}
