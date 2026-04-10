CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INTEGER NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  is_purchase_verified BOOLEAN NOT NULL DEFAULT false,
  admin_reply TEXT,
  reviewed_by_admin_id UUID,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  CONSTRAINT product_reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT product_reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS product_reviews_product_status_created_idx
  ON product_reviews (product_id, status, created_at);

CREATE INDEX IF NOT EXISTS product_reviews_user_product_idx
  ON product_reviews (user_id, product_id);

CREATE INDEX IF NOT EXISTS product_reviews_product_slug_idx
  ON product_reviews (product_slug);
