"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

const CHECKOUT_SUCCESS_STORAGE_KEY = "indev.checkout.success";

function formatPrice(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
}

export default function CartPage() {
  const router = useRouter();
  const { status } = useAuth();
  const { cart, loading, removeFromCart, checkout } = useCart();
  const [checkoutState, setCheckoutState] = useState({ loading: false, message: "" });

  const items = cart?.items || [];
  const summary = cart?.summary || { itemCount: 0, subtotal: 0 };
  const isAuthenticated = status === "authenticated";

  const estimatedTax = useMemo(() => summary.subtotal * 0.18, [summary.subtotal]);
  const grandTotal = summary.subtotal + estimatedTax;

  async function handleCheckout() {
    setCheckoutState({ loading: true, message: "" });
    try {
      const payload = await checkout();

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          CHECKOUT_SUCCESS_STORAGE_KEY,
          JSON.stringify({
            ...payload?.data,
            checkedOutAt: new Date().toISOString(),
          })
        );
      }

      router.push(payload?.data?.redirectUrl || "/checkout/success");
    } catch (error) {
      setCheckoutState({ loading: false, message: error?.message || "Unable to checkout right now." });
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="cart-page-root">
        <section className="cart-shell">
          <div className="cart-empty-card">
            <p className="section-kicker">Cart</p>
            <h1>Login to access your cart.</h1>
            <p>Your cart is user-specific. Sign in to add products and move to checkout.</p>
            <Link className="cart-cta" href="/login?returnTo=%2Fcart">
              Go to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page-root">
      <section className="cart-shell">
        <header className="cart-header">
          <p className="section-kicker">Cart</p>
          <h1>Your cart</h1>
          <p>{summary.itemCount} item(s) saved for checkout.</p>
        </header>

        {loading ? (
          <div className="cart-empty-card">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty-card">
            <h2>Your cart is empty.</h2>
            <p>Browse products and add items to start checkout.</p>
            <Link className="cart-cta" href="/products">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-list">
              {items.map((item) => (
                <article key={item.productId} className="cart-item-card">
                  <a href={item.href || `/products/${item.slug || ""}`} className="cart-item-media-link">
                    {item.image ? (
                      <img src={item.image} alt={item.imageAlt || item.name} className="cart-item-image" />
                    ) : (
                      <div className="cart-item-image-fallback" />
                    )}
                  </a>

                  <div className="cart-item-body">
                    <h3>
                      <a href={item.href || `/products/${item.slug || ""}`}>{item.name}</a>
                    </h3>
                    <p>{item.category}</p>
                    <div className="cart-item-price-row">
                      <strong>{formatPrice(parseInt(item.price) || 0)}</strong>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-qty-control cart-qty-control-fixed">
                        <span className="cart-qty-fixed">Qty {item.quantity}</span>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-line-total">{formatPrice(item.lineTotal)}</div>
                </article>
              ))}
            </div>

            <aside className="cart-summary-card">
              <h2>Summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(summary.subtotal)}</strong>
              </div>
              <div className="cart-summary-row">
                <span>Estimated tax (18%)</span>
                <strong>{formatPrice(estimatedTax)}</strong>
              </div>
              <div className="cart-summary-row cart-summary-row-total">
                <span>Total</span>
                <strong>{formatPrice(grandTotal)}</strong>
              </div>

              <button
                type="button"
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={checkoutState.loading}
              >
                {checkoutState.loading ? "Starting checkout..." : "Checkout"}
              </button>

              {checkoutState.message ? <p className="cart-checkout-note">{checkoutState.message}</p> : null}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
