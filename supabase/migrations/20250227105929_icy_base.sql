/*
  # Add category field to articles table

  1. Changes
    - Add `category` column to `articles` table with default value 'technology'
    - Add check constraint to ensure category is either 'technology' or 'biology'
  
  2. Security
    - No changes to RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'category'
  ) THEN
    ALTER TABLE articles ADD COLUMN category text NOT NULL DEFAULT 'technology';
    ALTER TABLE articles ADD CONSTRAINT valid_category CHECK (category IN ('technology', 'biology'));
  END IF;
END $$;