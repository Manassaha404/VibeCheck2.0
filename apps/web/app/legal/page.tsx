import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal | VibeCheck",
  description:
    "Access VibeCheck's legal documents including Terms of Service, Privacy Policy, and Cancellation Policy.",
};

const docs = [
  {
    href: "/legal/terms",
    title: "Terms of Service",
    description:
      "The rules and guidelines governing your use of VibeCheck, including our services, subscriptions, user content, and Google integrations.",
    accent: "var(--color-leaf-green)",
    icon: "📄",
    badge: "Required",
    updated: "August 12, 2026",
  },
  {
    href: "/legal/privacy-policy",
    title: "Privacy Policy",
    description:
      "How we collect, use, protect, and share your personal data — including detailed disclosures for Google OAuth, Google Drive, and Razorpay.",
    accent: "var(--color-sky-blue)",
    icon: "🔒",
    badge: "Google Verified",
    updated: "August 12, 2026",
  },
  {
    href: "/legal/cancellation",
    title: "Cancellation Policy",
    description:
      "How subscription cancellations work on VibeCheck — cancel anytime, keep access until period ends, and understand our no-refund policy.",
    accent: "var(--color-tangerine)",
    icon: "📅",
    badge: "Razorpay",
    updated: "August 12, 2026",
  },
];

export default function LegalIndexPage() {
  return (
    <main
      id="legal-hub"
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-canvas-cream)" }}
    >
      {/* Hero */}
      <section
        className="border-b-2"
        style={{
          borderColor: "var(--color-ink-charcoal)",
          backgroundColor: "var(--color-ink-charcoal)",
        }}
      >
        <div
          className="mx-auto px-6 py-20"
          style={{ maxWidth: "var(--spacing-container-max)" }}
        >
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="text-label-sm hover:underline"
                  style={{ color: "var(--color-leaf-green)" }}
                >
                  Home
                </Link>
              </li>
              <li className="text-label-sm" style={{ color: "var(--color-outline)" }}>
                /
              </li>
              <li
                className="text-label-sm"
                style={{ color: "var(--color-canvas-cream)" }}
                aria-current="page"
              >
                Legal
              </li>
            </ol>
          </nav>
          <h1
            className="text-display-lg mb-4"
            style={{ color: "var(--color-pure-white)" }}
          >
            Legal{" "}
            <span style={{ color: "var(--color-electric-sun)" }}>Hub</span>
          </h1>
          <p
            className="text-body-lg"
            style={{
              color: "var(--color-canvas-cream)",
              opacity: 0.8,
              maxWidth: "560px",
            }}
          >
            We believe in full transparency. Here you&rsquo;ll find all our
            legal documents written in clear, plain language.
          </p>
        </div>
      </section>

      {/* Doc Cards */}
      <section className="mx-auto px-6 py-16" style={{ maxWidth: "var(--spacing-container-max)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              id={`legal-card-${doc.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group block border-2 p-6 transition-all card-lift"
              style={{
                borderColor: "var(--color-ink-charcoal)",
                backgroundColor: "var(--color-surface-container-lowest)",
                boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
                textDecoration: "none",
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center text-2xl border-2 mb-5"
                style={{
                  borderColor: "var(--color-ink-charcoal)",
                  backgroundColor: doc.accent,
                }}
                aria-hidden="true"
              >
                {doc.icon}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h2
                  className="text-headline-sm"
                  style={{ fontSize: "20px", lineHeight: "26px", color: "var(--color-ink-charcoal)" }}
                >
                  {doc.title}
                </h2>
              </div>
              <span
                className="text-label-sm px-2 py-0.5 border mb-3 inline-block"
                style={{
                  borderColor: doc.accent,
                  color: "var(--color-ink-charcoal)",
                  backgroundColor: doc.accent,
                  opacity: 0.9,
                }}
              >
                {doc.badge}
              </span>
              <p
                className="text-body-md mb-4"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {doc.description}
              </p>
              <p
                className="text-label-sm"
                style={{ color: "var(--color-outline)" }}
              >
                Updated: {doc.updated}
              </p>
              <div
                className="mt-4 text-label-md font-semibold flex items-center gap-1"
                style={{ color: "var(--color-primary)" }}
              >
                Read document <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
