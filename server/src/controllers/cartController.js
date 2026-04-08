const asyncHandler = require("../utils/asyncHandler");
const cartModel = require("../models/cartModel");
const accountModel = require("../models/accountModel");

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

  // Placeholder checkout flow entry point.
  const summary = cartModel.summarizeCart(items);
  const order = await accountModel.createOrderFromCart(req.user.id, items, summary);

  return res.status(200).json({
    success: true,
    data: {
      redirectUrl: "/checkout/success",
      summary,
      order,
      purchasedItems: items,
    },
  });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  deleteItem,
  checkout,
};