ALTER TABLE meeting_requests
  ADD COLUMN IF NOT EXISTS guest_emails text[] NOT NULL DEFAULT ARRAY[]::text[];
