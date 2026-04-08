"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PixelBlast from "@/components/PixelBlast";
import { getAuthBaseUrl } from "@/lib/authApi";
import { useAuth } from "@/components/auth/AuthProvider";
import styles from "./page.module.css";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.805 12.23c0-.752-.067-1.474-.193-2.167H12v4.103h5.5a4.7 4.7 0 0 1-2.038 3.082v2.56h3.297c1.93-1.777 3.046-4.397 3.046-7.578Z"
        fill="currentColor"
      />
      <path
        d="M12 22c2.76 0 5.073-.915 6.764-2.49l-3.297-2.56c-.915.613-2.086.977-3.467.977-2.664 0-4.92-1.8-5.726-4.22H2.87v2.642A10.206 10.206 0 0 0 12 22Z"
        fill="currentColor"
      />
      <path
        d="M6.274 13.707a6.132 6.132 0 0 1-.32-1.94c0-.673.115-1.327.32-1.94V7.185H2.87A10.206 10.206 0 0 0 1.8 11.767c0 1.645.393 3.203 1.07 4.582l3.404-2.642Z"
        fill="currentColor"
      />
      <path
        d="M12 5.607c1.5 0 2.845.516 3.904 1.53l2.927-2.927C17.069 2.565 14.756 1.5 12 1.5A10.206 10.206 0 0 0 2.87 7.185l3.404 2.642c.806-2.42 3.062-4.22 5.726-4.22Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.08 1.82 2.83 1.3 3.52.99.11-.77.42-1.3.76-1.6-2.67-.3-5.48-1.33-5.48-5.92 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.53 11.53 0 0 1 12 6.3c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function sanitizeReturnTo(value) {
  if (typeof value !== "string") {
    return "/";
  }

  const trimmed = value.trim();

  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/";
  }

  return trimmed;
}

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [returnTo, setReturnTo] = useState("/");
  const authBaseUrl = getAuthBaseUrl();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setReturnTo(sanitizeReturnTo(params.get("returnTo")));
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(returnTo);
    }
  }, [returnTo, router, status]);

  const googleHref = `${authBaseUrl}/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  const githubHref = `${authBaseUrl}/api/auth/github?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className={styles.loginPage}>
      <div className={styles.background} aria-hidden="true">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B19EEF"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      <div className={styles.overlay} />

      <section className={styles.shell}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <ShieldCheck size={14} strokeWidth={2.2} />
            LOG BACK IN
          </p>
          <h1>Welcome Back to Indev Digital.</h1>
          <p>
            Discover the world of software, automation and innovative technology.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Login using <br/>Google or Github.</h2>
            <p>You will be able to access your owned projects and purchase more products.</p>
          </div>

          <div className={styles.actions}>
            <a className={`${styles.button} ${styles.googleButton}`} href={googleHref}>
              <span className={styles.iconBubble}>
                <GoogleLogo />
              </span>
              <span>
                <strong>Continue with Google</strong>
                <small>Connects your Google account to authorize into your IndevDigital account.</small>
              </span>
              <ArrowRight size={16} strokeWidth={2.2} className={styles.buttonArrow} />
            </a>

            <a className={`${styles.button} ${styles.githubButton}`} href={githubHref}>
              <span className={styles.iconBubble}>
                <GitHubLogo />
              </span>
              <span>
                <strong>Continue with GitHub</strong>
                <small>Connects your Github account to authorize into your IndevDigital account.</small>
              </span>
              <ArrowRight size={16} strokeWidth={2.2} className={styles.buttonArrow} />
            </a>
          </div>

          <p className={styles.note}>
            By signing in, you agree to IndevDigital's <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}