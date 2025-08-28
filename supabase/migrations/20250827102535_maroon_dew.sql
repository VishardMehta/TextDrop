/*
  # Add file support to TextDrop

  1. Schema Changes
    - Add `file_name` column to store original file name
    - Add `file_size` column to store file size in bytes
    - Add `content_type` column to store MIME type
    - Add `is_file` column to distinguish between text and file entries
    - Modify `content` column to store file data as base64 for files

  2. Security
    - Update existing RLS policies to work with new columns
    - Maintain existing security model

  3. Indexes
    - Add index on `is_file` column for efficient filtering
*/

-- Add new columns to support file sharing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN file_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN file_size bigint;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN content_type text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_texts' AND column_name = 'is_file'
  ) THEN
    ALTER TABLE shared_texts ADD COLUMN is_file boolean DEFAULT false;
  END IF;
END $$;

-- Add index for efficient file/text filtering
CREATE INDEX IF NOT EXISTS idx_shared_texts_is_file ON shared_texts (is_file);