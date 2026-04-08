exports.up = (pgm) => {
  pgm.addColumns(
    "products",
    {
      is_best_seller: {
        type: "boolean",
        notNull: true,
        default: false,
      },
      rating: {
        type: "numeric(3,1)",
        notNull: true,
        default: 4.5,
      },
      pricing_type: {
        type: "text",
        notNull: true,
        default: "monthly",
      },
      image_source: {
        type: "text",
        notNull: true,
        default: "link",
      },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    UPDATE products
    SET pricing_type = CASE
      WHEN period ILIKE '%year%' OR period ILIKE '%annual%' THEN 'annually'
      WHEN period ILIKE '%one%' OR period ILIKE '%project%' THEN 'one-time'
      ELSE 'monthly'
    END,
    rating = COALESCE(rating, 4.5),
    image_source = COALESCE(image_source, 'link'),
    is_best_seller = COALESCE(is_best_seller, false)
  `);
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["is_best_seller", "rating", "pricing_type", "image_source"], { ifExists: true });
};