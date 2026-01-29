// src/components/reader/BookReader.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation, useModal } from '@/hooks';
import { FREE_FRAGMENTS_LIMIT } from '@/lib/constants';
import { LoadingOverlay } from '@/components/ui';
import { FragmentReader } from './FragmentReader';
import { TableOfContents } from './TableOfContents';
import type {
  LocalizedBook,
  LocalizedChapter,
  LocalizedFragment,
  ChapterProgress,
} from '@/types';

interface BookReaderProps {
  book: LocalizedBook;
  chapters: LocalizedChapter[];
  onClose: () => void;
  // Server-fetched data
  initialChapterId?: string;
  initialFragmentIndex?: number;
  // Access control
  userOwnsBook: boolean;
  isFirstBook: boolean;
  hasChapterOneReward: boolean;
}

export function BookReader({
  book,
  chapters,
  onClose,
  initialChapterId,
  initialFragmentIndex = 0,
  userOwnsBook,
  isFirstBook,
  hasChapterOneReward,
}: BookReaderProps) {
  const { t, language } = useTranslation();
  const { openModal } = useModal();
  const user = useAppStore((state) => state.user);
  const sessionFragmentsRead = useAppStore(
    (state) => state.sessionFragmentsRead,
  );
  const incrementSessionFragments = useAppStore(
    (state) => state.incrementSessionFragments,
  );

  // State
  const [currentChapterId, setCurrentChapterId] = useState<string>(
    initialChapterId || chapters[0]?.id || '',
  );
  const [currentFragmentIndex, setCurrentFragmentIndex] =
    useState(initialFragmentIndex);
  const [fragments, setFragments] = useState<LocalizedFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [chapterProgress, setChapterProgress] = useState<
    Record<string, ChapterProgress>
  >({});

  // Calculate total fragments read in this book (session-based for anonymous)
  const fragmentsReadInBook = sessionFragmentsRead[book.id] || 0;

  // Current chapter
  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const currentChapterNumber = currentChapter?.chapterNumber || 1;
  const isChapterOne = currentChapterNumber === 1;

  // Determine which chapters are locked
  const getLockedChapters = useCallback((): Set<string> => {
    const locked = new Set<string>();

    // If user owns the book, nothing is locked
    if (userOwnsBook) return locked;

    // Check each chapter
    for (const chapter of chapters) {
      const chapterNum = chapter.chapterNumber;

      if (chapterNum === 1) {
        // Chapter 1 logic
        if (fragmentsReadInBook >= FREE_FRAGMENTS_LIMIT) {
          // Past free limit
          if (!user) {
            // Not logged in - chapter 1 locked until signup
            // Actually, they can read up to 12 fragments, but not complete chapter 1
            // So chapter 1 is accessible but won't complete
          } else if (isFirstBook && hasChapterOneReward) {
            // Logged in, first book, has reward - chapter 1 unlocked
          } else if (!isFirstBook) {
            // Not first book - needs donation
            locked.add(chapter.id);
          }
        }
      } else {
        // Chapters 2+ always require ownership (donation)
        if (!userOwnsBook) {
          locked.add(chapter.id);
        }
      }
    }

    return locked;
  }, [
    userOwnsBook,
    user,
    isFirstBook,
    hasChapterOneReward,
    chapters,
    fragmentsReadInBook,
  ]);

  const lockedChapters = getLockedChapters();

  // Fetch fragments for current chapter (re-fetches when language changes)
  useEffect(() => {
    async function fetchFragments() {
      if (!currentChapterId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/books/fragments?chapterId=${currentChapterId}&lang=${language}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFragments(data.fragments);
        }
      } catch (error) {
        console.error('Error fetching fragments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFragments();
  }, [currentChapterId, language]);

  // Check access when navigating to next fragment
  const checkAccessAndNavigate = useCallback(
    (nextIndex: number) => {
      const totalFragmentsRead = fragmentsReadInBook + 1;

      // Check if we're past the free limit
      if (totalFragmentsRead > FREE_FRAGMENTS_LIMIT && !userOwnsBook) {
        if (!user) {
          // Not logged in - prompt to sign up
          openModal('auth', {
            mode: 'signup',
            reward: isFirstBook,
            bookId: book.id,
          });
          return false;
        } else if (isChapterOne && isFirstBook && hasChapterOneReward) {
          // Logged in, first book, chapter 1 - can continue
          return true;
        } else {
          // Needs donation
          openModal('donation', { bookId: book.id });
          return false;
        }
      }

      return true;
    },
    [
      fragmentsReadInBook,
      userOwnsBook,
      user,
      isFirstBook,
      isChapterOne,
      hasChapterOneReward,
      openModal,
      book.id,
    ],
  );

  // Handle navigation
  const handleNext = useCallback(() => {
    if (currentFragmentIndex < fragments.length - 1) {
      if (checkAccessAndNavigate(currentFragmentIndex + 1)) {
        setCurrentFragmentIndex((prev) => prev + 1);
        incrementSessionFragments(book.id);

        // Update progress on server if logged in
        if (user) {
          fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookId: book.id,
              chapterId: currentChapterId,
              fragmentId: fragments[currentFragmentIndex + 1]?.id,
              fragmentNumber: currentFragmentIndex + 2,
            }),
          });
        }
      }
    } else {
      // End of chapter - check if next chapter is available
      const currentChapterIdx = chapters.findIndex(
        (c) => c.id === currentChapterId,
      );
      if (currentChapterIdx < chapters.length - 1) {
        const nextChapter = chapters[currentChapterIdx + 1];
        if (!lockedChapters.has(nextChapter.id)) {
          setCurrentChapterId(nextChapter.id);
          setCurrentFragmentIndex(0);
        } else {
          // Chapter locked - show donation modal
          openModal('donation', { bookId: book.id });
        }
      }
    }
  }, [
    currentFragmentIndex,
    fragments,
    checkAccessAndNavigate,
    incrementSessionFragments,
    book.id,
    user,
    currentChapterId,
    chapters,
    lockedChapters,
    openModal,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentFragmentIndex > 0) {
      setCurrentFragmentIndex((prev) => prev - 1);
    } else {
      // Beginning of chapter - go to previous chapter
      const currentChapterIdx = chapters.findIndex(
        (c) => c.id === currentChapterId,
      );
      if (currentChapterIdx > 0) {
        const prevChapter = chapters[currentChapterIdx - 1];
        setCurrentChapterId(prevChapter.id);
        // Will need to set to last fragment of that chapter after fetch
        setCurrentFragmentIndex(-1); // Special marker
      }
    }
  }, [currentFragmentIndex, chapters, currentChapterId]);

  // Handle going to previous chapter's last fragment
  useEffect(() => {
    if (currentFragmentIndex === -1 && fragments.length > 0) {
      setCurrentFragmentIndex(fragments.length - 1);
    }
  }, [currentFragmentIndex, fragments.length]);

  const handleSelectChapter = useCallback(
    (chapterId: string) => {
      if (!lockedChapters.has(chapterId)) {
        setCurrentChapterId(chapterId);
        setCurrentFragmentIndex(0);
        setShowTOC(false);
      }
    },
    [lockedChapters],
  );

  if (loading || !currentChapter) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <FragmentReader
        chapter={{
          ...currentChapter,
          fragmentCount: fragments.length,
        }}
        fragments={fragments}
        currentIndex={Math.max(0, currentFragmentIndex)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={onClose}
        onOpenTOC={() => setShowTOC(true)}
      />

      {showTOC && (
        <TableOfContents
          bookTitle={book.title}
          chapters={chapters}
          currentChapterId={currentChapterId}
          progress={chapterProgress}
          lockedChapters={lockedChapters}
          onSelectChapter={handleSelectChapter}
          onClose={() => setShowTOC(false)}
        />
      )}
    </>
  );
}
