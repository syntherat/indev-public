ALTER TABLE products
ADD COLUMN IF NOT EXISTS download_s3_key TEXT,
ADD COLUMN IF NOT EXISTS download_file_name TEXT;
