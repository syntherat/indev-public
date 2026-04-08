exports.up = (pgm) => {
  pgm.createTable("cart_items", {
    user_id: {
      type: "uuid",
      notNull: true,
      references: 'users(id)',
      onDelete: "cascade",
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: 'products(id)',
      onDelete: "cascade",
    },
    quantity: {
      type: "integer",
      notNull: true,
      default: 1,
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

  pgm.addConstraint("cart_items", "cart_items_user_product_unique", {
    unique: ["user_id", "product_id"],
  });

  pgm.addConstraint("cart_items", "cart_items_quantity_positive", {
    check: "quantity > 0",
  });

  pgm.createIndex("cart_items", ["user_id"]);
  pgm.createIndex("cart_items", ["updated_at"]);
};

exports.down = (pgm) => {
  pgm.dropTable("cart_items");
};