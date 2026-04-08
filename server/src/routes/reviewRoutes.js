const express = require("express");
const requireUser = require("../middlewares/requireUser");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/products/:slug/reviews", reviewController.listProductReviews);
router.post("/reviews", requireUser, reviewController.createProductReview);

module.exports = router;
