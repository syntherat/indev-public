exports.up = (pgm) => {
  pgm.addColumns("products", {
    download_s3_key: {
      type: "text",
    },
    download_file_name: {
      type: "text",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("products", ["download_s3_key", "download_file_name"]);
};
