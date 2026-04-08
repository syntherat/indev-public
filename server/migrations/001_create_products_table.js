exports.up = (pgm) => {
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  pgm.createTable("products", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    slug: {
      type: "text",
      notNull: true,
      unique: true,
    },
    name: {
      type: "text",
      notNull: true,
    },
    category: {
      type: "text",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    detail: {
      type: "text",
      notNull: true,
    },
    bullets: {
      type: "text[]",
      notNull: true,
      default: pgm.func("ARRAY[]::text[]"),
    },
    stat_label: {
      type: "text",
      notNull: true,
    },
    stat_value: {
      type: "text",
      notNull: true,
    },
    accent: {
      type: "text",
      notNull: true,
      default: "product-accent-cyan",
    },
    is_featured: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    price: {
      type: "text",
    },
    period: {
      type: "text",
    },
    image: {
      type: "text",
    },
    image_alt: {
      type: "text",
    },
    href: {
      type: "text",
    },
    display_order: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("products", ["display_order"]);
  pgm.createIndex("products", ["is_featured"]);
};

exports.down = (pgm) => {
  pgm.dropTable("products");
};
