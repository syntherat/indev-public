ALTER TABLE products ADD COLUMN IF NOT EXISTS show_in_software BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_in_featured BOOLEAN NOT NULL DEFAULT false;

UPDATE products
SET show_in_featured = is_featured
WHERE show_in_featured = false;

CREATE INDEX IF NOT EXISTS idx_products_show_in_software ON products(show_in_software);
CREATE INDEX IF NOT EXISTS idx_products_show_in_featured ON products(show_in_featured);
