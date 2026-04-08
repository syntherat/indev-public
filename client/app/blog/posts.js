export const blogPosts = [
  {
    slug: "designing-reusable-ui-systems",
    title: "Designing Reusable UI Systems That Still Feel Premium",
    excerpt:
      "How we build component libraries that keep a shared foundation while still letting each product surface feel intentional and brand-aware.",
    content: [
      "Reusable does not need to mean generic. The fastest teams use repeatable structure for spacing, typography, and behavior, then layer project-specific personality on top.",
      "Our process starts with primitives first. We define layout rhythm, color roles, and interaction states before creating higher-level components. This keeps scale manageable when products grow quickly.",
      "When teams skip this step, design debt appears as visual drift and duplicated components. A small system with clear ownership is better than a giant kit that nobody trusts.",
    ],
    category: "UI Systems",
    readTime: "8 min read",
    publishedAt: "Apr 06, 2026",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "People reviewing product design work",
  },
  {
    slug: "from-idea-to-launch-in-six-weeks",
    title: "From Idea to Launch in 6 Weeks: A Practical Build Plan",
    excerpt:
      "A simple timeline for scoping, designing, and shipping your first usable version without wasting weeks on features users do not need yet.",
    content: [
      "The first launch should prove value, not completeness. We split work into a core loop: discover, design, build, and validate with real users every week.",
      "Week one is about scope and constraints. Weeks two and three lock UX flows and UI direction. Weeks four and five focus on implementation and quality. Week six is launch prep and measurement setup.",
      "Speed works best when decisions are visible. Keep one source of truth for requirements and avoid hidden assumptions in direct messages.",
    ],
    category: "Product Delivery",
    readTime: "6 min read",
    publishedAt: "Apr 03, 2026",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Team planning milestones on a whiteboard",
  },
];

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}
