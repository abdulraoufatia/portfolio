/*
  # Add category to articles table

  1. Changes
    - Add category column to articles table with type text and NOT NULL constraint
    - Default category to 'technology' for existing articles
    - Add check constraint to ensure category is either 'technology' or 'biomedical'

  2. Data Migration
    - Set default category for existing articles
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'category'
  ) THEN
    ALTER TABLE articles ADD COLUMN category text NOT NULL DEFAULT 'technology';
    ALTER TABLE articles ADD CONSTRAINT valid_category CHECK (category IN ('technology', 'biomedical'));
  END IF;
END $$;