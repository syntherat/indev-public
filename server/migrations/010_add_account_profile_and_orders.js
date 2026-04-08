exports.up = (pgm) => {
  pgm.addColumns("users", {
    contact_number: {
      type: "text",
    },
    country: {
      type: "text",
    },
    postal_code: {
      type: "text",
    },
  });

  pgm.createTable("user_orders", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },
    order_number: {
      type: "text",
      notNull: true,
      unique: true,
    },
    fulfillment_status: {
      type: "text",
      notNull: true,
      default: "Processing",
    },
    payment_status: {
      type: "text",
      notNull: true,
      default: "Pending",
    },
    total_items: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    subtotal: {
      type: "numeric(12,2)",
      notNull: true,
      default: 0,
    },
    total: {
      type: "numeric(12,2)",
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

  pgm.addConstraint("user_orders", "user_orders_total_items_non_negative", {
    check: "total_items >= 0",
  });

  pgm.createIndex("user_orders", ["user_id", "created_at"]);

  pgm.createTable("user_order_items", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    order_id: {
      type: "uuid",
      notNull: true,
      references: "user_orders(id)",
      onDelete: "cascade",
    },
    product_id: {
      type: "uuid",
      references: "products(id)",
      onDelete: "set null",
    },
    product_slug: {
      type: "text",
    },
    product_name: {
      type: "text",
      notNull: true,
    },
    product_category: {
      type: "text",
    },
    product_image: {
      type: "text",
    },
    unit_price: {
      type: "text",
    },
    unit_price_value: {
      type: "numeric(12,2)",
      notNull: true,
      default: 0,
    },
    quantity: {
      type: "integer",
      notNull: true,
      default: 1,
    },
    line_total: {
      type: "numeric(12,2)",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("user_order_items", "user_order_items_quantity_positive", {
    check: "quantity > 0",
  });

  pgm.createIndex("user_order_items", ["order_id"]);
};

exports.down = (pgm) => {
  pgm.dropTable("user_order_items");
  pgm.dropTable("user_orders");

  pgm.dropColumns("users", ["contact_number", "country", "postal_code"]);
};
