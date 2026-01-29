import { NextRequest, NextResponse } from 'next/server';
import { getBooksByCentury, getBooks } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const century = searchParams.get('century');

  try {
    let books;

    if (century) {
      console.log('Fetching books for century:', century);
      books = await getBooksByCentury(parseInt(century));
      console.log('Found books:', books?.length || 0);
    } else {
      books = await getBooks();
    }

    return NextResponse.json(
      { books },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch books',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
