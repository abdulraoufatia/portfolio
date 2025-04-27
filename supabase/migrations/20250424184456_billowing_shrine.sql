/*
  # Add visibility control for articles

  1. Changes
    - Add `visible` column to articles table with default value true
    - Update RLS policies to respect visibility flag
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'visible'
  ) THEN
    ALTER TABLE articles ADD COLUMN visible boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- Update the public read policy to respect visibility
DROP POLICY IF EXISTS "Anyone can view articles" ON articles;
CREATE POLICY "Anyone can view articles"
  ON articles
  FOR SELECT
  TO public
  USING (visible = true OR auth.uid() = user_id);