"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchAccountOrders } from "@/lib/accountApi";
import styles from "./page.module.css";

const CHECKOUT_SUCCESS_STORAGE_KEY = "indev.checkout.success";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CheckoutSuccessPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setCheckoutData(null);
      setLoading(false);
      return;
    }

    let isActive = true;

    const load = async () => {
      setLoading(true);

      try {
        let snapshot = null;

        if (typeof window !== "undefined") {
          const raw = window.sessionStorage.getItem(CHECKOUT_SUCCESS_STORAGE_KEY);
          if (raw) {
            snapshot = JSON.parse(raw);
            window.sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
          }
        }

        if (snapshot?.purchasedItems?.length) {
          if (isActive) {
            setCheckoutData(snapshot);
          }
          return;
        }

        const ordersPayload = await fetchAccountOrders();
        const latestOrder = ordersPayload?.data?.items?.[0] || null;

        if (isActive) {
          setCheckoutData(
            latestOrder
              ? {
                  order: { orderNumber: latestOrder.id },
                  purchasedItems: latestOrder.items || [],
                  checkedOutAt: latestOrder.createdAt,
                }
              : null
          );
        }
      } catch (_error) {
        if (isActive) {
          setCheckoutData(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const purchasedItems = useMemo(() => checkoutData?.purchasedItems || [], [checkoutData]);

  if (status === "loading" || loading) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <p>Loading purchase details...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <h1>Login required</h1>
          <p>Please login to view your checkout success details.</p>
          <Link className={styles.primaryBtn} href="/login?returnTo=%2Fcheckout%2Fsuccess">
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <p className={styles.kicker}>Purchase Complete</p>
        <h1>Checkout successful</h1>
        <p className={styles.lead}>
          Your components are now added to your account. Download them below or open My Library anytime.
        </p>

        <div className={styles.metaRow}>
          <span>Order: {checkoutData?.order?.orderNumber || "-"}</span>
          <span>Purchased on: {formatDate(checkoutData?.checkedOutAt)}</span>
          <span>Items: {purchasedItems.length}</span>
        </div>

        {purchasedItems.length === 0 ? (
          <article className={styles.emptyCard}>
            <h2>No purchased items found.</h2>
            <p>Your checkout was recorded, but item details are not available right now.</p>
          </article>
        ) : (
          <div className={styles.cardsGrid}>
            {purchasedItems.map((item, index) => {
              const downloadHref = item?.href || "#";
              return (
                <article className={styles.itemCard} key={`${item?.productId || item?.slug || item?.name || "item"}-${index}`}>
                  <div className={styles.itemCardImage}>
                    {item?.image ? (
                      <img src={item.image} alt={item?.imageAlt || item?.name} />
                    ) : (
                      <div style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.9rem" }}>No image</div>
                    )}
                  </div>
                  <div className={styles.itemCardContent}>
                    <p className={styles.itemTag}>{item?.category || "Component"}</p>
                    <h2>{item?.name || "Project Component"}</h2>
                    <p>Qty: {item?.quantity || 1}</p>
                    <a
                      href={downloadHref}
                      className={`${styles.downloadBtn} ${downloadHref === "#" ? styles.downloadBtnMuted : ""}`.trim()}
                      onClick={(event) => {
                        if (downloadHref === "#") {
                          event.preventDefault();
                        }
                      }}
                    >
                      Download
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className={styles.actionsRow}>
          <Link className={styles.primaryBtn} href="/my-library">
            Open My Library
          </Link>
          <Link className={styles.secondaryBtn} href="/products">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
