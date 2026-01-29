import { NextRequest, NextResponse } from 'next/server';
import { getFragmentsByChapterId } from '@/lib/supabase';
import { toLocalizedFragment } from '@/types';
import { cookies } from 'next/headers';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chapterId = searchParams.get('chapterId');
  const lang = searchParams.get('lang') || 'en-US';
  
  if (!chapterId) {
    return NextResponse.json(
      { error: 'chapterId is required' },
      { status: 400 }
    );
  }
  
  try {
    const fragments = await getFragmentsByChapterId(chapterId);
    
    // Localize fragments
    const localizedFragments = fragments.map((f) => 
      toLocalizedFragment(f, lang as 'pt-BR' | 'es' | 'en-US')
    );
    
    return NextResponse.json({ fragments: localizedFragments }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching fragments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fragments' },
      { status: 500 }
    );
  }
}
