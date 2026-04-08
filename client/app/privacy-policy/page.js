import styles from "../legal.module.css";

export const metadata = {
  title: "Privacy Policy | Indev",
  description:
    "Learn how Indev collects, uses, shares, and protects information across the website, cart, checkout, and contact flows.",
};

const collectionPoints = [
  "Account details such as your name, email address, avatar, and profile data you choose to save.",
  "Order, cart, and checkout details including items, totals, payment status, and purchase history.",
  "Contact and meeting request details such as message content, company name, guest emails, and scheduling preferences.",
  "Device and usage data such as browser details, page visits, referring pages, and interaction patterns.",
];

const usagePoints = [
  "Create and manage your account, cart, orders, and support requests.",
  "Process purchases and hand payment flow to Razorpay when you check out.",
  "Respond to contact messages and schedule or follow up on call bookings.",
  "Improve site performance, troubleshoot issues, and prevent abuse or fraud.",
];

const sharingPoints = [
  "Service providers that help us host, operate, or support the website.",
  "Razorpay for payment processing and transaction handling.",
  "Google or GitHub when you choose to sign in with one of those providers.",
  "Legal or regulatory authorities when disclosure is required by law or to protect our rights.",
];

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.hero}>
          <article className={styles.heroCard}>
            <p className={styles.eyebrow}>Legal</p>
            <h1>Privacy Policy</h1>
            <p className={styles.lead}>
              This policy explains what we collect when you browse the catalog, create an account, send a
              message, book a call, or check out a product. Payments are processed through Razorpay.
            </p>

            <div className={styles.heroLinks}>
              <a className={styles.primaryLink} href="/terms-of-use">
                Terms of Use
              </a>
              <a href="/contact">Contact Us</a>
            </div>
          </article>

          <aside className={styles.heroAside}>
            <div className={styles.metaCard}>
              <p className={styles.metaLabel}>Last Updated</p>
              <p className={styles.metaValue}>April 8, 2026</p>
              <p className={styles.metaNote}>
                This policy applies across the public site, account area, cart, checkout, contact, and booking
                flows.
              </p>
            </div>

            <div className={styles.calloutCard}>
              <h3>What matters most</h3>
              <p>
                We only use information to run the site, fulfill orders, support conversations, and keep the
                experience secure.
              </p>
            </div>
          </aside>
        </div>

        <div className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Information We Collect</h2>
            <ul className={styles.bulletList}>
              {collectionPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>How We Use Information</h2>
            <ul className={styles.bulletList}>
              {usagePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>Payments and Razorpay</h2>
            <p>
              When you check out, payment details are handled by Razorpay. We do not need to store your full
              card or bank information on our servers to complete a transaction.
            </p>
            <p>
              We may receive payment confirmation, transaction identifiers, and order status from Razorpay so we
              can complete your purchase, reconcile orders, and provide support.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Sharing Information</h2>
            <ul className={styles.bulletList}>
              {sharingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>Cookies, Sessions, and Local Storage</h2>
            <p>
              The site may use cookies or similar storage for authentication, session continuity, cart state,
              and basic preferences. These tools help pages remember who you are and keep your cart available
              while you browse.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Retention, Security, and Your Choices</h2>
            <p>
              We keep information for as long as needed to provide the service, meet legal obligations, resolve
              disputes, and maintain business records. We use reasonable technical and organizational safeguards
              to protect data, but no system is perfectly secure.
            </p>
            <p>
              You can request access, correction, or deletion of personal information where applicable. You can
              also stop using the service or clear browser storage to limit future collection.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>Children and Contact</h2>
            <p>
              The site is not intended for children under 13, and we do not knowingly collect personal data from
              children in that age group.
            </p>
            <p>
              If you have a privacy question or want to make a request, use the contact page and include enough
              detail for us to identify the relevant account or submission.
            </p>
          </article>
        </div>

        <article className={styles.calloutCard}>
          <h2>Changes to this policy</h2>
          <p>
            We may update this policy when the website, products, or payment flow changes. The newest version will
            always be posted on this page.
          </p>
          <div className={styles.relatedLinks}>
            <a href="/terms-of-use">Read the Terms of Use</a>
            <a href="/contact">Contact Support</a>
          </div>
        </article>
      </section>
    </main>
  );
}