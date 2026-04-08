CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  detail text NOT NULL,
  bullets text[] NOT NULL DEFAULT ARRAY[]::text[],
  stat_label text NOT NULL,
  stat_value text NOT NULL,
  accent text NOT NULL DEFAULT 'product-accent-cyan',
  is_featured boolean NOT NULL DEFAULT false,
  price text,
  period text,
  image text,
  image_alt text,
  href text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS products_display_order_idx ON products (display_order);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products (is_featured);
