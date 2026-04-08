CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  detail TEXT NOT NULL,
  bullets TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  stat_label TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  accent TEXT NOT NULL DEFAULT 'product-accent-cyan',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  price TEXT,
  period TEXT,
  image TEXT,
  image_alt TEXT,
  href TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
