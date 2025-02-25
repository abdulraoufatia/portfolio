/*
  # Revert categories functionality

  1. Changes
    - Remove category column from articles table
    - Drop categories table
*/

-- Remove foreign key constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_article_category'
  ) THEN
    ALTER TABLE articles DROP CONSTRAINT fk_article_category;
  END IF;
END $$;

-- Drop category column from articles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'category'
  ) THEN
    ALTER TABLE articles DROP COLUMN category;
  END IF;
END $$;

-- Drop categories table if it exists
DROP TABLE IF EXISTS categories;