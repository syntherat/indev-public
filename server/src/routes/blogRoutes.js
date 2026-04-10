const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/blogs", blogController.listBlogs);
router.get("/blogs/:slug", blogController.getBlogBySlug);

module.exports = router;
