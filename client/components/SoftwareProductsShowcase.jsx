"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const defaultProducts = [
  {
    id: "commerce-os",
    name: "Commerce OS",
    category: "Ecommerce Operations",
    description:
      "A command center for inventory, orders, and customer signals with clear workflows for daily teams.",
    detail:
      "Built for growing brands that need speed without operational noise, with a clean control surface for every critical flow.",
    bullets: ["Unified inventory view", "Order health timeline", "Automated stock alerts"],
    statLabel: "Processing time",
    statValue: "-34%",
    accent: "product-accent-lilac",
  },
  {
    id: "pulse-mobile",
    name: "Pulse Mobile",
    category: "Field Team App",
    description:
      "A mobile workspace for field teams to update tasks, log visits, and sync progress in real time.",
    detail:
      "Designed for low-friction usage in the real world with fast forms, offline support patterns, and clear completion states.",
    bullets: ["Offline-safe actions", "Smart visit checklists", "Instant status sync"],
    statLabel: "Task completion",
    statValue: "+27%",
    accent: "product-accent-amber",
  },
  {
    id: "ops-dashboard",
    name: "Ops Dashboard",
    category: "Internal Web App",
    description:
      "A live performance dashboard for internal teams with role-specific insights and actionable reporting.",
    detail:
      "Structured to help teams make faster decisions, not just read charts, with purposeful views and focused data density.",
    bullets: ["Role-based analytics", "Live KPI boards", "Cross-team drilldowns"],
    statLabel: "Decision cycle",
    statValue: "-41%",
    accent: "product-accent-cyan",
  },
  {
    id: "studio-custom",
    name: "Studio Custom",
    category: "Custom Product Build",
    description:
      "A bespoke software product framework for teams that need unique workflows and flexible foundations.",
    detail:
      "From MVP to scale-up, this model supports unusual product requirements while keeping the UI language elegant and coherent.",
    bullets: ["Modular architecture", "Custom workflow engine", "Future-ready scaling"],
    statLabel: "Delivery velocity",
    statValue: "+2.1x",
    accent: "product-accent-rose",
  },
];

export default function SoftwareProductsShowcase({ products = [] }) {
  const resolvedProducts = useMemo(() => {
    const source = products.length > 0 ? products : defaultProducts;

    return source.map((product) => ({
      ...product,
      id: product.slug || product.id,
      bullets: Array.isArray(product.bullets) ? product.bullets : [],
      accent: product.accent || "product-accent-cyan",
      projectType: product.projectType || product.category || "Completed Project",
      outcomeLabel: product.outcomeLabel || product.statLabel || "Measured impact",
      outcomeValue: product.outcomeValue || product.statValue || "Delivered",
    }));
  }, [products]);

  const [activeId, setActiveId] = useState(resolvedProducts[0]?.id || "");
  const itemRefs = useRef({});

  useEffect(() => {
    if (!resolvedProducts.some((product) => product.id === activeId)) {
      setActiveId(resolvedProducts[0]?.id || "");
    }
  }, [resolvedProducts, activeId]);

  useEffect(() => {
    const cards = resolvedProducts
      .map((product) => itemRefs.current[product.id])
      .filter((card) => card instanceof HTMLElement);

    if (cards.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.dataset.productId || resolvedProducts[0]?.id || "");
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-30% 0px -35% 0px",
      }
    );

    for (const card of cards) {
      observer.observe(card);
    }

    return () => observer.disconnect();
  }, [resolvedProducts]);

  const activeIndex = useMemo(
    () => Math.max(0, resolvedProducts.findIndex((product) => product.id === activeId)),
    [activeId, resolvedProducts]
  );

  const activeProduct = resolvedProducts[activeIndex] || resolvedProducts[0];

  if (!activeProduct) {
    return null;
  }

  return (
    <div className="products-shell">
      <div className="products-header">
        <p className="section-kicker">Past Projects</p>
        <h2>Software we have delivered for real teams.</h2>
      </div>

      <div className="products-layout">
        <div className="products-left">
          {resolvedProducts.map((product, index) => (
            <article
              key={product.id}
              ref={(node) => {
                if (node) {
                  itemRefs.current[product.id] = node;
                }
              }}
              data-product-id={product.id}
              className={`product-item ${product.accent} ${activeId === product.id ? "product-item-active" : ""}`}
            >
              <div className="product-item-head">
                <span className="product-item-index">0{index + 1}</span>
                <span className="product-item-category">{product.projectType}</span>
              </div>

              <div className="product-item-preview">
                <div className="product-preview-panel" />
                <div className="product-preview-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="product-preview-pills">
                  {product.bullets.map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                </div>
              </div>

              <p className="product-item-title">{product.name}</p>
              <span className="product-item-category">Completed delivery</span>
            </article>
          ))}
        </div>

        <aside className="products-right">
          <div className="products-detail">
            <p className="product-detail-index">0{activeIndex + 1}</p>
            <p className="product-detail-category">{activeProduct.projectType}</p>
            <h3>{activeProduct.name}</h3>
            <p className="product-detail-description">{activeProduct.description}</p>
            <p className="product-detail-body">{activeProduct.detail}</p>

            <div className="product-detail-stat">
              <span>{activeProduct.outcomeLabel}</span>
              <strong>{activeProduct.outcomeValue}</strong>
            </div>

            <ul className="product-detail-list">
              {activeProduct.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}