exports.up = (pgm) => {
  pgm.addColumns("products", {
    is_hidden: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["is_hidden"]);
};
