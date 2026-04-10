const db = require("../config/db");

function mapPublicReviewRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    productId: row.product_id,
    productSlug: row.product_slug,
    authorName: row.user_name,
    authorEmail: row.user_email,
    rating: Number(row.rating || 0),
    title: row.title || "",
    body: row.body || "",
    status: row.status,
    purchaseVerified: Boolean(row.is_purchase_verified),
    adminReply: row.admin_reply || "",
    reviewedAt: row.reviewed_at || null,
    createdAt: row.created_at,
  };
}

function mapAdminReviewRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    productId: row.product_id,
    productSlug: row.product_slug,
    productName: row.product_name,
    productCategory: row.product_category,
    productImage: row.product_image,
    userId: row.user_id,
    authorName: row.user_name,
    authorEmail: row.user_email,
    rating: Number(row.rating || 0),
    title: row.title || "",
    body: row.body || "",
    status: row.status,
    purchaseVerified: Boolean(row.is_purchase_verified),
    adminReply: row.admin_reply || "",
    reviewedByAdminId: row.reviewed_by_admin_id || null,
    reviewedAt: row.reviewed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getProductBySlug(slug) {
  const result = await db.query(
    `
      SELECT id, slug
      FROM products
      WHERE slug = $1 OR regexp_replace(COALESCE(href, ''), '^.*/', '') = $1
      LIMIT 1
    `,
    [slug]
  );

  return result.rows[0] || null;
}

async function hasUserPurchasedProduct(userId, productId) {
  const result = await db.query(
    `
      SELECT EXISTS(
        SELECT 1
        FROM user_orders o
        INNER JOIN user_order_items oi ON oi.order_id = o.id
        WHERE o.user_id = $1
          AND oi.product_id = $2
      ) AS purchased
    `,
    [userId, productId]
  );

  return Boolean(result.rows[0]?.purchased);
}

async function createReview({ productId, productSlug, userId, userName, userEmail, rating, title, body, purchaseVerified }) {
  const result = await db.query(
    `
      INSERT INTO product_reviews (
        product_id,
        product_slug,
        user_id,
        user_name,
        user_email,
        rating,
        title,
        body,
        status,
        is_purchase_verified,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, current_timestamp, current_timestamp)
      RETURNING *
    `,
    [
      productId,
      productSlug,
      userId || null,
      userName,
      userEmail || null,
      rating,
      title || null,
      body,
      Boolean(purchaseVerified),
    ]
  );

  return mapPublicReviewRow(result.rows[0]);
}

async function listApprovedReviewsBySlug(slug) {
  const result = await db.query(
    `
      SELECT
        r.*
      FROM product_reviews r
      INNER JOIN products p ON p.id = r.product_id
      WHERE (p.slug = $1 OR regexp_replace(COALESCE(p.href, ''), '^.*/', '') = $1)
        AND r.status = 'approved'
      ORDER BY COALESCE(r.reviewed_at, r.created_at) DESC, r.created_at DESC
    `,
    [slug]
  );

  return result.rows.map(mapPublicReviewRow);
}

async function listReviewsForAdmin({ status } = {}) {
  const values = [];
  let whereSql = "";

  if (status) {
    values.push(status);
    whereSql = `WHERE r.status = $${values.length}`;
  }

  const result = await db.query(
    `
      SELECT
        r.*,
        p.name AS product_name,
        p.category AS product_category,
        p.image AS product_image
      FROM product_reviews r
      INNER JOIN products p ON p.id = r.product_id
      ${whereSql}
      ORDER BY
        CASE r.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 WHEN 'rejected' THEN 2 ELSE 3 END,
        r.created_at DESC
      LIMIT 300
    `,
    values
  );

  return result.rows.map(mapAdminReviewRow);
}

async function getReviewById(id) {
  const result = await db.query(
    `
      SELECT
        r.*,
        p.name AS product_name,
        p.category AS product_category,
        p.image AS product_image
      FROM product_reviews r
      INNER JOIN products p ON p.id = r.product_id
      WHERE r.id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] ? mapAdminReviewRow(result.rows[0]) : null;
}

async function updateReviewStatus(id, { status, adminReply, reviewedByAdminId, purchaseVerified }) {
  const result = await db.query(
    `
      UPDATE product_reviews
      SET
        status = $2,
        admin_reply = $3,
        reviewed_by_admin_id = $4,
        reviewed_at = current_timestamp,
        is_purchase_verified = COALESCE($5, is_purchase_verified),
        updated_at = current_timestamp
      WHERE id = $1
      RETURNING *
    `,
    [id, status, adminReply || null, reviewedByAdminId || null, typeof purchaseVerified === "boolean" ? purchaseVerified : null]
  );

  return result.rows[0] ? mapPublicReviewRow(result.rows[0]) : null;
}

module.exports = {
  getProductBySlug,
  hasUserPurchasedProduct,
  createReview,
  listApprovedReviewsBySlug,
  listReviewsForAdmin,
  getReviewById,
  updateReviewStatus,
};
