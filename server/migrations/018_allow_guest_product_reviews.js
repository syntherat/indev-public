exports.up = (pgm) => {
  pgm.alterColumn("product_reviews", "user_id", {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("product_reviews", "user_id", {
    notNull: true,
  });
};
