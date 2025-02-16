/*
  # Add password reset functionality

  1. New Tables
    - `password_reset_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `status` (text, either 'pending' or 'completed')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `password_reset_requests` table
    - Add policies for admin access
*/

-- Create password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view password reset requests"
  ON password_reset_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create password reset requests"
  ON password_reset_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own password reset requests"
  ON password_reset_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;