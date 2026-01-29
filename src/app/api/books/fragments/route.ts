// src/app/api/books/fragments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFragmentsByChapterId } from '@/lib/supabase';
import { toLocalizedFragment } from '@/types';

export const revalidate = 0; // Desabilita cache
export const dynamic = 'force-dynamic'; // Força rota dinâmica

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chapterId = searchParams.get('chapterId');
  const lang = searchParams.get('lang') || 'en-US';

  if (!chapterId) {
    return NextResponse.json(
      { error: 'chapterId is required' },
      { status: 400 },
    );
  }

  try {
    const fragments = await getFragmentsByChapterId(chapterId);

    // Localize fragments
    const localizedFragments = fragments.map((f) =>
      toLocalizedFragment(f, lang as 'pt-BR' | 'es' | 'en-US'),
    );

    return NextResponse.json({ fragments: localizedFragments });
  } catch (error) {
    console.error('Error fetching fragments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fragments' },
      { status: 500 },
    );
  }
}
