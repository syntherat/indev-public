"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchAccountOrders, fetchLibraryDownloadUrl } from "@/lib/accountApi";
import { getProductsCatalog } from "@/lib/productsApi";
import styles from "./page.module.css";

const PRODUCT_FALLBACK_IMAGE = "/assets/product-fallback.svg";

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

function toProjectKey(item) {
  return String(item?.productId || item?.slug || item?.name || "project").toLowerCase();
}

export default function MyLibraryPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [errorNotice, setErrorNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingKey, setDownloadingKey] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setErrorNotice("");
      setLoading(false);
      return;
    }

    let isActive = true;

    const load = async () => {
      setLoading(true);
      setErrorNotice("");

      try {
        const payload = await fetchAccountOrders();

        if (!isActive) {
          return;
        }

        setOrders(payload?.data?.items || []);
      } catch (_error) {
        if (!isActive) {
          return;
        }

        setErrorNotice("Unable to load projects right now.");
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

  useEffect(() => {
    if (!isAuthenticated) {
      setCatalogProducts([]);
      return;
    }

    let isActive = true;

    const loadCatalog = async () => {
      try {
        const payload = await getProductsCatalog();

        if (!isActive) {
          return;
        }

        setCatalogProducts(Array.isArray(payload?.products) ? payload.products : []);
      } catch (_error) {
        if (!isActive) {
          return;
        }

        setCatalogProducts([]);
      }
    };

    loadCatalog();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const catalogLookup = useMemo(() => {
    const map = new Map();

    for (const product of catalogProducts) {
      const productId = String(product?.id || "").trim().toLowerCase();
      const slug = String(product?.slug || "").trim().toLowerCase();
      const hrefSlug = String(product?.href || "")
        .split("/")
        .filter(Boolean)
        .pop()
        ?.toLowerCase();

      if (productId) {
        map.set(productId, product);
      }

      if (slug) {
        map.set(slug, product);
      }

      if (hrefSlug) {
        map.set(hrefSlug, product);
      }
    }

    return map;
  }, [catalogProducts]);

  const projects = useMemo(() => {
    const map = new Map();

    for (const order of orders) {
      for (const item of order?.items || []) {
        const key = toProjectKey(item);
        const liveProduct = catalogLookup.get(String(item?.productId || item?.slug || "").toLowerCase()) || null;
        const current = map.get(key) || {
          key,
          productId: item?.productId || null,
          slug: item?.slug || null,
          name: item?.name || "Project Component",
          category: item?.category || "Component",
          image: item?.image || "",
          href: item?.href || "",
          unitsPurchased: 0,
          purchases: 0,
          lastPurchasedAt: order?.createdAt || null,
        };

        if (liveProduct) {
          current.name = liveProduct.name || current.name;
          current.category = liveProduct.category || current.category;
          current.image = liveProduct.image || current.image;
          current.href = liveProduct.href || current.href;
          current.slug = liveProduct.slug || current.slug;
          current.imageAlt = liveProduct.imageAlt || current.imageAlt || liveProduct.name || current.name;
        }

        current.unitsPurchased += Number(item?.quantity || 1);
        current.purchases += 1;

        if (!current.lastPurchasedAt || new Date(order?.createdAt || 0) > new Date(current.lastPurchasedAt)) {
          current.lastPurchasedAt = order?.createdAt || current.lastPurchasedAt;
        }

        map.set(key, current);
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const aTime = new Date(a.lastPurchasedAt || 0).getTime();
      const bTime = new Date(b.lastPurchasedAt || 0).getTime();
      return bTime - aTime;
    });
  }, [orders, catalogLookup]);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      const name = String(project?.name || "").toLowerCase();
      const category = String(project?.category || "").toLowerCase();
      return name.includes(query) || category.includes(query);
    });
  }, [projects, searchTerm]);

  if (status === "loading") {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <p>Loading projects...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <h1>Sign in to access My Library</h1>
          <p>Purchased components are tied to your account and will show here after checkout.</p>
          <Link className={styles.primaryBtn} href="/login?returnTo=%2Fmy-library">
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  async function handleDownload(event, project) {
    event.preventDefault();
    event.stopPropagation();

    if (!project?.productId) {
      setErrorNotice("Download is unavailable for this product.");
      return;
    }

    const activeKey = String(project.key || project.productId);
    setDownloadingKey(activeKey);
    setErrorNotice("");

    try {
      const payload = await fetchLibraryDownloadUrl(project.productId);
      const url = payload?.data?.url;

      if (!url) {
        throw new Error("Download URL is unavailable right now.");
      }

      window.location.href = url;
    } catch (error) {
      setErrorNotice(error?.message || "Unable to start download right now.");
    } finally {
      setDownloadingKey("");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <p className={styles.kicker}>Account</p>
        <h1>My Library</h1>
        <p className={styles.lead}>All purchased project components are listed here. Download them anytime.</p>

        <label className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true">
            <Search size={16} strokeWidth={2.2} />
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search projects"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search purchased projects"
          />
        </label>

        {errorNotice ? <p className={styles.errorNotice}>{errorNotice}</p> : null}

        {loading ? (
          <article className={styles.emptyCard}>
            <h2>Loading your projects...</h2>
          </article>
        ) : projects.length === 0 ? (
          <article className={styles.emptyCard}>
            <h2>No purchased projects yet</h2>
            <p>Checkout a product and it will be added here instantly.</p>
            <Link className={styles.secondaryBtn} href="/products">
              Browse Products
            </Link>
          </article>
        ) : filteredProjects.length === 0 ? (
          <article className={styles.emptyCard}>
            <h2>No matching project</h2>
            <p>Try another search keyword.</p>
          </article>
        ) : (
          <div className={styles.grid}>
            {filteredProjects.map((project) => {
              const projectHref = project.href || "/products";

              return (
                <article
                  className={styles.card}
                  key={project.key}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(projectHref)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(projectHref);
                    }
                  }}
                >
                  <img
                    className={styles.cardImage}
                    src={project.image || PRODUCT_FALLBACK_IMAGE}
                    alt={project.name || "Product image"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                    }}
                  />

                  <div className={styles.cardBody}>
                    <p className={styles.cardTag}>{project.category}</p>
                    <h2>{project.name}</h2>
                    <p>Purchased on: {formatDate(project.lastPurchasedAt)}</p>

                    <div className={styles.cardActions}>
                      <a
                        href="#"
                        className={`${styles.downloadBtn} ${!project?.productId ? styles.downloadBtnMuted : ""}`.trim()}
                        onClick={(event) => handleDownload(event, project)}
                        aria-disabled={!project?.productId || downloadingKey === String(project.key || project.productId)}
                      >
                        <Download size={15} strokeWidth={2.4} />
                        {downloadingKey === String(project.key || project.productId) ? "Preparing..." : "Download"}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
