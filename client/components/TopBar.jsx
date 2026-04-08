"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, LogIn, ShoppingCart } from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./TopBar.module.css";
import { useMemo } from "react";

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

export default function TopBar() {
  const pathname = usePathname();
  const { user, status } = useAuth();
  const { cart } = useCart();
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const loginHref = pathname === "/login" ? "/" : `/login?returnTo=${encodeURIComponent(pathname || "/")}`;
  const accountHref = useMemo(() => {
    if (!isAuthenticated) {
      return loginHref;
    }

    return "/account";
  }, [isAuthenticated, loginHref]);

  return (
    <>
      <FloatingNavbar />

      <header className={styles.wrap} aria-label="Top bar">
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink} aria-label="Indev home">
            <img src="/assets/logo-cropped.png" alt="Indev" className={styles.logoImage} />
          </Link>

          <div className={styles.rightRail}>
            {isAuthenticated ? (
              <>
                <Link href="/cart" className={styles.iconButton} aria-label="Shopping cart" title="Shopping cart">
                  <ShoppingCart size={16} strokeWidth={2.2} />
                  {cart?.summary?.itemCount > 0 ? (
                    <span className={styles.cartCount}>{cart.summary.itemCount}</span>
                  ) : null}
                </Link>

                <Link
                  href="/my-library"
                  className={styles.projectsLink}
                  aria-label="Open my library"
                  title="My Library"
                >
                  <FolderOpen size={15} strokeWidth={2.2} />
                  <span>My Library</span>
                </Link>

                <Link href={accountHref} className={styles.avatarLink} aria-label="Open account" title="Open account">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className={styles.avatarImage} referrerPolicy="no-referrer" />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true">
                      {getUserInitials(user?.name)}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Link href={loginHref} className={styles.loginAction} aria-label="Log in" title="Log in">
                <LogIn size={16} strokeWidth={2.2} />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}