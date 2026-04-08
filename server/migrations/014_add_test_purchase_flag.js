exports.up = (pgm) => {
  pgm.addColumns("user_orders", {
    is_test_purchase: {
      type: "boolean",
      notNull: true,
      default: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("user_orders", ["is_test_purchase"]);
};