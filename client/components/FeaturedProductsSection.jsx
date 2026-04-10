"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import usePurchasedProductIds from "@/components/purchases/usePurchasedProductIds";

const PRODUCT_FALLBACK_IMAGE = "/assets/product-fallback.svg";

const FALLBACK_FEATURED_PRODUCTS = [
  {
    id: "fallback-commerce-os",
    slug: "commerce-flow",
    name: "Commerce OS",
    href: "/products/commerce-flow",
    image: "/assets/featured-commerce.svg",
    imageAlt: "Commerce OS preview",
    productSubtitle: "Unified control center for growth teams",
    description: "A command center for inventory, orders, and customer signals.",
    price: "₹1,99,000",
  },
  {
    id: "fallback-pulse-mobile",
    slug: "pulse-mobile",
    name: "Pulse Mobile",
    href: "/products/pulse-mobile",
    image: "/assets/featured-mobile.svg",
    imageAlt: "Pulse Mobile preview",
    productSubtitle: "Real-time field operations companion",
    description: "A mobile workspace for field teams to update tasks and sync instantly.",
    price: "₹1,49,000",
  },
  {
    id: "fallback-ops-atlas",
    slug: "ops-atlas",
    name: "Ops Atlas",
    href: "/products/ops-atlas",
    image: "/assets/featured-analytics.svg",
    imageAlt: "Ops Atlas preview",
    productSubtitle: "Operational analytics command center",
    description: "A cross-team analytics cockpit for daily decision making.",
    price: "₹1,75,000",
  },
];

function parsePrice(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/[^\d.]/g, "").trim();
  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPrice(value) {
  const numericPrice = parsePrice(value);

  if (!numericPrice || numericPrice <= 0) {
    return "Custom pricing";
  }

  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numericPrice)}`;
}

function normalizeFeaturedProduct(product) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const slug = String(product.slug || "").trim();
  const href = String(product.href || "").trim() || (slug ? `/products/${slug}` : "/products");
  const name = String(product.name || "").trim();
  const galleryImage = Array.isArray(product.galleryImages)
    ? (() => {
        const first = product.galleryImages[0];

        if (typeof first === "string") {
          return first.trim();
        }

        if (first && typeof first === "object") {
          return String(first.url || first.src || first.image || "").trim();
        }

        return "";
      })()
    : "";
  const image = String(product.image || "").trim() || galleryImage;

  if (!name) {
    return null;
  }

  return {
    id: product.id,
    slug,
    name,
    href,
    image,
    imageAlt: String(product.imageAlt || `${name} preview`).trim(),
    productSubtitle: String(product.productSubtitle || "").trim(),
    description: String(product.description || "").trim(),
    price: product.price,
  };
}

function FeaturedProductsSkeleton() {
  return (
    <div className="featured-grid" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <article className="featured-card featured-skeleton-card" key={`featured-skeleton-${index}`}>
          <div className="featured-skeleton-image shimmer" />
          <div className="featured-content">
            <div className="featured-skeleton-title shimmer" />
            <div className="featured-skeleton-line shimmer" />
            <div className="featured-skeleton-line featured-skeleton-line-short shimmer" />
            <div className="featured-footer-row">
              <div className="featured-skeleton-price shimmer" />
              <div className="featured-skeleton-cart shimmer" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function FeaturedProductsFailedState() {
  return (
    <div className="featured-failed-state" role="status" aria-live="polite">
      <p className="featured-failed-kicker">Featured products unavailable</p>
      <h3>Failed to load featured products.</h3>
      <p>Try refreshing in a few seconds. If this continues, please check the server/API deployment.</p>
    </div>
  );
}

export default function FeaturedProductsSection({ products = [] }) {
  const purchasedIds = usePurchasedProductIds();
  const sourceProducts = products.length > 0 ? products : FALLBACK_FEATURED_PRODUCTS;
  const cards = useMemo(() => sourceProducts.map(normalizeFeaturedProduct).filter(Boolean), [sourceProducts]);

  return (
    <div className="featured-shell" data-reveal data-reveal-delay="30">
      <div className="featured-header" data-reveal data-reveal-delay="60">
        <p className="section-kicker">Featured Products</p>
        <h2 data-title-reveal>Ready-to-launch product experiences.</h2>
        <p>
          Curated digital products with polished UI, practical workflows, and clear pricing for teams that need speed.
        </p>
      </div>

      <div className="featured-grid">
        {cards.map((product, index) => {
          const isPurchased = product?.id && purchasedIds.has(String(product.id));

          return (
            <article
              className={`featured-card ${isPurchased ? "featured-card-owned" : ""}`.trim()}
              key={product.id || product.slug || product.name}
              data-reveal
              data-reveal-delay={110 + index * 50}
            >
              <a href={product.href} aria-label={`View ${product.name}`}>
                {isPurchased ? (
                  <span className="featured-owned-chip">
                    <CheckCircle2 size={14} strokeWidth={2.4} /> In Library
                  </span>
                ) : null}
                <img
                  src={product.image || PRODUCT_FALLBACK_IMAGE}
                  alt={product.imageAlt}
                  className="featured-image"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                  }}
                />
              </a>
              <div className="featured-content">
                <h3>
                  <a href={product.href} className="featured-title-link">
                    {product.name}
                  </a>
                </h3>
                <p>{product.productSubtitle || product.description || "No subtitle available."}</p>

                <div className="featured-footer-row">
                  <div className="featured-price-row">
                    <strong>{formatPrice(product.price)}</strong>
                  </div>

                  <AddToCartButton
                    product={{ id: product.id, slug: product.slug, name: product.name }}
                    className="featured-add-btn"
                    iconOnly={true}
                    purchased={isPurchased || !product.id}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="featured-actions" data-reveal data-reveal-delay="230">
        <a className="featured-view-all" href="/products">
          View All Products
        </a>
      </div>
    </div>
  );
}
