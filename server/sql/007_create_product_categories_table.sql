CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product_categories (name)
SELECT DISTINCT category
FROM products
WHERE category IS NOT NULL
  AND category <> ''
ON CONFLICT (name) DO NOTHING;
