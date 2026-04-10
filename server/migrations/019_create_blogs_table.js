const blogRows = [
  {
    title: "Designing Reusable UI Systems That Still Feel Premium",
    subtitle: "How to build a shared foundation without flattening product identity.",
    slug: "designing-reusable-ui-systems-that-still-feel-premium",
    excerpt:
      "Reusable does not need to mean generic. The best systems keep spacing, typography, and motion consistent while leaving room for product personality.",
    content: `# Designing Reusable UI Systems That Still Feel Premium

## Reusable should still feel intentional
Reusable does not need to mean generic. The fastest teams use repeatable structure for spacing, typography, and behavior, then layer product-specific personality on top.

The system should decide what stays consistent, while product teams decide what creates emotional tone. That split makes reuse strong without flattening identity.

## Start with primitives, not polished screens
Our process starts with primitives first. We define layout rhythm, color roles, and interaction states before creating higher-level components.

Spacing, density, and motion tokens become your language layer. Once that language is stable, components become easier to audit and maintain.

## Prevent visual drift before it compounds
When teams skip this step, design debt appears as visual drift and duplicated components. A small system with clear ownership is better than a giant kit that nobody trusts.

Reviewing every new component against baseline primitives keeps the library coherent and avoids one-off variants that silently increase maintenance cost.`,
    tag: "UI Systems",
    author: "Sounak Pal",
    featured_image: "/assets/featured-commerce.svg",
    read_time: 8,
    publish_date: new Date("2026-04-06T00:00:00.000Z"),
    status: "published",
  },
  {
    title: "From Idea to Launch in 6 Weeks: A Practical Build Plan",
    subtitle: "A simple rhythm for scoping, designing, and shipping your first usable version.",
    slug: "from-idea-to-launch-in-6-weeks-a-practical-build-plan",
    excerpt:
      "A practical release rhythm that keeps work moving without wasting weeks on features users do not need yet.",
    content: `# From Idea to Launch in 6 Weeks

## Optimize for proof, not perfection
The first launch should prove value, not completeness. Split the work into a core loop: discover, design, build, and validate with real users every week.

When scope pressure rises, ask one question: does this change improve the core loop for the first user cohort? If not, defer it.

## A practical six-week release rhythm
Week one is about scope and constraints. Weeks two and three lock UX flows and UI direction. Weeks four and five focus on implementation and quality. Week six is launch prep and measurement setup.

This timeline works because each week ends with visible outputs and decisions that are documented, not buried in chat threads.

## Keep decision-making visible
Speed works best when decisions are visible. Keep one source of truth for requirements and avoid hidden assumptions in direct messages.

A lightweight changelog for product decisions reduces rework and helps design and engineering stay aligned while moving fast.`,
    tag: "Product Delivery",
    author: "Sourav Kumar",
    featured_image: "/assets/featured-mobile.svg",
    read_time: 6,
    publish_date: new Date("2026-04-03T00:00:00.000Z"),
    status: "published",
  },
  {
    title: "How to Turn Product Research Into a Better Roadmap",
    subtitle: "A lightweight process for using interviews and usage signals without overcomplicating planning.",
    slug: "how-to-turn-product-research-into-a-better-roadmap",
    excerpt:
      "Research only matters when it changes sequencing. Here is a simple way to convert findings into roadmap decisions.",
    content: `# How to Turn Product Research Into a Better Roadmap

## Treat research as a decision input
Research is useful when it changes what you build next. If the findings do not alter the roadmap, they are just notes.

## Group findings into themes
Collect interview quotes, support issues, and analytics together. Then group them into themes that point to the same underlying user problem.

## Prioritize by impact and effort
A roadmap should reflect both user pain and implementation cost. Start with the highest-impact items that are feasible in your next release window.

## Close the loop
After launch, compare the outcome against the original research. That feedback loop keeps the roadmap grounded in reality instead of assumptions.`,
    tag: "Research",
    author: "Sounak Pal",
    featured_image: "/assets/featured-analytics.svg",
    read_time: 5,
    publish_date: new Date("2026-03-29T00:00:00.000Z"),
    status: "published",
  },
];

exports.up = (pgm) => {
  pgm.createTable("blogs", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "text",
      notNull: true,
    },
    subtitle: {
      type: "text",
      notNull: true,
    },
    slug: {
      type: "text",
      notNull: true,
      unique: true,
    },
    excerpt: {
      type: "text",
      notNull: true,
    },
    content: {
      type: "text",
      notNull: true,
    },
    tag: {
      type: "text",
      notNull: true,
    },
    author: {
      type: "text",
      notNull: true,
    },
    featured_image: {
      type: "text",
      notNull: true,
    },
    read_time: {
      type: "integer",
      notNull: true,
    },
    publish_date: {
      type: "timestamp",
      notNull: true,
    },
    status: {
      type: "text",
      notNull: true,
      default: "published",
      check: "status IN ('draft', 'published')",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("blogs", "slug");
  pgm.createIndex("blogs", "status");
  pgm.createIndex("blogs", "publish_date");

  blogRows.forEach((row) => {
    pgm.sql(`
      INSERT INTO blogs (
        title,
        subtitle,
        slug,
        excerpt,
        content,
        tag,
        author,
        featured_image,
        read_time,
        publish_date,
        status,
        created_at,
        updated_at
      ) VALUES (
        '${row.title.replace(/'/g, "''")}',
        '${row.subtitle.replace(/'/g, "''")}',
        '${row.slug}',
        '${row.excerpt.replace(/'/g, "''")}',
        '${row.content.replace(/'/g, "''")}',
        '${row.tag.replace(/'/g, "''")}',
        '${row.author.replace(/'/g, "''")}',
        '${row.featured_image}',
        ${row.read_time},
        '${row.publish_date.toISOString()}',
        '${row.status}',
        NOW(),
        NOW()
      );
    `);
  });
};

exports.down = (pgm) => {
  pgm.dropTable("blogs");
};
