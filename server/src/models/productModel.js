const db = require("../config/db");

function mapProductRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    detail: row.detail,
    bullets: row.bullets || [],
    statLabel: row.stat_label,
    statValue: row.stat_value,
    accent: row.accent,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    rating: row.rating === null || row.rating === undefined ? null : Number(row.rating),
    pricingType: row.pricing_type,
    imageSource: row.image_source,
    productSubtitle: row.product_subtitle,
    galleryImages: row.gallery_images || [],
    faqItems: row.faq_items || [],
    specItems: row.spec_items || [],
    warrantyTitle: row.warranty_title,
    warrantyDescription: row.warranty_description,
    warrantyLinkLabel: row.warranty_link_label,
    warrantyLinkUrl: row.warranty_link_url,
    amcFrequency: row.amc_frequency,
    amcPriceRange: row.amc_price_range,
    amcNotes: row.amc_notes,
    supportTitle: row.support_title,
    supportDescription: row.support_description,
    showInSoftware: row.show_in_software,
    showInFeatured: row.show_in_featured,
    price: row.price,
    period: row.period,
    image: row.image,
    imageAlt: row.image_alt,
    href: row.href,
    displayOrder: row.display_order,
    isHidden: row.is_hidden || false,
  };
}

function buildFilters({ q, category, section }) {
  const clauses = [];
  const values = [];

  // Always exclude hidden products from public catalog
  clauses.push("is_hidden = false");

  if (q) {
    values.push(`%${q}%`);
    clauses.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length} OR category ILIKE $${values.length})`);
  }

  if (category) {
    values.push(category);
    clauses.push(`category = $${values.length}`);
  }

  if (section === "software") {
    clauses.push("show_in_software = true");
  }

  if (section === "featured") {
    clauses.push("show_in_featured = true");
  }

  return {
    where: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}

async function getAllProducts({ q, category, section } = {}) {
  const filters = buildFilters({ q, category, section });

  const result = await db.query(
    `
      SELECT
        id,
        slug,
        name,
        category,
        description,
        detail,
        bullets,
        stat_label,
        stat_value,
        accent,
        is_featured,
        is_best_seller,
        rating,
        pricing_type,
        image_source,
        product_subtitle,
        gallery_images,
        faq_items,
        spec_items,
        warranty_title,
        warranty_description,
        warranty_link_label,
        warranty_link_url,
        amc_frequency,
        amc_price_range,
        amc_notes,
        support_title,
        support_description,
        show_in_software,
        show_in_featured,
        price,
        period,
        image,
        image_alt,
        href,
        display_order,
        is_hidden
      FROM products
      ${filters.where}
      ORDER BY display_order ASC, created_at ASC
    `,
    filters.values
  );

  return result.rows.map(mapProductRow);
}

async function getFeaturedProducts() {
  return getAllProducts({ section: "featured" });
}

async function getSoftwareProducts() {
  return getAllProducts({ section: "software" });
}

async function getProductBySlug(slug) {
  const result = await db.query(
    `
      SELECT
        id,
        slug,
        name,
        category,
        description,
        detail,
        bullets,
        stat_label,
        stat_value,
        accent,
        is_featured,
        is_best_seller,
        rating,
        pricing_type,
        image_source,
        product_subtitle,
        gallery_images,
        faq_items,
        spec_items,
        warranty_title,
        warranty_description,
        warranty_link_label,
        warranty_link_url,
        amc_frequency,
        amc_price_range,
        amc_notes,
        support_title,
        support_description,
        show_in_software,
        show_in_featured,
        price,
        period,
        image,
        image_alt,
        href,
        display_order
        display_order,
        is_hidden
      FROM products
      WHERE slug = $1
         OR regexp_replace(COALESCE(href, ''), '^.*/', '') = $1
      LIMIT 1
    `,
    [slug]
  );

  return result.rows[0] ? mapProductRow(result.rows[0]) : null;
}

async function getProductCategories() {
  const result = await db.query(
    `
      SELECT DISTINCT category
      FROM products
      WHERE category IS NOT NULL AND category <> ''
      ORDER BY category ASC
    `
  );

  return result.rows.map((row) => row.category);
}

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getSoftwareProducts,
  getProductBySlug,
  getProductCategories,
};
