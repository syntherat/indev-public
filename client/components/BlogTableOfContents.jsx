"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./BlogTableOfContents.module.css";

function slugifyHeading(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildToc(markdown) {
  const lines = String(markdown || "").split("\n");
  const toc = [];
  let currentSection = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);

    if (h2) {
      currentSection = {
        id: slugifyHeading(h2[1]),
        label: h2[1],
        level: 2,
        children: [],
      };
      toc.push(currentSection);
      continue;
    }

    if (h3 && currentSection) {
      currentSection.children.push({
        id: slugifyHeading(h3[1]),
        label: h3[1],
        level: 3,
      });
    }
  }

  return toc;
}

export default function BlogTableOfContents({ markdown }) {
  const toc = useMemo(() => buildToc(markdown), [markdown]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (toc.length === 0) {
      return undefined;
    }

    const headingIds = toc.flatMap((section) => [section.id, ...section.children.map((child) => child.id)]);
    const headingElements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (headingElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -72% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((element) => observer.observe(element));

    const firstVisible = headingElements.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0;
    });

    if (firstVisible) {
      setActiveId(firstVisible.id);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <aside className={styles.sidebar} aria-label="Table of contents">
      <div className={styles.sidebarCard}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>≡</span>
          <p className={styles.sidebarTitle}>On this page</p>
        </div>

        <nav className={styles.tocNav}>
          {toc.map((section) => {
            const sectionActive = activeId === section.id || section.children.some((child) => child.id === activeId);

            return (
              <div key={section.id} className={styles.tocGroup}>
                <a
                  href={`#${section.id}`}
                  className={`${styles.tocLink} ${sectionActive ? styles.active : ""}`}
                  data-level="2"
                  aria-current={activeId === section.id ? "true" : undefined}
                >
                  <span className={styles.tocLabel}>{section.label}</span>
                </a>

                {section.children.length > 0 ? (
                  <div className={styles.tocChildren}>
                    {section.children.map((child) => (
                      <a
                        key={child.id}
                        href={`#${child.id}`}
                        className={`${styles.tocLink} ${activeId === child.id ? styles.active : ""}`}
                        data-level="3"
                        aria-current={activeId === child.id ? "true" : undefined}
                      >
                        <span className={styles.tocLabel}>{child.label}</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
