const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/products/:slug/reviews", reviewController.listProductReviews);
router.post("/reviews", reviewController.createProductReview);

module.exports = router;
