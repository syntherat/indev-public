const PRODUCTS = [
  {
    slug: "commerce-os",
    name: "Commerce OS",
    category: "Ecommerce Operations",
    description:
      "A command center for inventory, orders, and customer signals with clear workflows for daily teams.",
    detail:
      "Built for growing brands that need speed without operational noise, with a clean control surface for every critical flow.",
    bullets: ["Unified inventory view", "Order health timeline", "Automated stock alerts"],
    stat_label: "Processing time",
    stat_value: "-34%",
    accent: "product-accent-lilac",
    is_featured: true,
    price: "₹2,00,000",
    period: "/month",
    image: "/assets/featured-commerce.svg",
    image_alt: "Commerce Flow product preview",
    href: "/products/commerce-flow",
    display_order: 1,
  },
  {
    slug: "pulse-mobile",
    name: "Pulse Mobile",
    category: "Field Team App",
    description:
      "A mobile workspace for field teams to update tasks, log visits, and sync progress in real time.",
    detail:
      "Designed for low-friction usage in the real world with fast forms, offline support patterns, and clear completion states.",
    bullets: ["Offline-safe actions", "Smart visit checklists", "Instant status sync"],
    stat_label: "Task completion",
    stat_value: "+27%",
    accent: "product-accent-amber",
    is_featured: true,
    price: "₹1,50,000",
    period: "/month",
    image: "/assets/featured-mobile.svg",
    image_alt: "Pulse Mobile product preview",
    href: "/products/pulse-mobile",
    display_order: 2,
  },
  {
    slug: "ops-dashboard",
    name: "Ops Dashboard",
    category: "Internal Web App",
    description:
      "A live performance dashboard for internal teams with role-specific insights and actionable reporting.",
    detail:
      "Structured to help teams make faster decisions, not just read charts, with purposeful views and focused data density.",
    bullets: ["Role-based analytics", "Live KPI boards", "Cross-team drilldowns"],
    stat_label: "Decision cycle",
    stat_value: "-41%",
    accent: "product-accent-cyan",
    is_featured: true,
    price: "₹1,75,000",
    period: "/month",
    image: "/assets/featured-analytics.svg",
    image_alt: "Ops Atlas product preview",
    href: "/products/ops-atlas",
    display_order: 3,
  },
  {
    slug: "studio-custom",
    name: "Studio Custom",
    category: "Custom Product Build",
    description:
      "A bespoke software product framework for teams that need unique workflows and flexible foundations.",
    detail:
      "From MVP to scale-up, this model supports unusual product requirements while keeping the UI language elegant and coherent.",
    bullets: ["Modular architecture", "Custom workflow engine", "Future-ready scaling"],
    stat_label: "Delivery velocity",
    stat_value: "+2.1x",
    accent: "product-accent-rose",
    is_featured: false,
    price: "₹2,90,000",
    period: "/project",
    image: "/assets/featured-custom.svg",
    image_alt: "Studio Custom product preview",
    href: "/products/studio-custom",
    display_order: 4,
  },
];

exports.up = (pgm) => {
  for (const product of PRODUCTS) {
    pgm.sql(
      `
        INSERT INTO products (
          slug,
          name,
          category,
          description,
          detail,
          bullets,
          stat_label,
          stat_value,
          accent,
          is_featured,
          price,
          period,
          image,
          image_alt,
          href,
          display_order
        ) VALUES (
          '${product.slug}',
          '${product.name.replace(/'/g, "''")}',
          '${product.category.replace(/'/g, "''")}',
          '${product.description.replace(/'/g, "''")}',
          '${product.detail.replace(/'/g, "''")}',
          ARRAY[${product.bullets.map((bullet) => `'${bullet.replace(/'/g, "''")}'`).join(",")}]::text[],
          '${product.stat_label.replace(/'/g, "''")}',
          '${product.stat_value.replace(/'/g, "''")}',
          '${product.accent}',
          ${product.is_featured},
          '${product.price}',
          '${product.period}',
          '${product.image}',
          '${product.image_alt.replace(/'/g, "''")}',
          '${product.href}',
          ${product.display_order}
        )
        ON CONFLICT (slug) DO NOTHING
      `
    );
  }
};

exports.down = (pgm) => {
  pgm.sql(`DELETE FROM products WHERE slug IN ('commerce-os', 'pulse-mobile', 'ops-dashboard', 'studio-custom')`);
};
