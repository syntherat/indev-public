const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/featured", productController.getFeaturedProducts);
router.get("/products/software", productController.getSoftwareProducts);
router.get("/products/:slug", productController.getProductBySlug);

module.exports = router;
