exports.up = (pgm) => {
  pgm.addColumns(
    "products",
    {
      show_in_software: {
        type: "boolean",
        notNull: true,
        default: true,
      },
      show_in_featured: {
        type: "boolean",
        notNull: true,
        default: false,
      },
    },
    { ifNotExists: true }
  );

  pgm.sql("UPDATE products SET show_in_featured = is_featured WHERE show_in_featured = false");
  pgm.createIndex("products", ["show_in_software"], { ifNotExists: true });
  pgm.createIndex("products", ["show_in_featured"], { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["show_in_software", "show_in_featured"], { ifExists: true });
};
