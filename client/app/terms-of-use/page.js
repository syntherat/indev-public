import styles from "../legal.module.css";

export const metadata = {
  title: "Terms of Use | Indev",
  description:
    "Terms governing use of the Indev website, product catalog, checkout flow, contact forms, and call bookings.",
};

const usePoints = [
  "Browse the site, view products, and submit contact or booking requests for lawful purposes only.",
  "Keep account details accurate and protect the credentials or sessions used to access your account.",
  "Use checkout only for legitimate purchases and provide accurate billing and contact information.",
  "Respect the site, its content, and other users by avoiding misuse, interference, or abusive behavior.",
];

const prohibitedPoints = [
  "Trying to break, reverse engineer, or disrupt the website or its connected services.",
  "Submitting false order, contact, or booking information.",
  "Using the site to upload harmful code, spam, or unauthorized promotional material.",
  "Misusing another person's account, payment method, or personal information.",
];

const paymentPoints = [
  "Payment processing is handled through Razorpay and may be subject to Razorpay's own terms and policies.",
  "Product pricing, tax estimates, and availability may change before checkout is completed.",
  "Custom work, support scope, booking outcomes, or refunds may be governed by a separate written agreement.",
  "We can cancel or refuse an order if we suspect fraud, abuse, or a pricing or availability error.",
];

export default function TermsOfUsePage() {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.hero}>
          <article className={styles.heroCard}>
            <p className={styles.eyebrow}>Legal</p>
            <h1>Terms of Use</h1>
            <p className={styles.lead}>
              These terms govern your use of the website, product pages, cart, checkout, contact forms, booking
              flows, and account features. If you do not agree, do not use the site.
            </p>

            <div className={styles.heroLinks}>
              <a className={styles.primaryLink} href="/privacy-policy">
                Privacy Policy
              </a>
              <a href="/contact">Contact Us</a>
            </div>
          </article>

          <aside className={styles.heroAside}>
            <div className={styles.metaCard}>
              <p className={styles.metaLabel}>Last Updated</p>
              <p className={styles.metaValue}>April 8, 2026</p>
              <p className={styles.metaNote}>
                These terms apply to the public website and all related interactions, including purchases and
                call bookings.
              </p>
            </div>

            <div className={styles.calloutCard}>
              <h3>Short version</h3>
              <p>
                Use the site responsibly, pay through the approved checkout flow, and keep your account secure.
              </p>
            </div>
          </aside>
        </div>

        <div className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Acceptance and Eligibility</h2>
            <p>
              By using the site, you agree to these terms and to any posted policies that apply to a specific
              product or service. You must be able to form a binding contract under applicable law to make a
              purchase.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Permitted Use</h2>
            <ul className={styles.bulletList}>
              {usePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>Purchases and Razorpay Payments</h2>
            <ul className={styles.bulletList}>
              {paymentPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>Bookings, Contact Forms, and Support</h2>
            <p>
              Meeting requests, contact messages, and guest email submissions are not confirmed until the request
              is reviewed or approved. Any meeting time, link, or follow-up message may be adjusted based on
              availability and project fit.
            </p>
            <p>
              When you submit a form, you authorize us to reply by email or through the scheduling details you
              provide.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Prohibited Conduct</h2>
            <ul className={styles.bulletList}>
              {prohibitedPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>Product Information and Availability</h2>
            <p>
              Product descriptions, pricing, ratings, and availability are provided for convenience
              and may be updated before or after you place an order. We may correct obvious errors or withdraw a
              listing if needed.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Third-Party Services and Content</h2>
            <p>
              Some features rely on third-party services such as Razorpay, Google, and GitHub. Those services are
              governed by their own terms, policies, and availability.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Intellectual Property</h2>
            <p>
              The site, its layout, branding, graphics, text, and code are owned by Indev or its licensors and
              are protected by applicable intellectual property laws. You may not copy or reuse them except as
              allowed by law or with written permission.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Disclaimer and Limitation of Liability</h2>
            <p>
              The site is provided on an "as is" and "as available" basis. To the fullest extent allowed by law,
              we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p>
              To the fullest extent allowed by law, Indev will not be liable for indirect, incidental, special,
              consequential, or punitive damages arising from use of the site or any third-party service.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Changes and Contact</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after an update means you
              accept the revised terms.
            </p>
            <p>
              If you need help with a purchase, booking, or account issue, contact us through the contact page.
            </p>
          </article>
        </div>

        <article className={styles.calloutCard}>
          <h2>Need a written agreement?</h2>
          <p>
            For custom builds, tailored scopes, or enterprise work, a separate written agreement can replace or
            supplement these terms.
          </p>
          <div className={styles.relatedLinks}>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/contact">Contact Support</a>
          </div>
        </article>
      </section>
    </main>
  );
}