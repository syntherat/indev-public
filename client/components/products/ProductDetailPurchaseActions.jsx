"use client";

import { CheckCircle2 } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import usePurchasedProductIds from "@/components/purchases/usePurchasedProductIds";

export default function ProductDetailPurchaseActions({ product }) {
  const purchasedIds = usePurchasedProductIds();
  const isPurchased = product?.id && purchasedIds.has(String(product.id));

  return (
    <div className="pdp-purchase-actions">
      {isPurchased ? (
        <div className="pdp-owned-pill" role="status" aria-live="polite">
          <CheckCircle2 size={16} strokeWidth={2.4} /> Already in Library
        </div>
      ) : null}

      <AddToCartButton
        product={{ id: product?.id, slug: product?.slug, name: product?.name }}
        className="pdp-add-btn"
        showIcon={false}
        purchased={isPurchased}
      />
    </div>
  );
}