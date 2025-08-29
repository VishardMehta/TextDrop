/*
  # Add file support to shared_texts table

  1. Database Changes
    - Add `file_name` column for storing original file names
    - Add `file_size` column for tracking file sizes
    - Add `content_type` column for MIME type storage
    - Add `is_file` column to distinguish between text and file content

  2. Indexes
    - Add index on `is_file` column for efficient filtering
    - Add index on `created_at` for cleanup operations
    - Add index on `expires_at` for expiration handling

  3. Security
    - Maintain existing RLS policies
    - Ensure public can still read and insert content
*/

-- Add file-related columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN file_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN file_size bigint;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN content_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'is_file'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN is_file boolean DEFAULT false;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shared_texts_is_file ON shared_texts (is_file);
CREATE INDEX IF NOT EXISTS idx_shared_texts_created_at ON shared_texts (created_at);
CREATE INDEX IF NOT EXISTS idx_shared_texts_expires_at ON shared_texts (expires_at);
CREATE INDEX IF NOT EXISTS idx_shared_texts_short_key ON shared_texts (short_key);