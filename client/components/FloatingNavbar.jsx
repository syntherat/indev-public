"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Compass,
  FolderOpen,
  Github,
  House,
  Linkedin,
  Link2,
  ListChecks,
  LogIn,
  Monitor,
  PhoneCall,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Trophy,
  Twitter,
  User,
  FileText,
} from "lucide-react";
import styles from "./FloatingNavbar.module.css";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "products", label: "Products", href: "/products" },
  { id: "blog", label: "Blog", href: "/blog" },
];

const portfolioMenuCards = [
  {
    id: "hotel-system",
    title: "Hotel Management",
    href: "/products",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "logistics-suite",
    title: "Logistics Dashboard",
    href: "/products",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ui-components",
    title: "UI Components",
    href: "/products",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
  },
];

const moreShowcaseCards = [
  {
    id: "guestbook",
    title: "Guestbook",
    description: "Leave a quick note or testimonial.",
    href: "/account",
  },
  {
    id: "bucket-list",
    title: "Bucket List",
    description: "A peek into projects and experiments.",
    href: "/products",
  },
];

const moreQuickLinks = [
  {
    id: "links",
    title: "Links",
    description: "Shortcuts to key pages.",
    href: "/products",
  },
  {
    id: "uses",
    title: "Uses",
    description: "Tools and stack behind the work.",
    href: "/profile",
  },
  {
    id: "attribution",
    title: "Attribution",
    description: "How this experience is crafted.",
    href: "/account",
  },
];

const mobilePageLinks = [
  { id: "home", label: "Home", href: "/", icon: House },
  { id: "about", label: "About", href: "/profile", icon: User },
  { id: "projects", label: "Projects", href: "/products", icon: FolderOpen },
  { id: "blog", label: "Blog", href: "/blog", icon: FileText },
  { id: "guestbook", label: "Guestbook", href: "/account", icon: BookOpen },
  { id: "bucket-list", label: "Bucket List", href: "/products", icon: ListChecks },
  { id: "book-call", label: "Book a call", href: "/contact", icon: PhoneCall },
  { id: "uses", label: "Uses", href: "/profile", icon: Monitor },
  { id: "attribution", label: "Attribution", href: "/account", icon: Trophy },
  { id: "links", label: "Links", href: "/products", icon: Link2 },
];

const mobileConnectLinks = [
  { id: "github", label: "GitHub", href: "https://github.com", icon: Github },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { id: "x", label: "X (Twitter)", href: "https://x.com", icon: Twitter },
];

const mobileLegalLinks = [
  { id: "privacy", label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
  { id: "terms", label: "Terms of Use", href: "/terms-of-use", icon: Scale },
];

function getGreetingByHour(hour) {
  if (hour < 12) {
    return "☀️ Good Morning";
  }

  if (hour < 17) {
    return "⛅ Good Afternoon";
  }

  return "🌙 Good Evening";
}

function getTargetWidth(viewportWidth, contentWidth) {
  const maxAllowed = viewportWidth <= 760 ? viewportWidth * 0.98 : viewportWidth * 0.94;
  const desired = contentWidth > 0 ? contentWidth : viewportWidth * 0.8;

  return Math.min(maxAllowed, desired);
}

function getExpandedWidth(viewportWidth, targetWidth) {
  const maxAllowed = viewportWidth <= 760 ? viewportWidth * 0.98 : viewportWidth * 0.94;
  const desired = Math.max(720, targetWidth + 220);

  return Math.min(maxAllowed, desired);
}

function getUserInitials(name) {
  if (!name) {
    return "U";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

export default function FloatingNavbar() {
  const MOBILE_DRAWER_ANIMATION_MS = 280;
  const greetingRef = useRef(null);
  const navContentRef = useRef(null);
  const measureRef = useRef(null);
  const closeTimerRef = useRef(null);
  const mobileDrawerTimerRef = useRef(null);
  const linkRefs = useRef(new Map());
  const indicatorRef = useRef(null);
  const pathname = usePathname();
  const { user, status } = useAuth();
  const { cart } = useCart();
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const loginHref = pathname === "/login" ? "/" : `/login?returnTo=${encodeURIComponent(pathname || "/")}`;
  const accountHref = isAuthenticated ? "/account" : loginHref;
  const [greeting] = useState(() => getGreetingByHour(new Date().getHours()));
  const [phase, setPhase] = useState("greeting");
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePromptFlip, setMobilePromptFlip] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileDrawerClosing, setMobileDrawerClosing] = useState(false);
  const [widths, setWidths] = useState({ intro: 220, target: 520, expanded: 720 });
  const [openMenu, setOpenMenu] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, transform: "translateX(0px)", width: 0 });
  const [topMarkerStyle, setTopMarkerStyle] = useState({ opacity: 0, transform: "translateX(0px)" });

  const mobileLabel = mobilePromptFlip ? "tap to explore" : "Indev Digital";

  const currentItem = useMemo(() => {
    return navItems.find((item) => item.href === pathname) || null;
  }, [pathname]);

  const mobileDrawerVisible = mobileDrawerOpen || mobileDrawerClosing;

  const openMobileDrawer = () => {
    if (mobileDrawerTimerRef.current) {
      window.clearTimeout(mobileDrawerTimerRef.current);
    }

    setMobileDrawerClosing(false);
    setMobileDrawerOpen(true);
  };

  const closeMobileDrawer = () => {
    if (!mobileDrawerOpen && !mobileDrawerClosing) {
      return;
    }

    if (mobileDrawerTimerRef.current) {
      window.clearTimeout(mobileDrawerTimerRef.current);
    }

    setMobileDrawerClosing(true);
    setMobileDrawerOpen(false);

    mobileDrawerTimerRef.current = window.setTimeout(() => {
      setMobileDrawerClosing(false);
    }, MOBILE_DRAWER_ANIMATION_MS);
  };

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 760);
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);

    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  useEffect(() => {
    const updateWidths = () => {
      const viewportWidth = window.innerWidth;
      const measuredWidth = Math.ceil(measureRef.current?.scrollWidth ?? 0);
      const fallbackWidth = Math.ceil(navContentRef.current?.scrollWidth ?? 0);
      const contentWidth = (measuredWidth || fallbackWidth || 0) + 2;
      const target = getTargetWidth(viewportWidth, contentWidth);
      const measuredGreetingWidth = greetingRef.current?.offsetWidth ?? 220;
      const intro = Math.min(target, Math.max(200, measuredGreetingWidth));
      const expanded = getExpandedWidth(viewportWidth, target);

      setWidths({ intro, target, expanded });
    };

    updateWidths();
    window.addEventListener("resize", updateWidths);

    return () => {
      window.removeEventListener("resize", updateWidths);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setPhase("greeting");
      setOpenMenu(null);

      const mobileSettleTimer = window.setTimeout(() => {
        setPhase("settled");
      }, 4000);

      const mobileFailsafeTimer = window.setTimeout(() => {
        setPhase((prev) => (prev === "greeting" ? "settled" : prev));
      }, 5000);

      return () => {
        window.clearTimeout(mobileSettleTimer);
        window.clearTimeout(mobileFailsafeTimer);
      };
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setPhase("settled");
      return undefined;
    }

    let cancelled = false;

    const expandTimer = window.setTimeout(() => {
      if (!cancelled) {
        setPhase("expanding");
      }
    }, 4000);

    const settleTimer = window.setTimeout(() => {
      if (!cancelled) {
        setPhase("settled");
      }
    }, 5000);

    // Failsafe: never allow greeting to stay forever.
    const failsafeTimer = window.setTimeout(() => {
      if (!cancelled) {
        setPhase((prev) => (prev === "greeting" ? "settled" : prev));
      }
    }, 6500);

    return () => {
      cancelled = true;
      window.clearTimeout(expandTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || phase === "greeting" || mobileDrawerOpen) {
      setMobilePromptFlip(false);
      return undefined;
    }

    const promptTimer = window.setInterval(() => {
      setMobilePromptFlip((prev) => !prev);
    }, 1800);

    return () => {
      window.clearInterval(promptTimer);
    };
  }, [isMobile, phase, mobileDrawerOpen]);

  useEffect(() => {
    if (!mobileDrawerVisible) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileDrawerVisible]);

  useEffect(() => {
    if (!isMobile && mobileDrawerOpen) {
      closeMobileDrawer();
    }
  }, [isMobile, mobileDrawerOpen]);

  useEffect(() => {
    if (phase === "greeting" || !currentItem || isMobile) {
      setIndicatorStyle({ opacity: 0, transform: "translateX(0px)", width: 0 });
      setTopMarkerStyle({ opacity: 0, transform: "translateX(0px)" });
      return;
    }

    const activeLink = linkRefs.current.get(currentItem.id);
    const navShell = navContentRef.current;

    if (!activeLink || !navShell) {
      setIndicatorStyle({ opacity: 0, transform: "translateX(0px)", width: 0 });
      setTopMarkerStyle({ opacity: 0, transform: "translateX(0px)" });
      return;
    }

    const shellRect = navShell.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const offsetX = linkRect.left - shellRect.left;
    const width = Math.max(0, linkRect.width);

    setIndicatorStyle({
      opacity: 1,
      transform: `translateX(${offsetX}px)`,
      width,
    });

    const markerWidth = 30;
    const markerOffsetX = offsetX + (width - markerWidth) / 2;

    setTopMarkerStyle({
      opacity: 1,
      transform: `translateX(${markerOffsetX}px)`,
    });
  }, [currentItem, phase, isMobile]);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (phase === "greeting" && openMenu) {
      setOpenMenu(null);
    }
  }, [phase, openMenu]);

  useEffect(() => {
    if (mobileDrawerOpen) {
      setOpenMenu(null);
      return;
    }
  }, [mobileDrawerOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (mobileDrawerTimerRef.current) {
        window.clearTimeout(mobileDrawerTimerRef.current);
      }
    };
  }, []);

  const openMenuPanel = (menuId) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    setOpenMenu(menuId);
  };

  const closeMenuSoon = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
    }, 240);
  };

  const navVisible = phase !== "greeting";

  return (
    <header className={`${styles.wrap} ${mobileDrawerVisible ? styles.wrapInteractive : ""}`}>
      <nav
        className={`${styles.shell} ${styles[phase]} ${openMenu ? styles.moreOpen : ""} ${isMobile ? styles.mobileShell : ""} ${mobileDrawerVisible ? styles.mobileShellOpen : ""}`}
        style={{
          "--intro-width": `${widths.intro}px`,
          "--target-width": `${widths.target}px`,
          "--expanded-width": `${widths.expanded}px`,
        }}
        onMouseLeave={closeMenuSoon}
        onPointerLeave={closeMenuSoon}
        aria-label="Primary"
      >
        {isMobile ? (
          <button
            type="button"
            className={styles.mobileLauncher}
            onClick={() => (mobileDrawerOpen ? closeMobileDrawer() : openMobileDrawer())}
            aria-expanded={mobileDrawerOpen}
            aria-label={mobileDrawerOpen ? "Close navigation" : "Open navigation"}
          >
            <span className={styles.mobileLauncherTextWrap} aria-live="polite">
              {phase === "greeting" ? (
                <span className={styles.mobileGreetingText}>{greeting}</span>
              ) : (
                <span className={`${styles.mobileLauncherText} ${mobilePromptFlip ? styles.mobileLauncherPrompt : ""}`}>
                  {mobilePromptFlip ? (
                    <>
                      <span className={styles.mobilePromptIconWrap} aria-hidden="true">
                        <Compass size={14} strokeWidth={2.2} />
                      </span>
                      <span className={styles.mobileBrandCopy}>tap to explore</span>
                    </>
                  ) : (
                    <span className={styles.mobileBrandCopy}>Indev Digital</span>
                  )}
                </span>
              )}
            </span>
          </button>
        ) : null}

        <div
          ref={greetingRef}
          className={`${styles.greetingText} ${phase === "greeting" ? styles.popIn : styles.hidden}`}
        >
          {greeting}
        </div>

        <div ref={navContentRef} className={`${styles.navContent} ${navVisible ? styles.visible : ""}`}>
          <span
            ref={indicatorRef}
            className={styles.indicator}
            style={{
              opacity: indicatorStyle.opacity,
              width: `${indicatorStyle.width}px`,
              transform: indicatorStyle.transform,
            }}
          />
          <span
            className={styles.topMarker}
            style={{
              opacity: topMarkerStyle.opacity,
              transform: topMarkerStyle.transform,
            }}
          />
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              ref={(node) => {
                if (node) {
                  linkRefs.current.set(item.id, node);
                } else {
                  linkRefs.current.delete(item.id);
                }
              }}
              className={`${styles.link} ${currentItem?.href === item.href ? styles.active : ""}`}
              aria-current={currentItem?.href === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className={`${styles.linkButton} ${openMenu === "portfolio" ? styles.moreTriggerActive : ""}`}
            onMouseEnter={() => openMenuPanel("portfolio")}
            onPointerEnter={() => openMenuPanel("portfolio")}
            onFocus={() => openMenuPanel("portfolio")}
            onBlur={closeMenuSoon}
            onClick={() => setOpenMenu((prev) => (prev === "portfolio" ? null : "portfolio"))}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpenMenu(null);
              }
            }}
            aria-haspopup="true"
            aria-expanded={openMenu === "portfolio"}
            aria-controls="floating-portfolio-panel"
          >
            Portfolio
            <span className={styles.chevron} aria-hidden="true">
              <ChevronDown size={14} strokeWidth={2.4} className={styles.chevronIcon} />
            </span>
          </button>

          <button
            type="button"
            className={`${styles.linkButton} ${openMenu === "more" ? styles.moreTriggerActive : ""}`}
            onMouseEnter={() => openMenuPanel("more")}
            onPointerEnter={() => openMenuPanel("more")}
            onFocus={() => openMenuPanel("more")}
            onBlur={closeMenuSoon}
            onClick={() => setOpenMenu((prev) => (prev === "more" ? null : "more"))}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpenMenu(null);
              }
            }}
            aria-haspopup="true"
            aria-expanded={openMenu === "more"}
            aria-controls="floating-more-panel"
          >
            More
            <span className={styles.chevron} aria-hidden="true">
              <ChevronDown size={14} strokeWidth={2.4} className={styles.chevronIcon} />
            </span>
          </button>

          <Link href="/contact" className={styles.cta}>
            Book a Call
          </Link>
        </div>

        <aside
          id="floating-portfolio-panel"
          className={`${styles.morePanel} ${styles.portfolioPanel} ${openMenu === "portfolio" ? styles.morePanelOpen : ""}`}
          onMouseEnter={() => openMenuPanel("portfolio")}
          onPointerEnter={() => openMenuPanel("portfolio")}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpenMenu(null);
            }
          }}
          aria-hidden={openMenu !== "portfolio"}
        >
          <div className={styles.portfolioCardsRail}>
            {portfolioMenuCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className={styles.portfolioFeatureCard}
                style={{ backgroundImage: `linear-gradient(180deg, rgba(3, 4, 10, 0.15), rgba(3, 4, 10, 0.82)), url(${card.image})` }}
              >
                <span className={styles.portfolioFeatureOverlay} aria-hidden="true" />
                <span className={styles.portfolioFeatureTitle}>{card.title}</span>
                <span className={styles.portfolioArrow} aria-hidden="true">
                  <ArrowUpRight size={17} strokeWidth={2.4} />
                </span>
              </Link>
            ))}
          </div>
        </aside>

        <aside
          id="floating-more-panel"
          className={`${styles.morePanel} ${styles.classicMorePanel} ${openMenu === "more" ? styles.morePanelOpen : ""}`}
          onMouseEnter={() => openMenuPanel("more")}
          onPointerEnter={() => openMenuPanel("more")}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpenMenu(null);
            }
          }}
          aria-hidden={openMenu !== "more"}
        >
          <div className={styles.moreCardsRail}>
            {moreShowcaseCards.map((card) => (
              <Link key={card.id} href={card.href} className={styles.moreFeatureCard}>
                <span className={styles.moreFeatureOverlay} aria-hidden="true" />
                <span className={styles.moreFeatureTitle}>{card.title}</span>
                <span className={styles.moreFeatureDescription}>{card.description}</span>
              </Link>
            ))}
          </div>

          <div className={styles.moreLinksRail}>
            {moreQuickLinks.map((item) => (
              <Link key={item.id} href={item.href} className={styles.moreInfoCard}>
                <span className={styles.moreInfoGlyph} aria-hidden="true">◻</span>
                <span className={styles.moreInfoText}>
                  <span className={styles.moreInfoTitle}>{item.title}</span>
                  <span className={styles.moreInfoDescription}>{item.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </aside>

        <div ref={measureRef} className={styles.measureRail} aria-hidden="true">
          {navItems.map((item) => (
            <span key={`measure-${item.id}`} className={styles.link}>
              {item.label}
            </span>
          ))}
          <span className={styles.linkButton}>
            Portfolio
            <span className={styles.chevron} aria-hidden="true">
              <ChevronDown size={14} strokeWidth={2.4} className={styles.chevronIcon} />
            </span>
          </span>
          <span className={styles.linkButton}>
            More
            <span className={styles.chevron} aria-hidden="true">
              <ChevronDown size={14} strokeWidth={2.4} className={styles.chevronIcon} />
            </span>
          </span>
          <span className={styles.cta}>Book a Call</span>
        </div>
      </nav>

      {isMobile && mobileDrawerVisible ? (
        <>
          <button
            type="button"
            className={`${styles.mobileBackdrop} ${mobileDrawerClosing ? styles.mobileBackdropClosing : ""}`}
            aria-label="Close navigation drawer"
            onClick={closeMobileDrawer}
          />

          <div className={`${styles.mobileDrawer} ${mobileDrawerClosing ? styles.mobileDrawerClosing : ""}`} role="dialog" aria-modal="true" aria-label="Navigation drawer">
            <div className={styles.mobileDrawerHandle} aria-hidden="true" />

            <div className={`${styles.mobileDrawerTopRow} ${!isAuthenticated ? styles.mobileDrawerTopRowSingle : ""}`}>
              {isAuthenticated ? (
                <>
                  <Link href={accountHref} className={styles.mobileAccountPill} onClick={closeMobileDrawer}>
                    <span className={styles.mobileAccountAvatar} aria-hidden="true">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className={styles.mobileAccountAvatarImage} referrerPolicy="no-referrer" />
                      ) : (
                        <span className={styles.mobileAccountAvatarFallback}>{getUserInitials(user?.name)}</span>
                      )}
                    </span>
                    <span className={styles.mobileAccountName}>{user?.name || "Account"}</span>
                  </Link>

                  <div className={styles.mobileTopActions}>
                    <Link href="/cart" className={styles.mobileTopIconButton} onClick={closeMobileDrawer} aria-label="Cart">
                      <ShoppingCart size={16} strokeWidth={2.2} />
                      {cart?.summary?.itemCount > 0 ? (
                        <span className={styles.mobileTopCount}>{cart.summary.itemCount}</span>
                      ) : null}
                    </Link>
                  </div>
                </>
              ) : (
                <Link href={loginHref} className={styles.mobileLoginWideBtn} onClick={closeMobileDrawer} aria-label="Login">
                  <LogIn size={16} strokeWidth={2.2} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <div className={styles.mobilePatternDivider} aria-hidden="true" />

            <div className={styles.mobileDrawerGrid}>
              <section className={styles.mobileDrawerSection}>
                <p className={styles.mobileDrawerSectionTitle}>Pages</p>
                <div className={styles.mobilePageGrid}>
                  {mobilePageLinks.map((item) => {
                    const Icon = item.icon || ArrowUpRight;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`${styles.mobilePageCard} ${isActive ? styles.mobilePageCardActive : ""}`}
                        onClick={closeMobileDrawer}
                      >
                        <span className={styles.mobilePageIcon}>
                          <Icon size={19} strokeWidth={2.1} />
                        </span>
                        <span className={styles.mobilePageLabel}>{item.label}</span>
                        {isActive ? <span className={styles.mobileActiveDot} aria-hidden="true" /> : null}
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className={styles.mobileDrawerSection}>
                <p className={styles.mobileDrawerSectionTitle}>Connect</p>
                <div className={styles.mobileMiniGrid}>
                  {mobileConnectLinks.map((item) => {
                    const Icon = item.icon || ArrowUpRight;

                    return (
                      <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className={styles.mobileMiniCard}>
                        <span className={styles.mobileMiniIcon}>
                          <Icon size={18} strokeWidth={2.05} />
                        </span>
                        <span className={styles.mobileMiniLabel}>{item.label}</span>
                        <ArrowUpRight size={14} strokeWidth={2.3} />
                      </a>
                    );
                  })}
                </div>
              </section>

              <section className={styles.mobileDrawerSection}>
                <p className={styles.mobileDrawerSectionTitle}>Legal</p>
                <div className={styles.mobileMiniGridTwo}>
                  {mobileLegalLinks.map((item) => {
                    const Icon = item.icon || ArrowUpRight;

                    return (
                      <Link key={item.id} href={item.href} className={styles.mobileMiniCard} onClick={closeMobileDrawer}>
                        <span className={styles.mobileMiniIcon}>
                          <Icon size={18} strokeWidth={2.05} />
                        </span>
                        <span className={styles.mobileMiniLabel}>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
