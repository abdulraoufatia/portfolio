-- Check if the table exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'education'
  ) THEN
    CREATE TABLE education (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      institution text NOT NULL,
      degree text NOT NULL,
      field text NOT NULL,
      start_date text NOT NULL,
      end_date text NOT NULL,
      description text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      user_id uuid REFERENCES auth.users(id) NOT NULL
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'education' AND rowsecurity = true
  ) THEN
    ALTER TABLE education ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add slug column to articles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'slug'
  ) THEN
    ALTER TABLE articles ADD COLUMN slug text;
    
    -- Create a unique index on the slug column
    CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
    
    -- Update existing articles to have slugs based on their titles
    UPDATE articles 
    SET slug = LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          title, 
          '[^\w\s-]', 
          ''
        ), 
        '\s+', 
        '-'
      )
    )
    WHERE slug IS NULL;
  END IF;
END $$;