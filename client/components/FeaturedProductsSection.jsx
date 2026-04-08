"use client";

import { CheckCircle2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import usePurchasedProductIds from "@/components/purchases/usePurchasedProductIds";

function formatPrice(value) {
  const num = Number(value || 0);
  if (num === 0) return "Custom pricing";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
}

const defaultFeaturedProducts = [
  {
    name: "Commerce Flow",
    description: "A premium storefront + operations suite for modern retail teams.",
    price: "₹2,00,000",
    href: "/products/commerce-flow",
    image: "/assets/featured-commerce.svg",
    imageAlt: "Commerce Flow product preview",
  },
  {
    name: "Pulse Mobile",
    description: "A mobile-first workspace for field teams and fast on-site operations.",
    price: "₹1,50,000",
    href: "/products/pulse-mobile",
    image: "/assets/featured-mobile.svg",
    imageAlt: "Pulse Mobile product preview",
  },
  {
    name: "Ops Atlas",
    description: "An analytics command center for internal operations and decisions.",
    price: "₹1,75,000",
    href: "/products/ops-atlas",
    image: "/assets/featured-analytics.svg",
    imageAlt: "Ops Atlas product preview",
  },
];

export default function FeaturedProductsSection({ products = [] }) {
  const purchasedIds = usePurchasedProductIds();
  const featuredProducts = products.length > 0 ? products : defaultFeaturedProducts;

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
        {featuredProducts.map((product, index) => {
          const isPurchased = product?.id && purchasedIds.has(String(product.id));

          return (
          <article
            className={`featured-card ${isPurchased ? "featured-card-owned" : ""}`.trim()}
            key={product.name}
            data-reveal
            data-reveal-delay={110 + index * 50}
          >
            <a href={product.href} aria-label={`View ${product.name}`}>
              {isPurchased ? (
                <span className="featured-owned-chip">
                  <CheckCircle2 size={14} strokeWidth={2.4} /> In Library
                </span>
              ) : null}
              <img src={product.image} alt={product.imageAlt} className="featured-image" />
            </a>
            <div className="featured-content">
              <h3>
                <a href={product.href} className="featured-title-link">
                  {product.name}
                </a>
              </h3>
              <p>{product.description}</p>

              <div className="featured-footer-row">
                <div className="featured-price-row">
                  <strong>{formatPrice(product.price)}</strong>
                </div>

                <AddToCartButton
                  product={{ id: product.id, slug: product.slug, name: product.name }}
                  className="featured-add-btn"
                  iconOnly={true}
                  purchased={isPurchased}
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
