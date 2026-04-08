"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, LockKeyhole, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCartButton({ product, className = "", iconOnly = false, showIcon = true, purchased = false }) {
  const pathname = usePathname();
  const { status } = useAuth();
  const { addToCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const loginHref = useMemo(() => {
    const returnTo = pathname || "/";
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [pathname]);

  async function handleClick() {
    if (purchased) {
      return;
    }

    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await addToCart({
        productId: product?.id,
        slug: product?.slug,
        quantity: 1,
      });

      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1300);
    } catch (_error) {
      // Keep UX simple for now; failures can be surfaced in a follow-up iteration.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`cart-add-btn ${iconOnly ? "cart-add-btn-icon-only" : ""} ${justAdded ? "cart-add-btn-added" : ""} ${purchased ? "cart-add-btn-owned" : ""} ${className}`.trim()}
        onClick={handleClick}
        disabled={isSubmitting || purchased}
        aria-label={purchased ? `${product?.name || "item"} already in library` : `Add ${product?.name || "item"} to cart`}
      >
        {showIcon ? (
          purchased ? (
            <Check size={17} strokeWidth={2.4} />
          ) : justAdded ? (
            <Check size={17} strokeWidth={2.4} />
          ) : (
            <ShoppingCart size={16} strokeWidth={2.2} />
          )
        ) : null}
        {!iconOnly && (purchased ? "In Library" : isSubmitting ? "Adding..." : justAdded ? "Added" : "Add to Cart")}
      </button>

      {showLoginModal ? (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-label="Login required">
          <div className="auth-modal-card">
            <div className="auth-modal-topbar">
              <div className="auth-modal-icon-wrap" aria-hidden="true">
                <LockKeyhole size={18} strokeWidth={2.2} />
              </div>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setShowLoginModal(false)}
                aria-label="Close login prompt"
                title="Close"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            <div className="auth-modal-copy">
              <h3>Sign in first</h3>
              <p>You need to be logged in before you can add this item to your cart.</p>
            </div>

            <div className="auth-modal-actions">
              <button
                type="button"
                className="auth-modal-btn auth-modal-btn-secondary"
                onClick={() => setShowLoginModal(false)}
              >
                Not now
              </button>
              <Link className="auth-modal-btn auth-modal-btn-primary" href={loginHref}>
                Continue to login
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
