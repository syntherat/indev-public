CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  reply_subject text,
  reply_body text,
  replied_by_admin_id uuid,
  replied_at timestamp,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  updated_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT contact_messages_status_allowed CHECK (status IN ('new', 'read', 'replied', 'archived'))
);

CREATE INDEX IF NOT EXISTS contact_messages_status_created_at_idx
  ON contact_messages (status, created_at);

CREATE INDEX IF NOT EXISTS contact_messages_client_email_idx
  ON contact_messages (client_email);