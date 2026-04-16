const asyncHandler = require("../utils/asyncHandler");
const accountModel = require("../models/accountModel");
const { createDownloadSignedUrl } = require("../utils/s3Client");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await accountModel.getUserProfile(req.user.id);

  return res.status(200).json({
    success: true,
    data: profile || {
      contactNumber: "",
      country: "",
      postalCode: "",
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await accountModel.updateUserProfile(req.user.id, {
    contactNumber: req.body?.contactNumber,
    country: req.body?.country,
    postalCode: req.body?.postalCode,
  });

  return res.status(200).json({
    success: true,
    data: profile,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await accountModel.getOrdersByUserId(req.user.id);

  return res.status(200).json({
    success: true,
    data: {
      items: orders,
    },
  });
});

const getLibraryDownloadUrl = asyncHandler(async (req, res) => {
  const productId = String(req.params.productId || "").trim();

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product id is required" });
  }

  const item = await accountModel.getPurchasedDownloadableProduct(req.user.id, productId);

  if (!item) {
    return res.status(404).json({ success: false, message: "Purchased product not found" });
  }

  if (!item.downloadS3Key) {
    return res.status(404).json({ success: false, message: "Download file is not uploaded yet for this product" });
  }

  const url = await createDownloadSignedUrl({
    key: item.downloadS3Key,
    fileName: item.downloadFileName || `${item.name || "product"}.zip`,
    expiresIn: 300,
  });

  return res.status(200).json({
    success: true,
    data: {
      url,
      fileName: item.downloadFileName || null,
      expiresIn: 300,
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getOrders,
  getLibraryDownloadUrl,
};