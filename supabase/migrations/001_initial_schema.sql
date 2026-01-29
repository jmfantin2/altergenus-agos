-- AlterGenus Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================================
-- BOOKS TABLE
-- Stores book metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_pt_br VARCHAR(500) NOT NULL,
  title_es VARCHAR(500) NOT NULL,
  title_en_us VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_birth_year INTEGER,
  author_death_year INTEGER,
  publication_year INTEGER NOT NULL,
  century INTEGER NOT NULL, -- e.g., -4 for 4th century BC, 19 for 19th century AD
  description_pt_br TEXT,
  description_es TEXT,
  description_en_us TEXT,
  original_language VARCHAR(50) NOT NULL DEFAULT 'unknown',
  cover_icon VARCHAR(100) NOT NULL DEFAULT 'book',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for century-based queries
CREATE INDEX IF NOT EXISTS idx_books_century ON books(century);

-- ============================================================================
-- CHAPTERS TABLE
-- Stores chapter information for each book
-- ============================================================================

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title_pt_br VARCHAR(500) NOT NULL,
  title_es VARCHAR(500) NOT NULL,
  title_en_us VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- Index for book queries
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);

-- ============================================================================
-- FRAGMENTS TABLE
-- Stores individual paragraphs/fragments for each chapter
-- ============================================================================

CREATE TABLE IF NOT EXISTS fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  fragment_number INTEGER NOT NULL,
  content_pt_br TEXT NOT NULL,
  content_es TEXT NOT NULL,
  content_en_us TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, fragment_number)
);

-- Index for chapter queries
CREATE INDEX IF NOT EXISTS idx_fragments_chapter_id ON fragments(chapter_id);

-- ============================================================================
-- USERS_BOOKS TABLE
-- Tracks which books users have acquired through donation
-- ============================================================================

CREATE TABLE IF NOT EXISTS users_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  donation_value DECIMAL(10, 2) NOT NULL DEFAULT 0.44,
  donation_currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
  donation_verified BOOLEAN NOT NULL DEFAULT FALSE,
  referral VARCHAR(100), -- 'first-book-reward', referral codes, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Indexes for user book queries
CREATE INDEX IF NOT EXISTS idx_users_books_user_id ON users_books(user_id);
CREATE INDEX IF NOT EXISTS idx_users_books_book_id ON users_books(book_id);

-- ============================================================================
-- READING_PROGRESS TABLE
-- Tracks user reading progress for each book
-- ============================================================================

CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  fragment_id UUID NOT NULL REFERENCES fragments(id) ON DELETE CASCADE,
  fragment_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Indexes for progress queries
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON reading_progress(book_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Books: Public read access
CREATE POLICY "Books are publicly readable" ON books
  FOR SELECT USING (true);

-- Chapters: Public read access
CREATE POLICY "Chapters are publicly readable" ON chapters
  FOR SELECT USING (true);

-- Fragments: Public read access
CREATE POLICY "Fragments are publicly readable" ON fragments
  FOR SELECT USING (true);

-- Users_books: Users can only see and modify their own records
CREATE POLICY "Users can view own books" ON users_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books" ON users_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON users_books
  FOR UPDATE USING (auth.uid() = user_id);

-- Reading_progress: Users can only see and modify their own progress
CREATE POLICY "Users can view own progress" ON reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON reading_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- SAMPLE DATA (The Republic by Plato)
-- ============================================================================

-- Insert sample book
INSERT INTO books (
  slug,
  title_pt_br, title_es, title_en_us,
  author, author_birth_year, author_death_year,
  publication_year, century,
  description_pt_br, description_es, description_en_us,
  original_language, cover_icon
) VALUES (
  'the-republic',
  'A República', 'La República', 'The Republic',
  'Plato', -428, -348,
  -375, -4,
  'Um diálogo socrático sobre a justiça, a cidade ideal e a natureza da alma.',
  'Un diálogo socrático sobre la justicia, la ciudad ideal y la naturaleza del alma.',
  'A Socratic dialogue concerning justice, the ideal city, and the nature of the soul.',
  'Ancient Greek', 'scale'
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample chapters (first 3 chapters as example)
INSERT INTO chapters (book_id, chapter_number, title_pt_br, title_es, title_en_us)
SELECT 
  id,
  1,
  'Livro I - O Problema da Justiça',
  'Libro I - El Problema de la Justicia',
  'Book I - The Problem of Justice'
FROM books WHERE slug = 'the-republic'
ON CONFLICT (book_id, chapter_number) DO NOTHING;

INSERT INTO chapters (book_id, chapter_number, title_pt_br, title_es, title_en_us)
SELECT 
  id,
  2,
  'Livro II - A Natureza da Justiça',
  'Libro II - La Naturaleza de la Justicia',
  'Book II - The Nature of Justice'
FROM books WHERE slug = 'the-republic'
ON CONFLICT (book_id, chapter_number) DO NOTHING;

INSERT INTO chapters (book_id, chapter_number, title_pt_br, title_es, title_en_us)
SELECT 
  id,
  3,
  'Livro III - A Educação dos Guardiões',
  'Libro III - La Educación de los Guardianes',
  'Book III - The Education of the Guardians'
FROM books WHERE slug = 'the-republic'
ON CONFLICT (book_id, chapter_number) DO NOTHING;

-- Insert sample fragments for Chapter 1
WITH chapter_id AS (
  SELECT c.id 
  FROM chapters c
  JOIN books b ON c.book_id = b.id
  WHERE b.slug = 'the-republic' AND c.chapter_number = 1
  LIMIT 1
)
INSERT INTO fragments (chapter_id, fragment_number, content_pt_br, content_es, content_en_us)
SELECT 
  chapter_id.id,
  1,
  'Desci ontem ao Pireu com Gláucon, filho de Aríston, para fazer minhas orações à deusa e também porque queria ver de que modo celebrariam o festival, visto ser a primeira vez que o faziam.',
  'Bajé ayer al Pireo con Glaucón, hijo de Aristón, para orar a la diosa y también porque quería ver cómo celebrarían el festival, ya que era la primera vez que lo hacían.',
  'I went down yesterday to the Piraeus with Glaucon the son of Ariston, that I might offer up my prayers to the goddess, and also because I wanted to see in what manner they would celebrate the festival, which was a new thing.'
FROM chapter_id
ON CONFLICT (chapter_id, fragment_number) DO NOTHING;

-- Add more sample fragments...
WITH chapter_id AS (
  SELECT c.id 
  FROM chapters c
  JOIN books b ON c.book_id = b.id
  WHERE b.slug = 'the-republic' AND c.chapter_number = 1
  LIMIT 1
)
INSERT INTO fragments (chapter_id, fragment_number, content_pt_br, content_es, content_en_us)
SELECT 
  chapter_id.id,
  2,
  'Eu estava satisfeito com a procissão dos habitantes do lugar, embora a dos trácios não fosse menos esplêndida.',
  'Estaba satisfecho con la procesión de los habitantes del lugar, aunque la de los tracios no era menos espléndida.',
  'I was delighted with the procession of the inhabitants, but that of the Thracians was equally, if not more, beautiful.'
FROM chapter_id
ON CONFLICT (chapter_id, fragment_number) DO NOTHING;

WITH chapter_id AS (
  SELECT c.id 
  FROM chapters c
  JOIN books b ON c.book_id = b.id
  WHERE b.slug = 'the-republic' AND c.chapter_number = 1
  LIMIT 1
)
INSERT INTO fragments (chapter_id, fragment_number, content_pt_br, content_es, content_en_us)
SELECT 
  chapter_id.id,
  3,
  'Quando terminamos nossas orações e vimos o espetáculo, estávamos voltando para a cidade quando Polemarco, filho de Céfalo, nos avistou à distância enquanto partíamos para casa.',
  'Cuando terminamos nuestras oraciones y vimos el espectáculo, estábamos volviendo a la ciudad cuando Polemarco, hijo de Céfalo, nos vio a distancia mientras partíamos hacia casa.',
  'When we had finished our prayers and viewed the spectacle, we were starting for the city when Polemarchus the son of Cephalus caught sight of us from a distance as we were heading homeward.'
FROM chapter_id
ON CONFLICT (chapter_id, fragment_number) DO NOTHING;

-- Continue with more fragments...
