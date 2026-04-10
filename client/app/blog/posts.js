export const blogPosts = [
  {
    slug: "designing-reusable-ui-systems",
    title: "Designing Reusable UI Systems That Still Feel Premium",
    excerpt:
      "How we build component libraries that keep a shared foundation while still letting each product surface feel intentional and brand-aware.",
    sections: [
      {
        heading: "Reusable should still feel intentional",
        paragraphs: [
          "Reusable does not need to mean generic. The fastest teams use repeatable structure for spacing, typography, and behavior, then layer project-specific personality on top.",
          "The system should decide what stays consistent, while product teams decide what creates emotional tone. That split makes reuse strong without flattening identity.",
        ],
      },
      {
        heading: "Start with primitives, not polished screens",
        paragraphs: [
          "Our process starts with primitives first. We define layout rhythm, color roles, and interaction states before creating higher-level components. This keeps scale manageable when products grow quickly.",
          "Spacing, density, and motion tokens become your language layer. Once that language is stable, components become easier to audit and maintain.",
        ],
      },
      {
        heading: "Prevent visual drift before it compounds",
        paragraphs: [
          "When teams skip this step, design debt appears as visual drift and duplicated components. A small system with clear ownership is better than a giant kit that nobody trusts.",
          "Reviewing every new component against baseline primitives keeps the library coherent and avoids one-off variants that silently increase maintenance cost.",
        ],
      },
    ],
    category: "UI Systems",
    readTime: "8 min read",
    publishedAt: "Apr 06, 2026",
    author: {
      name: "Aayush Bharti",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "People reviewing product design work",
  },
  {
    slug: "from-idea-to-launch-in-six-weeks",
    title: "From Idea to Launch in 6 Weeks: A Practical Build Plan",
    excerpt:
      "A simple timeline for scoping, designing, and shipping your first usable version without wasting weeks on features users do not need yet.",
    sections: [
      {
        heading: "Optimize for proof, not perfection",
        paragraphs: [
          "The first launch should prove value, not completeness. We split work into a core loop: discover, design, build, and validate with real users every week.",
          "When scope pressure rises, ask one question: does this change improve the core loop for the first user cohort? If not, defer it.",
        ],
      },
      {
        heading: "A practical six-week release rhythm",
        paragraphs: [
          "Week one is about scope and constraints. Weeks two and three lock UX flows and UI direction. Weeks four and five focus on implementation and quality. Week six is launch prep and measurement setup.",
          "This timeline works because each week ends with visible outputs and decisions that are documented, not buried in chat threads.",
        ],
      },
      {
        heading: "Keep decision-making visible",
        paragraphs: [
          "Speed works best when decisions are visible. Keep one source of truth for requirements and avoid hidden assumptions in direct messages.",
          "A lightweight changelog for product decisions reduces rework and helps design and engineering stay aligned while moving fast.",
        ],
      },
    ],
    category: "Product Delivery",
    readTime: "6 min read",
    publishedAt: "Apr 03, 2026",
    author: {
      name: "Aayush Bharti",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Team planning milestones on a whiteboard",
  },
];

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}
