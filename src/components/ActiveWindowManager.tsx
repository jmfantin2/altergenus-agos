'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/hooks';
import { FolderWindow } from '@/components/desktop';
import { BookReader } from '@/components/reader';
import { LoadingOverlay } from '@/components/ui';
import { toLocalizedBook, toLocalizedChapter } from '@/types';
import type { Book, Chapter, LocalizedBook, LocalizedChapter } from '@/types';

export function ActiveWindowManager() {
  const { language } = useTranslation();
  const activeWindow = useAppStore((state) => state.activeWindow);
  const closeWindow = useAppStore((state) => state.closeWindow);
  const user = useAppStore((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<LocalizedBook[]>([]);
  const [bookData, setBookData] = useState<{
    book: LocalizedBook;
    chapters: LocalizedChapter[];
    userOwnsBook: boolean;
    isFirstBook: boolean;
    hasChapterOneReward: boolean;
  } | null>(null);
  
  // Fetch folder contents
  useEffect(() => {
    async function fetchFolderBooks() {
      if (activeWindow.type !== 'folder' || !activeWindow.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/books?century=${activeWindow.id}&lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          const localizedBooks = data.books.map((b: Book) => toLocalizedBook(b, language));
          setBooks(localizedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (activeWindow.type === 'folder') {
      fetchFolderBooks();
    }
  }, [activeWindow.type, activeWindow.id, language]);
  
  // Fetch book data
  useEffect(() => {
    async function fetchBookData() {
      if (activeWindow.type !== 'book' || !activeWindow.id) return;
      
      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await fetch(`/api/books/${activeWindow.id}?lang=${language}`);
        if (!bookResponse.ok) throw new Error('Failed to fetch book');
        
        const { book, chapters } = await bookResponse.json();
        
        // Check ownership
        let userOwnsBook = false;
        let isFirstBook = true;
        let hasChapterOneReward = false;
        
        if (user) {
          const ownershipResponse = await fetch(`/api/books/${activeWindow.id}/ownership`);
          if (ownershipResponse.ok) {
            const ownershipData = await ownershipResponse.json();
            userOwnsBook = ownershipData.owns;
            isFirstBook = ownershipData.isFirstBook;
            hasChapterOneReward = ownershipData.hasReward;
          }
        }
        
        setBookData({
          book: toLocalizedBook(book, language),
          chapters: chapters.map((c: Chapter) => toLocalizedChapter(c, language)),
          userOwnsBook,
          isFirstBook,
          hasChapterOneReward,
        });
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (activeWindow.type === 'book') {
      fetchBookData();
    } else {
      setBookData(null);
    }
  }, [activeWindow.type, activeWindow.id, language, user]);
  
  // Render nothing if no active window
  if (!activeWindow.type || !activeWindow.id) return null;
  
  // Loading state
  if (loading) {
    return <LoadingOverlay />;
  }
  
  // Render folder window
  if (activeWindow.type === 'folder') {
    return (
      <FolderWindow
        century={parseInt(activeWindow.id)}
        books={books}
      />
    );
  }
  
  // Render book reader
  if (activeWindow.type === 'book' && bookData) {
    return (
      <BookReader
        book={bookData.book}
        chapters={bookData.chapters}
        onClose={closeWindow}
        userOwnsBook={bookData.userOwnsBook}
        isFirstBook={bookData.isFirstBook}
        hasChapterOneReward={bookData.hasChapterOneReward}
      />
    );
  }
  
  return null;
}
