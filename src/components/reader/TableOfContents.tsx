'use client';

import { useTranslation } from '@/hooks';
import { Icon } from '@/lib/icons';
import { ProgressBar } from '@/components/ui';
import type { LocalizedChapter, ChapterProgress } from '@/types';

interface TableOfContentsProps {
  bookTitle: string;
  chapters: LocalizedChapter[];
  currentChapterId: string | null;
  progress: Record<string, ChapterProgress>;
  lockedChapters: Set<string>;
  onSelectChapter: (chapterId: string) => void;
  onClose: () => void;
}

export function TableOfContents({
  bookTitle,
  chapters,
  currentChapterId,
  progress,
  lockedChapters,
  onSelectChapter,
  onClose,
}: TableOfContentsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-ag-background border border-ag-border w-full max-w-md max-h-[80vh] flex flex-col shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ag-border bg-ag-surface shrink-0">
          <div>
            <h2 className="text-base font-sans font-medium text-ag-primary">
              {t('reader.tableOfContents')}
            </h2>
            <p className="text-xs font-sans text-ag-accent truncate">
              {bookTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-ag-primary hover:text-ag-accent transition-colors"
            aria-label="Close"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        {/* Chapter list */}
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            {chapters.map((chapter) => {
              const isLocked = lockedChapters.has(chapter.id);
              const isCurrent = chapter.id === currentChapterId;
              const chapterProgress = progress[chapter.id];
              const progressPercent = chapterProgress 
                ? (chapterProgress.completedFragments / chapterProgress.totalFragments) * 100
                : 0;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => !isLocked && onSelectChapter(chapter.id)}
                  disabled={isLocked}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-colors
                    ${isCurrent ? 'bg-ag-primary/10' : 'hover:bg-ag-surface'}
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`
                      text-sm font-sans
                      ${isCurrent ? 'font-medium text-ag-primary' : 'text-ag-primary'}
                    `}>
                      {t('reader.chapter')} {chapter.chapterNumber}
                    </span>
                    {isLocked ? (
                      <Icon name="lock" size={14} className="text-ag-accent" />
                    ) : progressPercent === 100 ? (
                      <Icon name="check" size={14} className="text-green-500" />
                    ) : null}
                  </div>
                  
                  <p className="text-xs font-sans text-ag-accent truncate mb-2">
                    {chapter.title}
                  </p>
                  
                  {!isLocked && chapterProgress && (
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={progressPercent} size="sm" className="flex-1" />
                      <span className="text-[10px] font-sans text-ag-accent">
                        {chapterProgress.completedFragments}/{chapterProgress.totalFragments}
                      </span>
                    </div>
                  )}
                  
                  {isLocked && (
                    <p className="text-[10px] font-sans text-ag-accent">
                      {t('reader.locked')}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
