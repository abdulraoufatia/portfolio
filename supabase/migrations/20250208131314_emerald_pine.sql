/*
  # Add experiences table

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `company` (text)
      - `position` (text)
      - `period` (text)
      - `description` (text)
      - `technologies` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `experiences` table
    - Add policies for:
      - Public read access
      - Authenticated users can create experiences
      - Users can update their own experiences
      - Users can delete their own experiences
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  period text NOT NULL,
  description text NOT NULL,
  technologies text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view experiences"
  ON experiences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create experiences"
  ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences"
  ON experiences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences"
  ON experiences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);