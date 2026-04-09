"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { verifyCheckout } from "@/lib/cartApi";

const CHECKOUT_SUCCESS_STORAGE_KEY = "indev.checkout.success";
let razorpayScriptPromise = null;

function formatPrice(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
}

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

export default function CartPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const { cart, loading, removeFromCart, checkout, refreshCart } = useCart();
  const [checkoutState, setCheckoutState] = useState({ loading: false, message: "" });

  const items = cart?.items || [];
  const summary = cart?.summary || { itemCount: 0, subtotal: 0 };
  const isAuthenticated = status === "authenticated";
  const grandTotal = useMemo(() => summary.subtotal, [summary.subtotal]);

  async function handleCheckout() {
    setCheckoutState({ loading: true, message: "" });
    try {
      const payload = await checkout();
      const razorpayConfig = payload?.data?.razorpay;

      if (!razorpayConfig?.orderId || !razorpayConfig?.keyId) {
        throw new Error("Razorpay checkout is not available right now.");
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || typeof window.Razorpay !== "function") {
        throw new Error("Unable to load the payment gateway.");
      }

      const instance = new window.Razorpay({
        key: razorpayConfig.keyId,
        amount: razorpayConfig.amount,
        currency: razorpayConfig.currency || "INR",
        name: razorpayConfig.name || "Indev Digital",
        description: razorpayConfig.description || "Secure checkout",
        order_id: razorpayConfig.orderId,
        prefill: {
          name: razorpayConfig.prefill?.name || user?.name || "",
          email: razorpayConfig.prefill?.email || user?.email || "",
        },
        notes: razorpayConfig.notes || {},
        theme: {
          color: "#111111",
        },
        handler: async (response) => {
          try {
            setCheckoutState({ loading: true, message: "" });

            const verifyPayload = await verifyCheckout({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(
                CHECKOUT_SUCCESS_STORAGE_KEY,
                JSON.stringify({
                  ...verifyPayload?.data,
                  checkedOutAt: verifyPayload?.data?.checkedOutAt || new Date().toISOString(),
                })
              );
            }

            await refreshCart();

            router.push(verifyPayload?.data?.redirectUrl || "/checkout/success");
          } catch (error) {
            setCheckoutState({ loading: false, message: error?.message || "Unable to verify payment right now." });
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutState({ loading: false, message: "Checkout cancelled." });
          },
        },
      });

      instance.on("payment.failed", (response) => {
        setCheckoutState({
          loading: false,
          message: response?.error?.description || "Payment failed. Please try again.",
        });
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
      }

      instance.open();
      setCheckoutState({ loading: false, message: "" });
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
