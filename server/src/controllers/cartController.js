const asyncHandler = require("../utils/asyncHandler");
const crypto = require("crypto");
const cartModel = require("../models/cartModel");
const accountModel = require("../models/accountModel");
const env = require("../config/env");
const { sendPurchaseInvoiceEmail } = require("../utils/purchaseInvoiceEmails");

function getCheckoutSummary(items) {
  const summary = cartModel.summarizeCart(items);
  const total = Number(summary.subtotal || 0);

  return {
    ...summary,
    total,
  };
}

async function createRazorpayOrder({ amountInPaise, receipt, notes }) {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error?.description || payload?.message || "Unable to create Razorpay order");
    error.statusCode = 500;
    error.data = payload;
    throw error;
  }

  return payload;
}

async function fetchRazorpayOrder(razorpayOrderId) {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString("base64")}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error?.description || payload?.message || "Unable to fetch Razorpay order");
    error.statusCode = 500;
    error.data = payload;
    throw error;
  }

  return payload;
}

function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!env.razorpayKeySecret) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const actualBuffer = Buffer.from(String(razorpaySignature || ""));
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }
}

function sendCart(res, items) {
  return res.status(200).json({
    success: true,
    data: {
      items,
      summary: cartModel.summarizeCart(items),
    },
  });
}

const getCart = asyncHandler(async (req, res) => {
  const items = await cartModel.getCartItems(req.user.id);
  return sendCart(res, items);
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, slug, quantity } = req.body || {};

  const items = await cartModel.addOrIncrementItem(req.user.id, {
    productId,
    slug,
    quantity,
  });

  return sendCart(res, items);
});

const updateItem = asyncHandler(async (req, res) => {
  const items = await cartModel.setItemQuantity(req.user.id, req.params.productId, req.body?.quantity);
  return sendCart(res, items);
});

const deleteItem = asyncHandler(async (req, res) => {
  const items = await cartModel.removeItem(req.user.id, req.params.productId);
  return sendCart(res, items);
});

const checkout = asyncHandler(async (req, res) => {
  const items = await cartModel.getCartItems(req.user.id);

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  await cartModel.ensureCartIsPurchasable(req.user.id, items);

  const summary = getCheckoutSummary(items);
  const amountInPaise = Math.max(1, Math.round(summary.total * 100));
  const receipt = `IND-${Date.now()}-${req.user.id.slice(0, 8)}`;
  const razorpayOrder = await createRazorpayOrder({
    amountInPaise,
    receipt,
    notes: {
      userId: req.user.id,
      itemCount: String(summary.itemCount),
    },
  });

  return res.status(200).json({
    success: true,
    data: {
      razorpay: {
        keyId: env.razorpayKeyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Indev Digital",
        description: "Secure checkout",
        prefill: {
          name: req.user?.name || req.user?.displayName || "",
          email: req.user?.email || "",
        },
        notes: {
          receipt,
        },
      },
      redirectUrl: "/checkout/success",
      summary,
      purchasedItems: items,
    },
  });
});

const verifyCheckout = asyncHandler(async (req, res) => {
  const { razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature } =
    req.body || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Missing payment verification details",
    });
  }

  verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

  const existingOrder = await accountModel.getOrderByRazorpayPaymentId(razorpayPaymentId);

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      data: {
        order: {
          orderNumber: existingOrder.id,
          paymentStatus: existingOrder.paymentStatus,
        },
        purchasedItems: existingOrder.items,
        checkedOutAt: existingOrder.createdAt,
        redirectUrl: "/checkout/success",
      },
    });
  }

  const items = await cartModel.getCartItems(req.user.id);

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  await cartModel.ensureCartIsPurchasable(req.user.id, items);

  const summary = getCheckoutSummary(items);
  const razorpayOrder = await fetchRazorpayOrder(razorpayOrderId);
  const expectedAmount = Math.max(1, Math.round(summary.total * 100));

  if (Number(razorpayOrder.amount || 0) !== expectedAmount) {
    return res.status(400).json({
      success: false,
      message: "Cart total changed before payment verification. Please checkout again.",
    });
  }

  const order = await accountModel.createOrderFromCart(req.user.id, items, summary, {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentStatus: "Paid",
    isTestPurchase: false,
  });

  try {
    await sendPurchaseInvoiceEmail({
      customerEmail: req.user?.email,
      customerName: req.user?.name || req.user?.displayName || "Customer",
      orderNumber: order?.orderNumber,
      paymentId: razorpayPaymentId,
      checkedOutAt: new Date().toISOString(),
      items,
      summary,
    });
  } catch (error) {
    console.error("Failed to send purchase invoice email", error);
  }

  return res.status(200).json({
    success: true,
    data: {
      order,
      purchasedItems: items,
      checkedOutAt: new Date().toISOString(),
      redirectUrl: "/checkout/success",
    },
  });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  deleteItem,
  checkout,
  verifyCheckout,
};