exports.up = (pgm) => {
  pgm.addColumns(
    "products",
    {
      product_subtitle: {
        type: "text",
      },
      gallery_images: {
        type: "text[]",
        notNull: true,
        default: pgm.func("ARRAY[]::text[]"),
      },
      faq_items: {
        type: "jsonb",
        notNull: true,
        default: pgm.func("'[]'::jsonb"),
      },
      spec_items: {
        type: "jsonb",
        notNull: true,
        default: pgm.func("'[]'::jsonb"),
      },
      warranty_title: {
        type: "text",
      },
      warranty_description: {
        type: "text",
      },
      warranty_link_label: {
        type: "text",
      },
      warranty_link_url: {
        type: "text",
      },
      support_title: {
        type: "text",
      },
      support_description: {
        type: "text",
      },
    },
    { ifNotExists: true }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns(
    "products",
    [
      "product_subtitle",
      "gallery_images",
      "faq_items",
      "spec_items",
      "warranty_title",
      "warranty_description",
      "warranty_link_label",
      "warranty_link_url",
      "support_title",
      "support_description",
    ],
    { ifExists: true }
  );
};