const asyncHandler = require("../utils/asyncHandler");
const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");

function parseRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return null;
  }

  return Math.round(rating);
}

function isValidEmail(value) {
  if (!value) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

const listProductReviews = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug || "").trim();

  if (!slug) {
    return res.status(400).json({ success: false, message: "Product slug is required" });
  }

  const product = await productModel.getProductBySlug(slug);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const reviews = await reviewModel.listApprovedReviewsBySlug(product.slug || slug);
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews : 0;

  return res.status(200).json({
    success: true,
    data: reviews,
    meta: {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    },
  });
});

const createProductReview = asyncHandler(async (req, res) => {
  const authenticatedUser = req.isAuthenticated && req.isAuthenticated() && req.user ? req.user : null;
  const slug = String(req.body?.slug || req.body?.productSlug || "").trim();
  const rating = parseRating(req.body?.rating);
  const title = String(req.body?.title || "").trim();
  const body = String(req.body?.body || req.body?.text || "").trim();
  const displayName = String(req.body?.displayName || req.body?.authorName || "").trim();
  const emailInput = String(req.body?.email || req.body?.authorEmail || "").trim();

  if (!slug) {
    return res.status(400).json({ success: false, message: "Product slug is required" });
  }

  if (!rating) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
  }

  if (!body) {
    return res.status(400).json({ success: false, message: "Review content is required" });
  }

  if (!authenticatedUser) {
    if (!displayName) {
      return res.status(400).json({ success: false, message: "Name is required for guest reviews" });
    }

    if (!isValidEmail(emailInput)) {
      return res.status(400).json({ success: false, message: "A valid email is required for guest reviews" });
    }
  }

  const product = await productModel.getProductBySlug(slug);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const purchaseVerified = authenticatedUser
    ? await reviewModel.hasUserPurchasedProduct(authenticatedUser.id, product.id)
    : false;
  const review = await reviewModel.createReview({
    productId: product.id,
    productSlug: product.slug,
    userId: authenticatedUser?.id || null,
    userName: displayName || authenticatedUser?.name || "Customer",
    userEmail: authenticatedUser?.email || emailInput || null,
    rating,
    title,
    body,
    purchaseVerified,
  });

  return res.status(201).json({
    success: true,
    data: review,
    message: "Review submitted for approval",
  });
});

module.exports = {
  listProductReviews,
  createProductReview,
};
