exports.up = (pgm) => {
  pgm.createTable(
    "product_categories",
    {
      id: {
        type: "serial",
        primaryKey: true,
      },
      name: {
        type: "text",
        notNull: true,
        unique: true,
      },
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
    },
    {
      ifNotExists: true,
    }
  );

  pgm.sql(`
    INSERT INTO product_categories (name)
    SELECT DISTINCT category
    FROM products
    WHERE category IS NOT NULL
      AND category <> ''
    ON CONFLICT (name) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("product_categories", {
    ifExists: true,
  });
};