/*
  # Add education table policies

  This migration adds additional policies to the education table if they don't already exist.
  The table itself is created in a previous migration.
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Check for "Anyone can view education" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' AND policyname = 'Anyone can view education'
  ) THEN
    CREATE POLICY "Anyone can view education"
      ON education
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check for "Authenticated users can create education" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' AND policyname = 'Authenticated users can create education'
  ) THEN
    CREATE POLICY "Authenticated users can create education"
      ON education
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check for "Users can update their own education" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' AND policyname = 'Users can update their own education'
  ) THEN
    CREATE POLICY "Users can update their own education"
      ON education
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check for "Users can delete their own education" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'education' AND policyname = 'Users can delete their own education'
  ) THEN
    CREATE POLICY "Users can delete their own education"
      ON education
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;