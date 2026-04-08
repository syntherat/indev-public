const db = require("../config/db");

function mapCartRow(row) {
  return {
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    price: row.price,
    period: row.period,
    image: row.image,
    imageAlt: row.image_alt,
    href: row.href,
    quantity: Number(row.quantity || 0),
    lineTotal: Number(row.line_total || 0),
  };
}

function parseNumericPrice(value) {
  if (!value) {
    return 0;
  }

  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

async function findProductByInput({ productId, slug }) {
  if (productId) {
    const byId = await db.query(
      `
        SELECT id, slug
        FROM products
        WHERE id = $1
        LIMIT 1
      `,
      [productId]
    );

    if (byId.rows[0]) {
      return byId.rows[0];
    }
  }

  if (slug) {
    const bySlug = await db.query(
      `
        SELECT id, slug
        FROM products
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (bySlug.rows[0]) {
      return bySlug.rows[0];
    }
  }

  return null;
}

async function getPurchasedProductIds(userId) {
  const result = await db.query(
    `
      SELECT DISTINCT oi.product_id
      FROM user_order_items oi
      INNER JOIN user_orders o ON o.id = oi.order_id
      WHERE o.user_id = $1
        AND oi.product_id IS NOT NULL
    `,
    [userId]
  );

  return new Set(result.rows.map((row) => row.product_id));
}

async function assertProductIsPurchasable(userId, productId) {
  const purchasedIds = await getPurchasedProductIds(userId);

  if (purchasedIds.has(productId)) {
    const error = new Error("This product is already in your library");
    error.statusCode = 409;
    throw error;
  }
}

async function getCartItems(userId) {
  const result = await db.query(
    `
      SELECT
        ci.product_id,
        ci.quantity,
        p.slug,
        p.name,
        p.category,
        p.description,
        p.price,
        p.period,
        p.image,
        p.image_alt,
        p.href
      FROM cart_items ci
      INNER JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      ORDER BY ci.updated_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => {
    const priceNumeric = parseNumericPrice(row.price);
    return mapCartRow({
      ...row,
      line_total: priceNumeric * Number(row.quantity || 0),
    });
  });
}

async function addOrIncrementItem(userId, { productId, slug, quantity = 1 }) {
  const product = await findProductByInput({ productId, slug });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await assertProductIsPurchasable(userId, product.id);

  const qty = 1;

  await db.query(
    `
      INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at)
      VALUES ($1, $2, $3, current_timestamp, current_timestamp)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET
        quantity = 1,
        updated_at = current_timestamp
    `,
    [userId, product.id, qty]
  );

  return getCartItems(userId);
}

async function setItemQuantity(userId, productId, quantity) {
  const qty = Number.isFinite(Number(quantity)) ? Math.floor(Number(quantity)) : 0;

  if (qty <= 0) {
    await db.query(
      `
        DELETE FROM cart_items
        WHERE user_id = $1 AND product_id = $2
      `,
      [userId, productId]
    );
    return getCartItems(userId);
  }

  await db.query(
    `
      UPDATE cart_items
      SET quantity = $3,
          updated_at = current_timestamp
      WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId, 1]
  );

  return getCartItems(userId);
}

async function removeItem(userId, productId) {
  await db.query(
    `
      DELETE FROM cart_items
      WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId]
  );

  return getCartItems(userId);
}

async function clearCart(userId) {
  await db.query(
    `
      DELETE FROM cart_items
      WHERE user_id = $1
    `,
    [userId]
  );
}

async function ensureCartIsPurchasable(userId, items) {
  const purchasedIds = await getPurchasedProductIds(userId);
  const blockedItem = items.find((item) => item?.productId && purchasedIds.has(item.productId));

  if (blockedItem) {
    const error = new Error("One or more cart items are already in your library");
    error.statusCode = 409;
    throw error;
  }
}

function summarizeCart(items) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    itemCount,
    subtotal,
  };
}

module.exports = {
  getCartItems,
  addOrIncrementItem,
  setItemQuantity,
  removeItem,
  clearCart,
  summarizeCart,
  getPurchasedProductIds,
  ensureCartIsPurchasable,
};