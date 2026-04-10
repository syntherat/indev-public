CREATE TABLE IF NOT EXISTS blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    subtitle text NOT NULL,
    slug text NOT NULL UNIQUE,
    excerpt text NOT NULL,
    content text NOT NULL,
    tag text NOT NULL,
    author text NOT NULL,
    featured_image text NOT NULL,
    read_time integer NOT NULL,
    publish_date timestamp NOT NULL,
    status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_publish_date ON blogs(publish_date);

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
    status
) VALUES
(
    'Designing Reusable UI Systems That Still Feel Premium',
    'How to build a shared foundation without flattening product identity.',
    'designing-reusable-ui-systems-that-still-feel-premium',
    'Reusable does not need to mean generic. The best systems keep spacing, typography, and motion consistent while leaving room for product personality.',
    '# Designing Reusable UI Systems That Still Feel Premium\n\n## Reusable should still feel intentional\nReusable does not need to mean generic. The fastest teams use repeatable structure for spacing, typography, and behavior, then layer product-specific personality on top.\n\nThe system should decide what stays consistent, while product teams decide what creates emotional tone. That split makes reuse strong without flattening identity.\n\n## Start with primitives, not polished screens\nOur process starts with primitives first. We define layout rhythm, color roles, and interaction states before creating higher-level components.\n\nSpacing, density, and motion tokens become your language layer. Once that language is stable, components become easier to audit and maintain.\n\n## Prevent visual drift before it compounds\nWhen teams skip this step, design debt appears as visual drift and duplicated components. A small system with clear ownership is better than a giant kit that nobody trusts.\n\nReviewing every new component against baseline primitives keeps the library coherent and avoids one-off variants that silently increase maintenance cost.',
    'UI Systems',
    'Sounak Pal',
    '/assets/featured-commerce.svg',
    8,
    '2026-04-06T00:00:00.000Z',
    'published'
),
(
    'From Idea to Launch in 6 Weeks: A Practical Build Plan',
    'A simple rhythm for scoping, designing, and shipping your first usable version.',
    'from-idea-to-launch-in-6-weeks-a-practical-build-plan',
    'A practical release rhythm that keeps work moving without wasting weeks on features users do not need yet.',
    '# From Idea to Launch in 6 Weeks\n\n## Optimize for proof, not perfection\nThe first launch should prove value, not completeness. Split the work into a core loop: discover, design, build, and validate with real users every week.\n\nWhen scope pressure rises, ask one question: does this change improve the core loop for the first user cohort? If not, defer it.\n\n## A practical six-week release rhythm\nWeek one is about scope and constraints. Weeks two and three lock UX flows and UI direction. Weeks four and five focus on implementation and quality. Week six is launch prep and measurement setup.\n\nThis timeline works because each week ends with visible outputs and decisions that are documented, not buried in chat threads.\n\n## Keep decision-making visible\nSpeed works best when decisions are visible. Keep one source of truth for requirements and avoid hidden assumptions in direct messages.\n\nA lightweight changelog for product decisions reduces rework and helps design and engineering stay aligned while moving fast.',
    'Product Delivery',
    'Sourav Kumar',
    '/assets/featured-mobile.svg',
    6,
    '2026-04-03T00:00:00.000Z',
    'published'
),
(
    'How to Turn Product Research Into a Better Roadmap',
    'A lightweight process for using interviews and usage signals without overcomplicating planning.',
    'how-to-turn-product-research-into-a-better-roadmap',
    'Research only matters when it changes sequencing. Here is a simple way to convert findings into roadmap decisions.',
    '# How to Turn Product Research Into a Better Roadmap\n\n## Treat research as a decision input\nResearch is useful when it changes what you build next. If the findings do not alter the roadmap, they are just notes.\n\n## Group findings into themes\nCollect interview quotes, support issues, and analytics together. Then group them into themes that point to the same underlying user problem.\n\n## Prioritize by impact and effort\nA roadmap should reflect both user pain and implementation cost. Start with the highest-impact items that are feasible in your next release window.\n\n## Close the loop\nAfter launch, compare the outcome against the original research. That feedback loop keeps the roadmap grounded in reality instead of assumptions.',
    'Research',
    'Sounak Pal',
    '/assets/featured-analytics.svg',
    5,
    '2026-03-29T00:00:00.000Z',
    'published'
);
