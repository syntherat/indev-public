const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const defaultProducts = [
  {
    id: "fallback-commerce-os",
    slug: "commerce-os",
    name: "Commerce OS",
    category: "Ecommerce Operations",
    description:
      "A command center for inventory, orders, and customer signals with clear workflows for daily teams.",
    detail:
      "Built for growing brands that need speed without operational noise, with a clean control surface for every critical flow.",
    bullets: ["Unified inventory view", "Order health timeline", "Automated stock alerts"],
    statLabel: "Processing time",
    statValue: "-34%",
    accent: "product-accent-lilac",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    pricingType: "one-time",
    imageSource: "link",
    productSubtitle: "Unified control center for growth teams",
    galleryImages: ["/assets/featured-commerce.svg"],
    faqItems: [
      {
        question: "Who is Commerce OS for?",
        answer: "Operations, inventory, and CX teams that need one shared command center.",
      },
      {
        question: "Can we integrate with our current stack?",
        answer: "Yes. Commerce OS supports phased integrations across ERP, storefront, and analytics tools.",
      },
    ],
    specItems: [
      { label: "Deployment", value: "Cloud hosted" },
      { label: "Onboarding", value: "2-4 weeks" },
      { label: "Best for", value: "Scaling ecommerce teams" },
    ],
    supportTitle: "Need rollout guidance?",
    supportDescription: "Our team can help map your workflows and set up an implementation plan.",
    price: "₹1,99,000",
    href: "/products/commerce-flow",
    image: "/assets/featured-commerce.svg",
    imageAlt: "Commerce Flow product preview",
    totalReviews: 52,
    ratingDistribution: {
      "5star": 42,
      "4star": 7,
      "3star": 2,
      "2star": 1,
      "1star": 0,
    },
    reviews: [
      {
        rating: 5,
        date: "05/04/26",
        authorName: "Sarah Mitchell",
        verified: true,
        location: "NEW YORK",
        title: "Perfect Solution for Our Operations Team",
        text: "Commerce OS has transformed how our team manages inventory and orders. The interface is incredibly intuitive and the real-time alerts have reduced our order processing time significantly.",
        variant: "Enterprise Plan",
        reply: "Thank you Sarah! We're thrilled to hear that Commerce OS is driving efficiency gains for your team. Don't hesitate to reach out if you need additional support.",
        likes: 12,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "04/04/26",
        authorName: "Marcus Chen",
        verified: true,
        location: "SAN FRANCISCO",
        title: "Excellent Integration Capabilities",
        text: "The integration with our existing ERP system was seamless.d ddjijsds78sd iusdhisudisydsi dsudhs idsd79sydjshdishdiustyd dusigdishgd8tsg dsdisd sidus dsidsidsd sdst dsidsiuds98dy s9d hsd gsdsds ds  The onboarding team guided us through every step and the setup was completed in just 3 weeks instead of the estimated 4.",
        variant: "Professional Plan",
        reply: "We appreciate the feedback, Marcus! Fast integrations are exactly what we aim for. Let us know if you'd like to explore additional modules.",
        likes: 8,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "03/04/26",
        authorName: "Jennifer Lopez",
        verified: true,
        location: "CHICAGO",
        title: "Great Product, Could Use More Customization",
        text: "Commerce OS is solid and has definitely improved our workflow. s dsdijh duiohsd hshds itg sdisuh ds isdghish dsuiydi usydshd ioshdstds hdsiudisu id sidsiud s ids dhousiydos dsd oshdiusyd s oidsydsdshdos udhsoudiosjdoisydoshdishdsu9dsjidsguidisd sdsiudsid siug id gsidsudgsiugdsi dgsidgsiydsiug sidsiudsiudsdhuidhis8d sdosidhs iudsijd osdosi dsydshdi s odsodysidysoud sdsoiud sodysod osiydsiod si s id isdisud osyud oisdsdsyoi ds d s The only minor issue is that some of our custom reporting needs required additional setup through the development team.",
        variant: "Enterprise Plan",
        reply: "We understand, Jennifer. We can schedule a consultation to explore custom reporting options that may work better for your use case.",
        likes: 5,
        dislikes: 1,
      },
      {
        rating: 5,
        date: "02/04/26",
        authorName: "David Patel",
        verified: true,
        location: "BANGALORE",
        title: "Transformed Our Inventory Management",
        text: "This tool has been a game-changer for our operations team.ds dsdsd sd sds dsd sds ds d Real-time inventory sync has eliminated so many manual errors and we've cut order processing time in half.",
        variant: "Professional Plan",
        reply: "Thank you David! Hearing about your efficiency gains motivates our entire team. Feel free to reach out with any feature requests.",
        likes: 9,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "01/04/26",
        authorName: "Priya Nair",
        verified: true,
        location: "MUMBAI",
        title: "Solid Solution with Good Support",
        text: "Commerce OS has significantly improved how we handle customer orders. The support tea s ds ds dsd s dsdsd sd s ds m is responsive and helpful. Would love to see more advanced reporting options.",
        variant: "Enterprise Plan",
        reply: "Thanks Priya! Advanced reporting is on our roadmap. Our support team would be happy to help you in the meantime.",
        likes: 7,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "31/03/26",
        authorName: "Raj Sharma",
        verified: true,
        location: "DELHI",
        title: "Best Investment for Our Growing Team",
        text: "We've been using Commerce OS for 3 months now and the ROI has been ds dsd sd sds8d hsuihd isuhdsd sd sd sd sd sd sdsds dsincredible. Our team is more productive and our customers are happier with faster processing.",
        variant: "Enterprise Plan",
        reply: "Wonderful to hear, Raj! We're committed to supporting your growth journey. Let's discuss optimizing additional workflows.",
        likes: 14,
        dislikes: 0,
      },
    ],
  },
  {
    id: "fallback-pulse-mobile",
    slug: "pulse-mobile",
    name: "Pulse Mobile",
    category: "Field Team App",
    description:
      "A mobile workspace for field teams to update tasks, log visits, and sync progress in real time.",
    detail:
      "Designed for low-friction usage in the real world with fast forms, offline support patterns, and clear completion states.",
    bullets: ["Offline-safe actions", "Smart visit checklists", "Instant status sync"],
    statLabel: "Task completion",
    statValue: "+27%",
    accent: "product-accent-amber",
    isFeatured: true,
    isBestSeller: false,
    rating: 4.7,
    pricingType: "one-time",
    imageSource: "link",
    productSubtitle: "Real-time field operations companion",
    galleryImages: ["/assets/featured-mobile.svg"],
    faqItems: [
      {
        question: "Does Pulse Mobile support offline usage?",
        answer: "Yes. Teams can work offline and sync updates when back online.",
      },
      {
        question: "Can managers track progress?",
        answer: "Managers get live status views and completion reports.",
      },
    ],
    specItems: [
      { label: "Platform", value: "iOS and Android" },
      { label: "Sync", value: "Offline-first" },
      { label: "Use case", value: "Field operations" },
    ],
    supportTitle: "Questions before rollout?",
    supportDescription: "We can help your team plan adoption and training.",
    price: "₹1,49,000",
    href: "/products/pulse-mobile",
    image: "/assets/featured-mobile.svg",
    imageAlt: "Pulse Mobile product preview",
    totalReviews: 38,
    ratingDistribution: {
      "5star": 28,
      "4star": 7,
      "3star": 2,
      "2star": 1,
      "1star": 0,
    },
    reviews: [
      {
        rating: 5,
        date: "04/04/26",
        authorName: "David Kumar",
        verified: true,
        location: "BANGALORE",
        title: "Field Teams Love This App",
        text: "We deployed Pulse Mobile to our entire field force and the adoption rate was incredible. The offline functionality is a game-changer in areas with poor connectivity.",
        variant: "Team License",
        reply: "Fantastic to hear, David! Offline reliability is core to our design philosophy. Let us know if you'd like to scale to additional teams.",
        likes: 15,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "03/04/26",
        authorName: "Priya Singh",
        verified: true,
        location: "DELHI",
        title: "Massive Time Savings",
        text: "Before Pulse Mobile, our field teams were spending hours filling out paper forms and syncing data. Now everything is real-time and our reporting cycle is 10x faster.",
        variant: "Enterprise License",
        reply: "Thank you Priya! Your success metrics are exactly what we built Pulse Mobile for. Reach out for upcoming features!",
        likes: 10,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "02/04/26",
        authorName: "Rajesh Patel",
        verified: true,
        location: "AHMEDABAD",
        title: "Excellent Tracking, Minor UI Issues",
        text: "The location tracking and visit logging is spot-on. The app could benefit from slightly larger buttons for gloved operation in the field, but overall very solid.",
        variant: "Team License",
        reply: "Thanks Rajesh! We'll take that UI feedback into consideration for our next update. Have you checked our accessibility settings?",
        likes: 6,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "01/04/26",
        authorName: "Amit Desai",
        verified: true,
        location: "PUNE",
        title: "Game Changer for Field Operations",
        text: "Pulse Mobile has completely transformed how our field teams operate. Real-time syncing and offline capabilities mean we never miss a beat. Team adoption was instant.",
        variant: "Enterprise License",
        reply: "Thanks Amit! Your team is a perfect case study for field mobility. We'd love to discuss your success story.",
        likes: 11,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "30/03/26",
        authorName: "Neha Kapoor",
        verified: true,
        location: "HYDERABAD",
        title: "Incredibly Fast and Reliable",
        text: "Performance is excellent even on slower networks. Our team spends 70% less time on administrative tasks now. The app just works reliably every single time.",
        variant: "Team License",
        reply: "Neha, performance and reliability are our top priorities. Thank you for the kind words!",
        likes: 13,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "28/03/26",
        authorName: "Vikram Singh",
        verified: true,
        location: "CHENNAI",
        title: "Excellent but Could Use Custom Fields",
        text: "Pulse Mobile is fantastic and our field teams absolutely love it. Our only request is for more customizable form fields to match our specific workflows.",
        variant: "Professional License",
        reply: "Thanks Vikram! Custom fields are in development. Our product team will be reaching out to understand your requirements.",
        likes: 8,
        dislikes: 0,
      },
    ],
  },
  {
    id: "fallback-ops-dashboard",
    slug: "ops-dashboard",
    name: "Ops Dashboard",
    category: "Internal Web App",
    description:
      "A live performance dashboard for internal teams with role-specific insights and actionable reporting.",
    detail:
      "Structured to help teams make faster decisions, not just read charts, with purposeful views and focused data density.",
    bullets: ["Role-based analytics", "Live KPI boards", "Cross-team drilldowns"],
    statLabel: "Decision cycle",
    statValue: "-41%",
    accent: "product-accent-cyan",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    pricingType: "one-time",
    imageSource: "link",
    productSubtitle: "Live insight dashboard for internal teams",
    galleryImages: ["/assets/featured-analytics.svg"],
    faqItems: [
      {
        question: "Can dashboards be role-based?",
        answer: "Yes. Views can be tailored for leadership, operations, and specialist teams.",
      },
      {
        question: "How often is data updated?",
        answer: "Dashboards support near real-time ingestion depending on source systems.",
      },
    ],
    specItems: [
      { label: "Data freshness", value: "Near real-time" },
      { label: "Permissions", value: "Role-based" },
      { label: "Reporting", value: "Executive and operational" },
    ],
    supportTitle: "Need a custom dashboard flow?",
    supportDescription: "We can map your KPIs and craft a dashboard architecture around your team.",
    price: "₹1,74,000",
    href: "/products/ops-atlas",
    image: "/assets/featured-analytics.svg",
    imageAlt: "Ops Atlas product preview",
    totalReviews: 45,
    ratingDistribution: {
      "5star": 36,
      "4star": 6,
      "3star": 2,
      "2star": 1,
      "1star": 0,
    },
    reviews: [
      {
        rating: 5,
        date: "05/04/26",
        authorName: "Thomas Anderson",
        verified: true,
        location: "SEATTLE",
        title: "Executive Dashboard That Actually Works",
        text: "Finally, a dashboard that gives us the KPIs we actually need without the clutter. Our leadership team is checking it every morning now instead of asking for manual reports.",
        variant: "Executive Plan",
        reply: "This is exactly what we aimed for, Thomas! If you'd like to add more cross-team views, our team can help customize further.",
        likes: 18,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "04/04/26",
        authorName: "Amanda Foster",
        verified: true,
        location: "BOSTON",
        title: "Lightning Fast Reporting",
        text: "The near real-time data refresh is incredible. We can now respond to operational issues immediately instead of waiting for daily reports. ROI was clear within the first month.",
        variant: "Operations Plan",
        reply: "Thank you Amanda! Near real-time insights are essential for modern operations. Glad to see immediate value for your team.",
        likes: 14,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "03/04/26",
        authorName: "Carlos Rodriguez",
        verified: true,
        location: "MIAMI",
        title: "Great Product, Initial Learning Curve",
        text: "Ops Dashboard is powerful but took our team about 2 weeks to fully understand all the features. The documentation could be a bit more detailed with video tutorials.",
        variant: "Operations Plan",
        reply: "Good feedback, Carlos! We're actually working on video tutorial series right now. I'll have the team send them your way next week.",
        likes: 7,
        dislikes: 1,
      },
      {
        rating: 5,
        date: "27/03/26",
        authorName: "Lisa Chen",
        verified: true,
        location: "SAN FRANCISCO",
        title: "Transformed Our Decision-Making Process",
        text: "This dashboard has been instrumental in helping our leadership make faster, data-driven decisions. The visualizations are intuitive and the drill-down capabilities are powerful.",
        variant: "Executive Plan",
        reply: "That's fantastic feedback, Lisa! Data-driven decisions are exactly what we designed this for. Kudos to your team for maximizing it.",
        likes: 16,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "25/03/26",
        authorName: "Michael Torres",
        verified: true,
        location: "AUSTIN",
        title: "Best Dashboard We've Ever Used",
        text: "After trying 3 other solutions, Ops Dashboard is by far the best. The performance is unmatched and our teams are actually using it daily without needing to be pushed.",
        variant: "Operations Plan",
        reply: "Michael, thank you! High adoption without friction is the highest compliment we can receive.",
        likes: 20,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "23/03/26",
        authorName: "Sarah Johnson",
        verified: true,
        location: "DENVER",
        title: "Excellent Tool, Great Support Team",
        text: "Ops Dashboard is excellent. One small thing - would love to see more export options for reports. The support team though is incredibly responsive and helpful.",
        variant: "Executive Plan",
        reply: "Thanks Sarah! More export formats are on our roadmap. Our support team is always here to help in the meantime!",
        likes: 12,
        dislikes: 0,
      },
    ],
  },
  {
    id: "fallback-studio-custom",
    slug: "studio-custom",
    name: "Studio Custom",
    category: "Custom Product Build",
    description:
      "A bespoke software product framework for teams that need unique workflows and flexible foundations.",
    detail:
      "From MVP to scale-up, this model supports unusual product requirements while keeping the UI language elegant and coherent.",
    bullets: ["Modular architecture", "Custom workflow engine", "Future-ready scaling"],
    statLabel: "Delivery velocity",
    statValue: "+2.1x",
    accent: "product-accent-rose",
    isFeatured: false,
    isBestSeller: false,
    rating: 4.6,
    pricingType: "one-time",
    imageSource: "link",
    productSubtitle: "Custom software for unique business workflows",
    galleryImages: ["/assets/featured-custom.svg"],
    faqItems: [
      {
        question: "How does custom scoping work?",
        answer: "We run discovery sessions, define milestones, and then execute in iterative phases.",
      },
      {
        question: "Can this start as an MVP?",
        answer: "Yes. We can launch lean and expand based on validated requirements.",
      },
    ],
    specItems: [
      { label: "Engagement", value: "Project based" },
      { label: "Team model", value: "Dedicated cross-functional pod" },
      { label: "Roadmap", value: "Milestone driven" },
    ],
    supportTitle: "Need a tailored solution?",
    supportDescription: "Tell us your use case and we will design the right product architecture.",
    price: "₹2,90,000",
    href: "/products/studio-custom",
    image: "/assets/featured-custom.svg",
    imageAlt: "Studio Custom product preview",
    totalReviews: 28,
    ratingDistribution: {
      "5star": 23,
      "4star": 3,
      "3star": 1,
      "2star": 1,
      "1star": 0,
    },
    reviews: [
      {
        rating: 5,
        date: "04/04/26",
        authorName: "Elena Vasquez",
        verified: true,
        location: "AUSTIN",
        title: "Perfect for Our Unique Workflow",
        text: "We needed something completely custom for our workflow and the Studio team delivered exactly what we envisioned. The flexibility and design quality exceeded expectations.",
        variant: "Premium Build",
        reply: "Elena, thank you! Custom builds are our specialty. We'd love to feature your project in our case studies if you're interested.",
        likes: 11,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "03/04/26",
        authorName: "Michael Stewart",
        verified: true,
        location: "DENVER",
        title: "Professional Development, Smooth Launch",
        text: "The entire process from kickoff to launch was professional. The development team communicated clearly, met milestones, and the handoff for maintenance was seamless.",
        variant: "Enterprise Custom Build",
        reply: "Michael, we appreciate the kind words. Your partnership made this project successful. Looking forward to supporting you long-term!",
        likes: 9,
        dislikes: 0,
      },
      {
        rating: 4,
        date: "02/04/26",
        authorName: "Nicole White",
        verified: true,
        location: "PORTLAND",
        title: "Excellent Outcome, Higher Than Expected Cost",
        text: "The final product is outstanding and our team loves using it.  sdsd sd==sdsidhs jdstgds9d  dsgiduhs d iosd s dshdg ish disd ishdisgdisgdsfy8ds udkhsidhs8dshjg sdsud dsudgs dsutdsggdsd s My only feedback is that scope creep during development led to costs being higher than the initial estimate.",
        variant: "Standard Build",
        reply: "Nicole, thank you for the feedback. We've updated our scoping process to prevent this. Let's chat about offsetting strategies for future phases.",
        likes: 4,
        dislikes: 1,
      },
      {
        rating: 5,
        date: "01/04/26",
        authorName: "James Wright",
        verified: true,
        location: "BOSTON",
        title: "Exceeded Every Expectation",
        text: "From discovery to delivery, the Studio team were phenomenal. They deeply understood our business needs and built something that scales perfectly with us. Best decision we made.",
        variant: "Enterprise Custom Build",
        reply: "James, thank you! Your willingness to collaborate made this a truly special project. We're excited to see what you build next.",
        likes: 15,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "30/03/26",
        authorName: "Anna Mueller",
        verified: true,
        location: "BERLIN",
        title: "Professional & Reliable Partnership",
        text: "We engaged Studio for a complex custom build and they delivered d sdsd sds dsdsds dwdsdss flawlessly. The code quality is exceptional, documentation is thorough, and they're still supporting us post-launch.",
        variant: "Premium Build",
        reply: "Anna, long-term partnerships are what we love! Thank you for entrusting us with your vision.",
        likes: 12,
        dislikes: 0,
      },
      {
        rating: 5,
        date: "28/03/26",
        authorName: "Robert Chen",
        verified: true,
        location: "SINGAPORE",
        title: "Game-Changing Custom Solution",
        text: "We had a very specific set of sssssdsd sd dsdwdwdsdsd  dsdsiuyi98 iuhdsjkhsyf dhshsgds79 oshds7sg hds ds9udhs dsdjsdsids ds gidsd srequirements that no off-the-shelf product could meet. Studio built us a custom solution that is now core to our operations. Incredible value.",
        variant: "Enterprise Custom Build",
        reply: "Robert, we're thrilled the custom solution is driving real value. Your team's involvement in the process was instrumental to success.",
        likes: 18,
        dislikes: 0,
      },
    ],
  },
];

async function fetchJson(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let response;

  try {
    response = await fetch(url, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function normalizeGalleryImages(rawGallery, fallbackImage) {
  function toImageUrl(item) {
    if (typeof item === "string") {
      return item.trim();
    }

    if (item && typeof item === "object") {
      return String(item.url || item.src || item.image || "").trim();
    }

    return "";
  }

  let images = [];

  if (Array.isArray(rawGallery)) {
    images = rawGallery.map(toImageUrl).filter(Boolean);
  } else if (typeof rawGallery === "string") {
    const trimmed = rawGallery.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          images = parsed.map(toImageUrl).filter(Boolean);
        }
      } catch (_error) {
        images = [];
      }
    }

    if (images.length === 0 && trimmed) {
      const byLines = trimmed.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

      images =
        byLines.length === 1 && byLines[0].includes(",")
          ? byLines[0].split(",").map((item) => item.trim()).filter(Boolean)
          : byLines;
    }
  }

  if (images.length === 0) {
    const fallback = String(fallbackImage || "").trim();
    if (fallback) {
      images = [fallback];
    }
  }

  return images.slice(0, 6);
}

function normalizeGalleryVideos(rawVideos) {
  function toVideoUrl(item) {
    if (typeof item === "string") {
      return item.trim();
    }

    if (item && typeof item === "object") {
      return String(item.url || item.src || item.video || item.source || "").trim();
    }

    return "";
  }

  let videos = [];

  if (Array.isArray(rawVideos)) {
    videos = rawVideos.map(toVideoUrl).filter(Boolean);
  } else if (typeof rawVideos === "string") {
    const trimmed = rawVideos.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          videos = parsed.map(toVideoUrl).filter(Boolean);
        }
      } catch (_error) {
        videos = [];
      }
    }

    if (videos.length === 0 && trimmed) {
      const byLines = trimmed.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

      videos =
        byLines.length === 1 && byLines[0].includes(",")
          ? byLines[0].split(",").map((item) => item.trim()).filter(Boolean)
          : byLines;
    }
  }

  return videos.slice(0, 6);
}

function normalizeProductGallery(product) {
  if (!product || typeof product !== "object") {
    return product;
  }

  const primaryImage = typeof product.image === "string" ? product.image.trim() : "";
  const galleryImages = normalizeGalleryImages(product.galleryImages, primaryImage);
  const galleryVideos = normalizeGalleryVideos(product.galleryVideos);
  const slug = String(product.slug || "").trim();
  const href = String(product.href || "").trim();
  const hrefSlug = href.split("/").filter(Boolean).pop() || slug;
  const normalizedHref = hrefSlug ? `/products/${hrefSlug}` : "/products";

  return {
    ...product,
    href: normalizedHref,
    image: primaryImage || galleryImages[0] || "",
    galleryImages,
    galleryVideos,
  };
}

export async function getProducts() {
  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/products/software`);
    return Array.isArray(payload?.data) ? payload.data.map(normalizeProductGallery) : defaultProducts;
  } catch (error) {
    console.error("Failed to fetch products", error);
    return defaultProducts;
  }
}

export async function getProductsCatalog({ q = "", category = "" } = {}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (category) params.set("category", category);

  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/products?${params.toString()}`);
    const products = Array.isArray(payload?.data) ? payload.data.map(normalizeProductGallery) : defaultProducts;
    const categories = Array.isArray(payload?.meta?.categories) ? payload.meta.categories : [];

    return {
      products,
      categories,
    };
  } catch (error) {
    console.error("Failed to fetch product catalog", error);
    return {
      products: defaultProducts,
      categories: Array.from(new Set(defaultProducts.map((product) => product.category))),
    };
  }
}

export async function getFeaturedProducts() {
  const fallbackFeatured = defaultProducts
    .filter((product) => product.showInFeatured || product.isFeatured)
    .map((product) => normalizeProductGallery(product));

  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/products/featured`);
    const data = Array.isArray(payload?.data) ? payload.data.map(normalizeProductGallery) : [];

    return data.length > 0 ? data : fallbackFeatured;
  } catch (error) {
    console.error("Failed to fetch featured products", error);
    return fallbackFeatured;
  }
}

export async function getProductBySlug(slug) {
  const safeSlug = String(slug || "").trim().toLowerCase();

  if (!safeSlug) {
    return null;
  }

  // Always get fallback first in case we need it
  const fallback = defaultProducts.find((product) => {
    if (product.slug === safeSlug) {
      return true;
    }
    const hrefSlug = String(product.href || "").split("/").filter(Boolean).pop();
    return hrefSlug === safeSlug;
  });

  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/products/${encodeURIComponent(safeSlug)}`);
    const product = normalizeProductGallery(payload?.data);

    if (product && typeof product === "object") {
      return product;
    }

    const { products = [] } = await getProductsCatalog();
    const catalogMatch = products.find((item) => {
      const itemSlug = String(item?.slug || "").trim();
      const itemHrefSlug = String(item?.href || "").split("/").filter(Boolean).pop();
      return itemSlug === safeSlug || itemHrefSlug === safeSlug;
    });

    return catalogMatch || fallback || null;
  } catch (error) {
    const { products = [] } = await getProductsCatalog();
    const catalogMatch = products.find((item) => {
      const itemSlug = String(item?.slug || "").trim();
      const itemHrefSlug = String(item?.href || "").split("/").filter(Boolean).pop();
      return itemSlug === safeSlug || itemHrefSlug === safeSlug;
    });

    if (!catalogMatch && !fallback) {
      console.error("Failed to fetch product by slug", error);
      return null;
    }

    return catalogMatch || fallback;
  }
}

