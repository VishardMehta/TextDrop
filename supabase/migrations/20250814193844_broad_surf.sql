/*
  # Create shared_texts table for text sharing platform

  1. New Tables
    - `shared_texts`
      - `id` (uuid, primary key)
      - `short_key` (text, unique) - The 4-6 character unique identifier
      - `text` (text) - The shared text content
      - `created_at` (timestamptz) - When the text was shared

  2. Security
    - Enable RLS on `shared_texts` table
    - Add policy for public read access (anyone can read shared texts)
    - Add policy for public insert access (anyone can create shared texts)

  3. Indexes
    - Add unique index on short_key for fast lookups
    - Add index on created_at for potential cleanup operations
*/

CREATE TABLE IF NOT EXISTS shared_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_key text UNIQUE NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shared_texts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to shared texts
CREATE POLICY "Anyone can read shared texts"
  ON shared_texts
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access to create new shared texts
CREATE POLICY "Anyone can create shared texts"
  ON shared_texts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_shared_texts_short_key 
  ON shared_texts(short_key);

CREATE INDEX IF NOT EXISTS idx_shared_texts_created_at 
  ON shared_texts(created_at);