"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Always start each route at the top so reveal thresholds behave consistently.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const runRevealSetup = () => {
      const titleItems = Array.from(document.querySelectorAll("[data-title-reveal]"));
      const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
      const items = [...titleItems, ...revealItems];

      if (items.length === 0) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reset classes on each route mount so the observer always has a clean state.
      for (const item of items) {
        if (item.hasAttribute("data-title-reveal")) {
          item.classList.remove("title-visible");
        }

        if (item.hasAttribute("data-reveal")) {
          item.classList.remove("reveal-visible");
        }
      }

      if (reduceMotion) {
        for (const item of items) {
          if (item.hasAttribute("data-title-reveal")) {
            item.classList.add("title-visible");
          }

          if (item.hasAttribute("data-reveal")) {
            item.classList.add("reveal-visible");
          }
        }

        return undefined;
      }

      for (const item of items) {
        const delay = item.hasAttribute("data-title-reveal")
          ? item.getAttribute("data-title-delay")
          : item.getAttribute("data-reveal-delay");

        if (delay) {
          const delayVar = item.hasAttribute("data-title-reveal") ? "--title-delay" : "--reveal-delay";
          item.style.setProperty(delayVar, `${delay}ms`);
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (entry.target.hasAttribute("data-title-reveal")) {
                entry.target.classList.add("title-visible");
              }

              if (entry.target.hasAttribute("data-reveal")) {
                entry.target.classList.add("reveal-visible");
              }

              observer.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      for (const item of items) {
        observer.observe(item);
      }

      return observer;
    };

    // Wait one frame so route content is mounted before querying reveal nodes.
    let observer = null;
    const frameId = window.requestAnimationFrame(() => {
      observer = runRevealSetup();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return null;
}