ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) NOT NULL DEFAULT 4.5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pricing_type TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_source TEXT NOT NULL DEFAULT 'link';

UPDATE products
SET pricing_type = CASE
  WHEN period ILIKE '%year%' OR period ILIKE '%annual%' THEN 'annually'
  WHEN period ILIKE '%one%' OR period ILIKE '%project%' THEN 'one-time'
  ELSE 'monthly'
END,
rating = COALESCE(rating, 4.5),
image_source = COALESCE(image_source, 'link'),
is_best_seller = COALESCE(is_best_seller, false);