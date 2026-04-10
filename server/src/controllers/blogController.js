const blogModel = require("../models/blogModel");

function normalizeLimit(limit) {
  const parsed = Number(limit);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 12;
  }

  return Math.min(parsed, 24);
}

async function listBlogs(req, res, next) {
  try {
    const blogs = await blogModel.listPublishedBlogs({
      q: req.query.q,
      tag: req.query.tag,
      limit: normalizeLimit(req.query.limit),
    });

    res.status(200).json({ data: blogs });
  } catch (error) {
    next(error);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const blog = await blogModel.getPublishedBlogBySlug(req.params.slug);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ data: blog });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBlogs,
  getBlogBySlug,
};
