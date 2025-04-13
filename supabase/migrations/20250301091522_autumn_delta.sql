/*
  # Create education table

  1. New Tables
    - `education`
      - `id` (uuid, primary key)
      - `institution` (text)
      - `degree` (text)
      - `field` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)
  2. Security
    - Enable RLS on `education` table
    - Add policies for public read access
    - Add policies for authenticated users to create/update/delete their own records
*/

CREATE TABLE IF NOT EXISTS education (
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

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view education"
  ON education
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create education"
  ON education
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education"
  ON education
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education"
  ON education
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);