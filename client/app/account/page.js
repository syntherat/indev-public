"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchAccountOrders, fetchAccountProfile, updateAccountProfile } from "@/lib/accountApi";
import styles from "./page.module.css";

const NAV_ITEMS = ["My Profile", "My Orders"];

function buildProfileFromUser() {
  return {
    contactNumber: "",
    country: "",
    postalCode: "",
  };
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(
    amount
  );
}

function formatPriceWithRupee(value) {
  const num = Number(value || 0);
  if (num === 0) return "Custom pricing";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AccountPage() {
  const { user, status, logout } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const [activeSection, setActiveSection] = useState("My Orders");
  const [profileForm, setProfileForm] = useState(() => buildProfileFromUser());
  const [profileNotice, setProfileNotice] = useState("");
  const [orders, setOrders] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);

  const greetingName = useMemo(() => {
    const name = String(user?.name || "").trim();
    if (!name) {
      return "there";
    }

    return name.split(/\s+/)[0];
  }, [user?.name]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfileForm(buildProfileFromUser());
      setOrders([]);
      setProfileNotice("");
      setSectionLoading(false);
      return;
    }

    let isActive = true;

    const loadAccountData = async () => {
      setSectionLoading(true);
      try {
        const [profilePayload, ordersPayload] = await Promise.all([fetchAccountProfile(), fetchAccountOrders()]);

        if (!isActive) {
          return;
        }

        setProfileForm({
          ...buildProfileFromUser(),
          ...(profilePayload?.data || {}),
        });
        setOrders(ordersPayload?.data?.items || []);
      } catch (_error) {
        if (!isActive) {
          return;
        }

        setProfileNotice("Unable to load some account data right now.");
      } finally {
        if (isActive) {
          setSectionLoading(false);
        }
      }
    };

    loadAccountData();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, user]);

  function handleProfileFieldChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
    if (profileNotice) {
      setProfileNotice("");
    }
  }

  async function handleProfileSave(event) {
    event.preventDefault();

    setProfileNotice("");
    try {
      const payload = await updateAccountProfile(profileForm);
      setProfileForm({
        ...buildProfileFromUser(),
        ...(payload?.data || {}),
      });
      setProfileNotice("Profile updated.");
    } catch (_error) {
      setProfileNotice("Failed to update profile. Try again.");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/";
    } catch (_error) {
      // Keep logout flow resilient and simple.
    }
  }

  if (status === "loading") {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>Loading account...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.authGate}>
          <h1>Sign in to view your account</h1>
          <p>Your orders, addresses, and saved details will appear here once you log in.</p>
          <Link className={styles.loginButton} href="/login?returnTo=%2Faccount">
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.headerTitle}>Account</span>

          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className={styles.contentGrid}>
          <aside className={styles.sideMenu}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.sideMenuItem} ${item === activeSection ? styles.sideMenuItemActive : ""}`.trim()}
                onClick={() => setActiveSection(item)}
              >
                {item}
              </button>
            ))}
          </aside>

          <section className={styles.mainPanel}>
            <h2>Hello {greetingName}</h2>

            {activeSection === "My Profile" ? (
              <article className={styles.profileCard}>
                <h3>Profile Details</h3>
                <p>Update your contact details used for delivery and support.</p>

                <div className={styles.profileIdentity}>
                  <p>
                    Name: <strong>{user?.name || "-"}</strong>
                  </p>
                  <p>
                    Email: <strong>{user?.email || "-"}</strong>
                  </p>
                </div>

                <form className={styles.profileForm} onSubmit={handleProfileSave}>
                  <label>
                    Contact Number
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profileForm.contactNumber}
                      onChange={handleProfileFieldChange}
                      placeholder="+91 98XXXXXXXX"
                    />
                  </label>

                  <label>
                    Country
                    <input
                      type="text"
                      name="country"
                      value={profileForm.country}
                      onChange={handleProfileFieldChange}
                      placeholder="Country"
                    />
                  </label>

                  <label>
                    Postal Code
                    <input
                      type="text"
                      name="postalCode"
                      value={profileForm.postalCode}
                      onChange={handleProfileFieldChange}
                      placeholder="Postal code"
                    />
                  </label>

                  <div className={styles.profileActions}>
                    <button type="submit" className={styles.saveButton}>
                      Save Profile
                    </button>
                    {profileNotice ? <span className={styles.profileNotice}>{profileNotice}</span> : null}
                  </div>
                </form>
              </article>
            ) : sectionLoading ? (
              <article className={styles.orderCard}>
                <h3>Loading orders...</h3>
              </article>
            ) : orders.length === 0 ? (
              <article className={styles.orderCard}>
                <h3>No orders yet</h3>
                <p>Completed checkouts will appear here as your purchase history.</p>
                <Link className={styles.shopButton} href="/products">
                  Browse Products
                </Link>
              </article>
            ) : (
              <div className={styles.ordersStack}>
                {orders.map((order) => (
                  <article className={styles.orderCard} key={order.id}>
                    <div className={styles.orderTopRow}>
                      <p>
                        Order: <strong>{order.id}</strong>
                      </p>
                      <p>
                        Grand Total: <strong>{formatCurrency(order.total)}</strong>
                      </p>
                    </div>

                    <div className={styles.orderMetaRow}>
                      <div>
                        <p>
                          Date: <strong>{formatDate(order.createdAt)}</strong>
                        </p>
                        <p>
                          Fulfillment Status: <strong>{order.fulfillmentStatus || "Processing"}</strong>
                        </p>
                      </div>
                      <div>
                        <p>
                          Total Items: <strong>{order.totalItems || 0}</strong>
                        </p>
                        <p>
                          Payment: <strong>{order.paymentStatus || "Pending"}</strong>
                        </p>
                      </div>
                    </div>

                    <div className={styles.itemsList}>
                      {(order.items || []).map((item, index) => (
                        <div key={`${order.id}-${item.productId || item.slug || index}`} className={styles.itemRow}>
                          <div className={styles.itemThumbWrap}>
                            {item.image ? (
                              <img src={item.image} alt="" className={styles.itemThumb} />
                            ) : (
                              <div className={styles.itemThumbFallback} />
                            )}
                            <span className={styles.itemQty}>{item.quantity || 1}</span>
                          </div>

                          <div className={styles.itemBody}>
                            <p className={styles.itemName}>{item.name || "Product"}</p>
                            <p>{formatPriceWithRupee(item.price)}</p>
                            <p>{item.category || "General"}</p>
                            <p>
                              <a href={item.href || "/products"}>View product</a>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
