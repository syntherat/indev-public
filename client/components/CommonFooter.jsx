export default function CommonFooter() {
  return (
    <footer className="common-footer">
      <div className="common-footer-shell">
        <div className="common-footer-brand">
          <p className="common-footer-kicker">Indev</p>
          <h2>Designing software with sharp taste and clean execution.</h2>
          <p className="common-footer-copy">
            Websites, mobile apps, web apps, and custom builds shaped for teams that want something premium,
            practical, and built to last.
          </p>

          <div className="common-footer-actions">
            <a className="common-footer-button common-footer-button-primary" href="/contact">
              Contact
            </a>
            <a className="common-footer-button common-footer-button-secondary" href="/contact">
              Book a Call
            </a>
          </div>
        </div>

        <div className="common-footer-columns">
          <div className="common-footer-column">
            <span className="common-footer-label">Pages</span>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/account">Account</a>
            <a href="/profile">Profile</a>
          </div>

          <div className="common-footer-column">
            <span className="common-footer-label">Work</span>
            <a href="/contact">Contact</a>
            <a href="/contact">Book a Call</a>
            <a href="/services">Software Products</a>
            <a href="/services">Studio Services</a>
          </div>

          <div className="common-footer-column">
            <span className="common-footer-label">Connect</span>
            <a href="mailto:hello@indev.studio">hello@indev.studio</a>
            <a href="https://www.linkedin.com">LinkedIn</a>
            <a href="https://www.instagram.com">Instagram</a>
            <a href="https://x.com">X / Twitter</a>
          </div>
        </div>
      </div>

      <div className="common-footer-bottom">
        <span>© 2026 Indev Studio</span>
        <div className="common-footer-bottom-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}