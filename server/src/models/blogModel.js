const db = require("../config/db");

const AUTHOR_AVATARS = {
  "Sounak Pal": "/assets/blog-authors/sounak-pal.svg",
  "Sourav Kumar": "/assets/blog-authors/sourav-kumar.svg",
};

function mapBlogRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    content: row.content,
    tag: row.tag,
    author: {
      name: row.author,
      avatar: AUTHOR_AVATARS[row.author] || null,
    },
    featuredImage: row.featured_image,
    readTime: row.read_time,
    publishDate: row.publish_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listPublishedBlogs({ q, tag, limit = 12 } = {}) {
  const values = ["published"];
  let whereSql = "WHERE status = $1";

  if (q) {
    values.push(`%${q}%`);
    whereSql += ` AND (title ILIKE $${values.length} OR subtitle ILIKE $${values.length} OR excerpt ILIKE $${values.length} OR content ILIKE $${values.length} OR tag ILIKE $${values.length} OR author ILIKE $${values.length})`;
  }

  if (tag) {
    values.push(tag);
    whereSql += ` AND tag = $${values.length}`;
  }

  values.push(Number(limit) || 12);

  const result = await db.query(
    `
      SELECT *
      FROM blogs
      ${whereSql}
      ORDER BY publish_date DESC, created_at DESC
      LIMIT $${values.length}
    `,
    values
  );

  return result.rows.map(mapBlogRow);
}

async function getPublishedBlogBySlug(slug) {
  const result = await db.query(
    `
      SELECT *
      FROM blogs
      WHERE slug = $1 AND status = 'published'
      LIMIT 1
    `,
    [slug]
  );

  return mapBlogRow(result.rows[0]);
}

async function listPublishedBlogSlugs() {
  const result = await db.query(
    `
      SELECT slug
      FROM blogs
      WHERE status = 'published'
      ORDER BY publish_date DESC, created_at DESC
    `
  );

  return result.rows.map((row) => row.slug);
}

module.exports = {
  listPublishedBlogs,
  getPublishedBlogBySlug,
  listPublishedBlogSlugs,
};
