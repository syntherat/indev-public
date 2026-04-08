const asyncHandler = require("../utils/asyncHandler");
const productModel = require("../models/productModel");

const getProducts = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const products = await productModel.getAllProducts({ q, category });
  const categories = await productModel.getProductCategories();

  res.status(200).json({
    success: true,
    data: products,
    meta: {
      categories,
    },
  });
});

const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await productModel.getFeaturedProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getSoftwareProducts = asyncHandler(async (_req, res) => {
  const products = await productModel.getSoftwareProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productModel.getProductBySlug(req.params.slug);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getSoftwareProducts,
  getProductBySlug,
};
