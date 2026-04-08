ALTER TABLE users
ADD COLUMN IF NOT EXISTS contact_number TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

CREATE TABLE IF NOT EXISTS user_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  fulfillment_status TEXT NOT NULL DEFAULT 'Processing',
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  total_items INTEGER NOT NULL DEFAULT 0 CHECK (total_items >= 0),
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_user_orders_user_id_created_at
ON user_orders(user_id, created_at);

CREATE TABLE IF NOT EXISTS user_order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES user_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_slug TEXT,
  product_name TEXT NOT NULL,
  product_category TEXT,
  product_image TEXT,
  unit_price TEXT,
  unit_price_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_user_order_items_order_id
ON user_order_items(order_id);
