exports.up = (pgm) => {
  pgm.addColumns(
    "products",
    {
      amc_frequency: {
        type: "text",
      },
      amc_price_range: {
        type: "text",
      },
      amc_notes: {
        type: "text",
      },
    },
    { ifNotExists: true }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["amc_frequency", "amc_price_range", "amc_notes"], { ifExists: true });
};