const db = require("../config/db");

function parseNumericPrice(value) {
  if (!value) {
    return 0;
  }

  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function mapProfileRow(row) {
  if (!row) {
    return null;
  }

  return {
    contactNumber: row.contact_number || "",
    country: row.country || "",
    postalCode: row.postal_code || "",
  };
}

function mapOrderRows(orderRows, itemRows) {
  const itemsByOrderId = new Map();

  for (const row of itemRows) {
    const current = itemsByOrderId.get(row.order_id) || [];
    current.push({
      productId: row.product_id,
      slug: row.product_slug,
      name: row.product_name,
      category: row.product_category,
      image: row.product_image,
      price: row.unit_price,
      quantity: Number(row.quantity || 0),
      lineTotal: Number(row.line_total || 0),
      href: row.product_slug ? `/products/${row.product_slug}` : "/products",
    });
    itemsByOrderId.set(row.order_id, current);
  }

  return orderRows.map((row) => ({
    id: row.order_number,
    createdAt: row.created_at,
    fulfillmentStatus: row.fulfillment_status,
    paymentStatus: row.payment_status,
    isTestPurchase: Boolean(row.is_test_purchase),
    totalItems: Number(row.total_items || 0),
    subtotal: Number(row.subtotal || 0),
    total: Number(row.total || 0),
    items: itemsByOrderId.get(row.id) || [],
  }));
}

async function getOrderByRazorpayPaymentId(paymentId) {
  const ordersResult = await db.query(
    `
      SELECT
        id,
        order_number,
        fulfillment_status,
        payment_status,
        is_test_purchase,
        total_items,
        subtotal,
        total,
        created_at
      FROM user_orders
      WHERE razorpay_payment_id = $1
      LIMIT 1
    `,
    [paymentId]
  );

  if (ordersResult.rows.length === 0) {
    return null;
  }

  const orderRow = ordersResult.rows[0];
  const itemResult = await db.query(
    `
      SELECT
        order_id,
        product_id,
        product_slug,
        product_name,
        product_category,
        product_image,
        unit_price,
        quantity,
        line_total
      FROM user_order_items
      WHERE order_id = $1
      ORDER BY created_at ASC, id ASC
    `,
    [orderRow.id]
  );

  return mapOrderRows([orderRow], itemResult.rows)[0] || null;
}

async function getUserProfile(userId) {
  const result = await db.query(
    `
      SELECT
        contact_number,
        country,
        postal_code
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  return mapProfileRow(result.rows[0]);
}

async function updateUserProfile(userId, { contactNumber, country, postalCode }) {
  const result = await db.query(
    `
      UPDATE users
      SET
        contact_number = $2,
        country = $3,
        postal_code = $4,
        updated_at = current_timestamp
      WHERE id = $1
      RETURNING
        contact_number,
        country,
        postal_code
    `,
    [
      userId,
      contactNumber ? String(contactNumber).trim() : null,
      country ? String(country).trim() : null,
      postalCode ? String(postalCode).trim() : null,
    ]
  );

  return mapProfileRow(result.rows[0]);
}

async function createOrderFromCart(userId, items, summary, payment = {}) {
  const pool = db.pool || db;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const paymentStatus = payment.paymentStatus || (payment.razorpayPaymentId ? "Paid" : "Pending");
    const isTestPurchase = Boolean(payment.isTestPurchase ?? false);
    const orderNumber = `IND-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const orderInsert = await client.query(
      `
        INSERT INTO user_orders (
          user_id,
          order_number,
          fulfillment_status,
          payment_status,
          is_test_purchase,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          total_items,
          subtotal,
          total,
          created_at,
          updated_at
        )
        VALUES ($1, $2, 'Processing', $3, $4, $5, $6, $7, $8, $9, $10, current_timestamp, current_timestamp)
        RETURNING id, order_number
      `,
      [
        userId,
        orderNumber,
        paymentStatus,
        isTestPurchase,
        payment.razorpayOrderId || null,
        payment.razorpayPaymentId || null,
        payment.razorpaySignature || null,
        Number(summary?.itemCount || 0),
        Number(summary?.subtotal || 0),
        Number(summary?.total || summary?.subtotal || 0),
      ]
    );

    const orderId = orderInsert.rows[0].id;

    for (const item of items) {
      const quantity = Number(item?.quantity || 0);
      if (quantity <= 0) {
        continue;
      }

      const lineTotal = Number(item?.lineTotal || 0);
      const unitPriceValue = lineTotal > 0 ? lineTotal / quantity : parseNumericPrice(item?.price);

      await client.query(
        `
          INSERT INTO user_order_items (
            order_id,
            product_id,
            product_slug,
            product_name,
            product_category,
            product_image,
            unit_price,
            unit_price_value,
            quantity,
            line_total,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, current_timestamp)
        `,
        [
          orderId,
          item?.productId || null,
          item?.slug || null,
          item?.name || "Product",
          item?.category || null,
          item?.image || null,
          item?.price || null,
          unitPriceValue,
          quantity,
          lineTotal,
        ]
      );
    }

    await client.query(
      `
        DELETE FROM cart_items
        WHERE user_id = $1
      `,
      [userId]
    );

    await client.query("COMMIT");

    return {
      id: orderId,
      orderNumber: orderInsert.rows[0].order_number,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getOrdersByUserId(userId) {
  const ordersResult = await db.query(
    `
      SELECT
        id,
        order_number,
        fulfillment_status,
        payment_status,
        is_test_purchase,
        total_items,
        subtotal,
        total,
        created_at
      FROM user_orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `,
    [userId]
  );

  if (ordersResult.rows.length === 0) {
    return [];
  }

  const orderIds = ordersResult.rows.map((row) => row.id);
  const itemResult = await db.query(
    `
      SELECT
        order_id,
        product_id,
        product_slug,
        product_name,
        product_category,
        product_image,
        unit_price,
        quantity,
        line_total
      FROM user_order_items
      WHERE order_id = ANY($1::uuid[])
      ORDER BY created_at ASC, id ASC
    `,
    [orderIds]
  );

  return mapOrderRows(ordersResult.rows, itemResult.rows);
}

async function getPurchasedDownloadableProduct(userId, productId) {
  const result = await db.query(
    `
      SELECT
        p.id,
        p.download_s3_key,
        p.download_file_name,
        p.name,
        p.category
      FROM products p
      INNER JOIN user_order_items oi ON oi.product_id = p.id
      INNER JOIN user_orders o ON o.id = oi.order_id
      WHERE o.user_id = $1
        AND p.id = $2
      ORDER BY o.created_at DESC
      LIMIT 1
    `,
    [userId, productId]
  );

  if (!result.rows[0]) {
    return null;
  }

  return {
    id: result.rows[0].id,
    downloadS3Key: result.rows[0].download_s3_key,
    downloadFileName: result.rows[0].download_file_name,
    name: result.rows[0].name,
    category: result.rows[0].category,
  };
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  createOrderFromCart,
  getOrdersByUserId,
  getOrderByRazorpayPaymentId,
  getPurchasedDownloadableProduct,
};
