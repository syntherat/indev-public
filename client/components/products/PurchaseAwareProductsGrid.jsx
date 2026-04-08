"use client";

import { CheckCircle2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import usePurchasedProductIds from "@/components/purchases/usePurchasedProductIds";

function parsePrice(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));

  return Number.isFinite(numeric) ? numeric : Number.POSITIVE_INFINITY;
}

function formatPrice(value) {
  const num = Number(value || 0);
  if (num === 0) return "Custom pricing";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
}

function getProductHref(product) {
  if (product?.href) {
    return product.href;
  }

  if (product?.slug) {
    return `/products/${product.slug}`;
  }

  return "/products";
}

function getProductRating(product) {
  const rating = Number(product?.rating);

  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

export default function PurchaseAwareProductsGrid({ products = [], sort = "featured" }) {
  const purchasedIds = usePurchasedProductIds();

  const sortedProducts = [...products].sort((left, right) => {
    const leftPurchased = left?.id && purchasedIds.has(String(left.id));
    const rightPurchased = right?.id && purchasedIds.has(String(right.id));

    if (leftPurchased !== rightPurchased) {
      return leftPurchased ? 1 : -1;
    }

    if (sort === "price-low") {
      return parsePrice(left.price) - parsePrice(right.price);
    }

    if (sort === "price-high") {
      return parsePrice(right.price) - parsePrice(left.price);
    }

    if (sort === "name") {
      return left.name.localeCompare(right.name);
    }

    return 0;
  });

  if (sortedProducts.length === 0) {
    return <div className="products-page-empty">No products found for this filter.</div>;
  }

  return (
    <div className="products-catalog-grid">
      {sortedProducts.map((product) => {
        const href = getProductHref(product);
        const rating = getProductRating(product);
        const isBestSeller = Boolean(product.isBestSeller);
        const isPurchased = product?.id && purchasedIds.has(String(product.id));

        return (
          <article key={product.id || product.slug} className={`products-catalog-card ${isPurchased ? "products-catalog-card-owned" : ""}`.trim()}>
            <a className="products-card-media products-media-link" href={href}>
              {isBestSeller ? <span className="products-rank-chip">Best Seller</span> : null}
              {isPurchased ? (
                <span className="products-owned-chip">
                  <CheckCircle2 size={14} strokeWidth={2.4} /> Already in Library
                </span>
              ) : null}
              {product.image ? (
                <img src={product.image} alt={product.imageAlt || product.name} loading="lazy" />
              ) : (
                <div className="products-media-fallback" aria-hidden="true" />
              )}
            </a>

            <div className="products-card-body">
              <h3>
                <a className="products-title-link" href={href}>
                  {product.name}
                </a>
              </h3>
              <p className="products-page-category">{product.category}</p>
              <p>{product.description}</p>

              <div className="products-page-meta">
                <strong>{formatPrice(product.price)}</strong>
              </div>

              <div className="products-card-bottom">
                {rating !== null ? (
                  <span className="products-rating-text">★ {rating.toFixed(1)}</span>
                ) : (
                  <span className="products-rating-placeholder" aria-hidden="true" />
                )}

                <AddToCartButton
                  product={{ id: product.id, slug: product.slug, name: product.name }}
                  className="products-card-add-btn"
                  iconOnly={true}
                  purchased={isPurchased}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}