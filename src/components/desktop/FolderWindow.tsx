'use client';

import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/hooks';
import { Window } from '@/components/ui';
import { BookIcon } from './BookIcon';
import { formatCenturyLabel } from '@/lib/books';
import type { LocalizedBook } from '@/types';

interface FolderWindowProps {
  century: number;
  books: LocalizedBook[];
}

export function FolderWindow({ century, books }: FolderWindowProps) {
  const { t } = useTranslation();
  const closeWindow = useAppStore((state) => state.closeWindow);
  const openBook = useAppStore((state) => state.openBook);
  
  const title = formatCenturyLabel(century);
  
  const handleOpenBook = (bookId: string) => {
    openBook(bookId);
  };
  
  return (
    <Window title={title} onClose={closeWindow}>
      {books.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-ag-accent font-sans">
          {t('desktop.emptyFolder')}
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {books.map((book) => (
              <BookIcon
                key={book.id}
                book={book}
                onClick={() => handleOpenBook(book.id)}
                onDoubleClick={() => handleOpenBook(book.id)}
              />
            ))}
          </div>
        </div>
      )}
    </Window>
  );
}
