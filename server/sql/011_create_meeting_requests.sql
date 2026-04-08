CREATE TABLE IF NOT EXISTS meeting_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  company_name text,
  timezone text NOT NULL,
  meeting_date date NOT NULL,
  meeting_time text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  message text,
  status text NOT NULL DEFAULT 'pending',
  meeting_link text,
  approved_by_admin_id uuid,
  approved_at timestamp,
  rejection_reason text,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  updated_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT meeting_requests_status_allowed CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT meeting_requests_duration_positive CHECK (duration_minutes > 0)
);

CREATE INDEX IF NOT EXISTS meeting_requests_status_created_at_index
  ON meeting_requests (status, created_at);

CREATE INDEX IF NOT EXISTS meeting_requests_client_email_index
  ON meeting_requests (client_email);
