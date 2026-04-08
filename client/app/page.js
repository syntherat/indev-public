import BlackHoleBackground from "@/components/BlackHoleBackground";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import ServiceGraphic from "@/components/ServiceGraphic";
import SoftwareProductsShowcase from "@/components/SoftwareProductsShowcase";
import TwinklingStarsField from "@/components/TwinklingStarsField";

export default async function HomePage() {
  const services = [
    {
      eyebrow: "Website Design",
      title: "Websites",
      kind: "website",
      description:
        "We create websites with strong hierarchy, premium spacing, and a studio-grade visual finish that feels intentional from the first scroll.",
      chips: ["Brand sites", "Landing pages", "Editorial UI"],
    },
    {
      eyebrow: "Mobile App Design",
      title: "Mobile Apps",
      kind: "mobile",
      description:
        "We design mobile experiences that are easy to navigate, refined in detail, and built for daily use without visual clutter.",
      chips: ["iOS", "Android", "UI systems"],
    },
    {
      eyebrow: "Web App Design",
      title: "Web Apps",
      kind: "webapp",
      description:
        "We build polished web applications, dashboards, and workflows that feel sharp, fast, and product-driven.",
      chips: ["Dashboards", "Portals", "Operations"],
    },
    {
      eyebrow: "Custom Projects",
      title: "Custom Projects",
      kind: "custom",
      description:
        "For custom digital projects, we shape the structure, visuals, and experience around your exact goals and constraints.",
      chips: ["MVPs", "Internal tools", "Special builds"],
    },
  ];

  return (
    <main className="homepage">
      <section className="hero-root" id="home">
        <BlackHoleBackground />

        <div className="hero-content">
          <div className="hero-shell">
            <img className="hero-logo" src="/assets/logo-cropped.png" alt="Indev logo" />
            <h1>
              <span className="hero-title-line">Shipping software that</span>
              <span className="hero-title-line">drives measurable growth</span>
            </h1>
            <p className="hero-subtitle">
              Move faster with sharp product execution, smarter automation, and digital experiences built to
              convert.
            </p>

            <div className="hero-actions">
              <a className="hero-btn hero-btn-primary" href="#section-1">
                Get in touch
              </a>
              <a className="hero-btn hero-btn-secondary" href="#section-2">
                View services
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="homepage-stars-region">
        <TwinklingStarsField count={700} />

        <section className="content-section services-section" id="section-1" data-reveal>
          <div className="services-shell">
            <div className="services-header" data-reveal data-reveal-delay="40">
              <p className="section-kicker">Our Services</p>
              <h2 data-title-reveal>Studio-crafted digital products.</h2>
              <p className="services-summary">
                We provide websites, mobile apps, custom web apps, and product design support with a focused build
                process and a finish that feels premium.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service, index) => {
                const reversed = index % 2 === 1;

                return (
                  <article
                    key={service.eyebrow}
                    className={`service-feature ${reversed ? "service-feature-reversed" : ""}`}
                    data-reveal
                    data-reveal-delay={120 + index * 55}
                  >
                    <div className="service-visual">
                      <div className="service-visual-shell">
                        <div className="service-visual-topbar">
                          <span>{service.eyebrow}</span>
                          <span className="service-visual-badge">Preview</span>
                        </div>

                        <div className="service-visual-stage">
                          <ServiceGraphic kind={service.kind} />
                        </div>
                      </div>
                    </div>

                    <div className="service-copy">
                      <p className="service-index">0{index + 1}</p>
                      <p className="service-eyebrow">{service.eyebrow}</p>
                      <h3>{service.title}</h3>
                      <p className="service-description">{service.description}</p>

                      <div className="service-pills">
                        {service.chips.map((chip) => (
                          <span key={chip}>{chip}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        <section className="content-section products-section" id="section-2">
          <SoftwareProductsShowcase />
        </section>

        <section className="content-section featured-section" id="section-3" data-reveal>
          <FeaturedProductsSection />
        </section>

        <section className="content-section booking-section" id="section-4" data-reveal>
          <div className="booking-shell">
            <div className="booking-copy" data-reveal data-reveal-delay="60">
              <p className="section-kicker">Booking</p>
              <h2 data-title-reveal data-title-delay="40">Ready to build something sharper?</h2>
              <p className="booking-summary">
                Reach out for a direct conversation or book a call if you want to move fast on scope, direction,
                and next steps.
              </p>

              <div className="booking-points">
                <span>Fast response</span>
                <span>Clear scope</span>
                <span>Practical next steps</span>
              </div>
            </div>

            <div className="booking-panel" data-reveal data-reveal-delay="130">
              <div className="booking-card">
                <p className="booking-card-label">Start here</p>
                <h3>Choose the path that fits best.</h3>
                <p>
                  If you already know what you need, send a message. If you want to walk through the project,
                  book a call.
                </p>

                <div className="booking-actions">
                  <a className="booking-btn booking-btn-primary" href="/contact">
                    Contact
                  </a>
                  <a className="booking-btn booking-btn-secondary" href="/contact">
                    Book a Call
                  </a>
                </div>
              </div>

              <div className="booking-note">
                <span>Typical response time</span>
                <strong>Within 1 business day</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
}
