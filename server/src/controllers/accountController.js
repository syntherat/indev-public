const asyncHandler = require("../utils/asyncHandler");
const accountModel = require("../models/accountModel");

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

module.exports = {
  getProfile,
  updateProfile,
  getOrders,
};
