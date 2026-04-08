"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { user, status } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(user);

  return (
    <main className={styles.profilePage}>
      <section className={styles.card}>
        <p className={styles.kicker}>Profile</p>
        <h1>Profile page coming next.</h1>

        {isAuthenticated ? (
          <div className={styles.userRow}>
            {user.avatarUrl ? (
              <img className={styles.avatar} src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className={styles.avatarFallback}>{getUserInitials(user.name)}</span>
            )}

            <div>
              <strong>{user.name || "Signed in user"}</strong>
              <p>{user.email || `Connected with ${user.provider}`}</p>
            </div>
          </div>
        ) : (
          <p className={styles.copy}>
            Sign in with Google or GitHub first, then this page can grow into the full profile experience.
          </p>
        )}

        <div className={styles.actions}>
          <Link className={styles.primary} href="/">
            Back to home
          </Link>
          {!isAuthenticated ? (
            <Link className={styles.secondary} href="/login">
              Go to login
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
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