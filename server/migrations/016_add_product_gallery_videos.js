exports.up = (pgm) => {
  pgm.addColumns("products", {
    gallery_videos: {
      type: "text[]",
      notNull: true,
      default: pgm.func("ARRAY[]::text[]"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["gallery_videos"]);
};