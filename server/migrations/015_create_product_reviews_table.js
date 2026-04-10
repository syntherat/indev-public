exports.up = (pgm) => {
  pgm.createTable("product_reviews", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: "products(id)",
      onDelete: "cascade",
    },
    product_slug: {
      type: "text",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      references: "users(id)",
      onDelete: "cascade",
    },
    user_name: {
      type: "text",
      notNull: true,
    },
    user_email: {
      type: "text",
    },
    rating: {
      type: "integer",
      notNull: true,
    },
    title: {
      type: "text",
    },
    body: {
      type: "text",
      notNull: true,
    },
    status: {
      type: "text",
      notNull: true,
      default: "pending",
    },
    is_purchase_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    admin_reply: {
      type: "text",
    },
    reviewed_by_admin_id: {
      type: "uuid",
    },
    reviewed_at: {
      type: "timestamp",
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

  pgm.addConstraint("product_reviews", "product_reviews_rating_check", {
    check: "rating >= 1 AND rating <= 5",
  });

  pgm.addConstraint("product_reviews", "product_reviews_status_check", {
    check: "status IN ('pending', 'approved', 'rejected')",
  });

  pgm.createIndex("product_reviews", ["product_id", "status", "created_at"]);
  pgm.createIndex("product_reviews", ["user_id", "product_id"]);
  pgm.createIndex("product_reviews", ["product_slug"]);
};

exports.down = (pgm) => {
  pgm.dropTable("product_reviews");
};
