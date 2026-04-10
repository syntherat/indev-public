import { notFound } from "next/navigation";
import { getProductBySlug, getProductsCatalog } from "@/lib/productsApi";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import ProductFaqAccordion from "@/components/ProductFaqAccordion";
import ProductDetailPurchaseActions from "@/components/products/ProductDetailPurchaseActions";
import ProductReviewsSection from "@/components/products/ProductReviewsSection";

export const dynamic = "force-dynamic";

const FALLBACK_PRODUCT_SLUGS = ["commerce-flow", "pulse-mobile", "ops-atlas", "studio-custom"];

export async function generateStaticParams() {
  const { products = [] } = await getProductsCatalog();
  const slugs = new Set(FALLBACK_PRODUCT_SLUGS);

  for (const product of products) {
    const slug = String(product?.slug || "").trim();
    if (slug) {
      slugs.add(slug);
      continue;
    }

    const hrefSlug = String(product?.href || "")
      .split("/")
      .filter(Boolean)
      .pop();

    if (hrefSlug) {
      slugs.add(hrefSlug);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

function normalizeSpecItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const label = String(item.label || "").trim();
      const value = String(item.value || "").trim();

      if (!label || !value) {
        return null;
      }

      return { label, value };
    })
    .filter(Boolean);
}

function normalizeFaqItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const question = String(item.question || "").trim();
      const answer = String(item.answer || "").trim();

      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter(Boolean);
}

function buildFallbackSpecItems(product) {
  return [
    { label: "Category", value: product.category || "General" },
    { label: product.statLabel || "Primary Metric", value: product.statValue || "N/A" },
  ];
}

function formatPrice(value) {
  const num = Number(value || 0);
  if (num === 0) return "Custom pricing";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams?.slug);

  if (!product) {
    notFound();
  }

  const normalizedGallery = Array.isArray(product.galleryImages)
    ? product.galleryImages.filter(Boolean).slice(0, 6)
    : [];

  const normalizedVideos = Array.isArray(product.galleryVideos)
    ? product.galleryVideos.filter(Boolean).slice(0, 6)
    : [];

  const gallery = normalizedGallery.length > 0
    ? normalizedGallery
    : product.image
      ? [product.image]
      : [];

  const normalizedSpecItems = normalizeSpecItems(product.specItems);
  const specItems = normalizedSpecItems.length > 0 ? normalizedSpecItems : buildFallbackSpecItems(product);
  const faqItems = normalizeFaqItems(product.faqItems);
  const fallbackFaqItems = [
    {
      question: "What support is included with this product?",
      answer: "Support terms are tailored per product and finalized during implementation planning.",
    },
    {
      question: "Can support terms be customized?",
      answer: "Yes, based on deployment scale and support expectations.",
    },
    {
      question: "What happens if I need additional support?",
      answer: "Our support team is available 24/7 to assist with any issues or questions regarding your implementation.",
    },
    {
      question: "Is training included with purchase?",
      answer: "Yes, comprehensive onboarding and training sessions are included for all new customers.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely. You can modify your plan at any time based on your evolving needs.",
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day satisfaction guarantee. If you're not happy with the product, we'll provide a full refund.",
    },
  ];
  const faqList = faqItems.length > 0 ? faqItems : fallbackFaqItems;
  const rating = Number.isFinite(Number(product.rating)) ? Number(product.rating) : null;

  return (
    <main className="pdp-root">
      <section className="pdp-hero-wrap">
        <div className="products-page-shell pdp-hero-grid">
          <div className="pdp-gallery-card">
            <ProductMediaGallery images={gallery} videos={normalizedVideos} alt={product.imageAlt || product.name} />
          </div>

          <div className="pdp-summary-card">
            <p className="section-kicker">{product.category}</p>
            <h1>{product.name}</h1>
            {product.productSubtitle ? <p className="pdp-subtitle">{product.productSubtitle}</p> : null}

            <div className="pdp-badges-row">
              {product.isBestSeller ? <span className="pdp-best-seller-chip">Best Seller</span> : null}
              {rating !== null ? <span className="pdp-rating-chip">★ {rating.toFixed(1)}</span> : null}
            </div>

            <p className="pdp-description">{product.description || product.detail}</p>
            {product.detail && product.detail !== product.description ? <p className="pdp-detail-copy">{product.detail}</p> : null}

            <div className="pdp-price-row">
              <strong>{formatPrice(product.price)}</strong>
            </div>

            <ProductDetailPurchaseActions product={product} />

            {Array.isArray(product.bullets) && product.bullets.length > 0 ? (
              <ul className="pdp-bullet-list">
                {product.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="pdp-section-wrap">
        <div className="products-page-shell">
          <div className="pdp-faq-section">
            <div className="pdp-faq-left">
              <h2>Frequently asked questions</h2>
              <div className="pdp-faq-cta-block">
                <h3>Questions about your implementation?</h3>
                <p>Our team is ready to help you get started with the right configuration.</p>
                <div className="pdp-faq-cta-actions">
                  <a href="/contact" className="pdp-faq-cta-btn pdp-faq-cta-btn-primary">
                    Contact Us
                  </a>
                  <a href="/contact" className="pdp-faq-cta-btn pdp-faq-cta-btn-secondary">
                    Book a Call
                  </a>
                </div>
              </div>
            </div>

            <div className="pdp-faq-right">
              <ProductFaqAccordion items={faqList} />
            </div>
          </div>
        </div>
      </section>

      <section className="pdp-section-wrap">
        <div className="products-page-shell">
          <article className="pdp-specs-card">
            <h3>Other Details</h3>
            <div className="pdp-specs-grid">
              {specItems.map((item, index) => (
                <div key={`${item.label}-${index}`} className="pdp-spec-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="pdp-section-wrap">
        <div className="products-page-shell">
          <ProductReviewsSection productName={product.name} rating={rating} product={product} />
        </div>
      </section>
    </main>
  );
}
