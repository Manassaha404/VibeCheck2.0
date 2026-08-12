import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | VibeCheck",
  description:
    "Read the Terms of Service for VibeCheck. By using our platform, you agree to these terms governing your use of polls, quizzes, forms, petitions, and subscriptions.",
};

const LAST_UPDATED = "August 12, 2026";
const EFFECTIVE_DATE = "August 12, 2026";
const CONTACT_EMAIL = "manassaha425@gmail.com";
const COMPANY_NAME = "VibeCheck";
const WEBSITE = "https://vibecheck.manasx.online";

export default function TermsOfServicePage() {
  return (
    <main
      id="terms-of-service"
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-canvas-cream)" }}
    >
      {/* ── Hero Header ─────────────────────────────────────────────── */}
      <section
        className="border-b-2"
        style={{
          borderColor: "var(--color-ink-charcoal)",
          backgroundColor: "var(--color-ink-charcoal)",
        }}
      >
        <div
          className="mx-auto px-6 py-16"
          style={{ maxWidth: "var(--spacing-container-max)" }}
        >
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="text-label-sm hover:underline"
                  style={{ color: "var(--color-leaf-green)" }}
                >
                  Home
                </Link>
              </li>
              <li
                className="text-label-sm"
                style={{ color: "var(--color-outline)" }}
              >
                /
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-label-sm hover:underline"
                  style={{ color: "var(--color-leaf-green)" }}
                >
                  Legal
                </Link>
              </li>
              <li
                className="text-label-sm"
                style={{ color: "var(--color-outline)" }}
              >
                /
              </li>
              <li
                className="text-label-sm"
                style={{ color: "var(--color-canvas-cream)" }}
                aria-current="page"
              >
                Terms of Service
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="text-label-sm px-3 py-1 border-2"
                style={{
                  backgroundColor: "var(--color-electric-sun)",
                  color: "var(--color-ink-charcoal)",
                  borderColor: "var(--color-electric-sun)",
                }}
              >
                LEGAL
              </span>
              <span
                className="text-label-sm"
                style={{ color: "var(--color-canvas-cream)", opacity: 0.6 }}
              >
                Effective {EFFECTIVE_DATE}
              </span>
            </div>
            <h1
              className="text-display-lg"
              style={{ color: "var(--color-pure-white)" }}
            >
              Terms of{" "}
              <span style={{ color: "var(--color-leaf-green)" }}>Service</span>
            </h1>
            <p
              className="text-body-lg"
              style={{
                color: "var(--color-canvas-cream)",
                opacity: 0.8,
                maxWidth: "680px",
              }}
            >
              These terms govern your use of VibeCheck — our polls, quizzes,
              forms, petitions, and paid subscription services. Please read them
              carefully.
            </p>
            <p className="text-label-sm" style={{ color: "var(--color-leaf-green)" }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* ── Legal Nav Pills ─────────────────────────────────────────── */}
      <section
        className="border-b-2 sticky top-0 z-40"
        style={{
          backgroundColor: "var(--color-canvas-cream)",
          borderColor: "var(--color-ink-charcoal)",
        }}
      >
        <div
          className="mx-auto px-6 py-3 flex gap-3 flex-wrap items-center"
          style={{ maxWidth: "var(--spacing-container-max)" }}
        >
          <span
            className="text-label-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Legal Docs:
          </span>
          <Link
            href="/legal/terms"
            className="text-label-sm px-3 py-1 border-2 transition-all"
            style={{
              backgroundColor: "var(--color-ink-charcoal)",
              color: "var(--color-pure-white)",
              borderColor: "var(--color-ink-charcoal)",
            }}
            aria-current="page"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/privacy-policy"
            className="text-label-sm px-3 py-1 border-2 hover:bg-ink-charcoal hover:text-white transition-all"
            style={{
              backgroundColor: "transparent",
              color: "var(--color-ink-charcoal)",
              borderColor: "var(--color-ink-charcoal)",
            }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/cancellation"
            className="text-label-sm px-3 py-1 border-2 hover:bg-ink-charcoal hover:text-white transition-all"
            style={{
              backgroundColor: "transparent",
              color: "var(--color-ink-charcoal)",
              borderColor: "var(--color-ink-charcoal)",
            }}
          >
            Cancellation Policy
          </Link>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div
        className="mx-auto px-6 py-12 flex gap-12"
        style={{ maxWidth: "var(--spacing-container-max)" }}
      >
        {/* Table of Contents — desktop sidebar */}
        <aside className="hidden lg:block flex-shrink-0" style={{ width: "240px" }}>
          <div
            className="sticky top-20 border-2 p-5"
            style={{
              borderColor: "var(--color-ink-charcoal)",
              backgroundColor: "var(--color-surface-container-lowest)",
              boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
            }}
          >
            <p
              className="text-label-sm mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              ON THIS PAGE
            </p>
            <nav aria-label="Table of contents">
              <ol className="flex flex-col gap-2">
                {[
                  { href: "#acceptance", label: "Acceptance of Terms" },
                  { href: "#services", label: "Our Services" },
                  { href: "#accounts", label: "User Accounts" },
                  { href: "#content", label: "User Content" },
                  { href: "#subscriptions", label: "Subscriptions & Billing" },
                  { href: "#google-services", label: "Google Services" },
                  { href: "#prohibited", label: "Prohibited Conduct" },
                  { href: "#intellectual-property", label: "Intellectual Property" },
                  { href: "#disclaimers", label: "Disclaimers" },
                  { href: "#limitation", label: "Limitation of Liability" },
                  { href: "#termination", label: "Termination" },
                  { href: "#governing-law", label: "Governing Law" },
                  { href: "#contact", label: "Contact Us" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-label-sm hover:underline block"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        {/* Article */}
        <article className="flex-1 min-w-0">
          <LegalSection id="acceptance" title="1. Acceptance of Terms">
            <p>
              By accessing or using {COMPANY_NAME} at{" "}
              <a
                href={WEBSITE}
                className="underline"
                style={{ color: "var(--color-primary)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {WEBSITE}
              </a>{" "}
              (the &ldquo;Platform&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you do not agree, you must not use
              the Platform.
            </p>
            <p>
              These Terms apply to all visitors, registered users, and anyone
              accessing the Platform, including users of our free tier and paid
              subscription plans. We reserve the right to update these Terms at
              any time. Continued use after changes constitutes acceptance.
            </p>
          </LegalSection>

          <LegalSection id="services" title="2. Our Services">
            <p>
              {COMPANY_NAME} is an interactive engagement platform that allows
              users to create, share, and respond to:
            </p>
            <ul>
              <li>
                <strong>Polls</strong> — real-time audience voting and opinion
                gathering
              </li>
              <li>
                <strong>Quizzes</strong> — timed multiple-choice and scored
                assessments
              </li>
              <li>
                <strong>Forms</strong> — data-collection forms with custom
                fields
              </li>
              <li>
                <strong>Petitions</strong> — digital signature campaigns
              </li>
              <li>
                <strong>Google Drive Integration</strong> — export and sync
                response data to your connected Google Drive
              </li>
            </ul>
            <p>
              We offer a free plan and paid subscription tiers with expanded
              limits, processed via{" "}
              <strong>Razorpay</strong>. Service availability may vary by
              region.
            </p>
          </LegalSection>

          <LegalSection id="accounts" title="3. User Accounts">
            <h3>3.1 Registration</h3>
            <p>
              You may register using your email address and a password, or via
              Google OAuth (&ldquo;Sign in with Google&rdquo;). By using Google
              Sign-In you additionally agree to{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google&rsquo;s Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google&rsquo;s Privacy Policy
              </a>
              .
            </p>
            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              credentials. After 5 consecutive failed login attempts, your
              account will be temporarily locked for 30 minutes as a security
              measure.
            </p>
            <h3>3.3 Account Accuracy</h3>
            <p>
              You agree to provide accurate, current, and complete information
              during registration and to update it as needed. Impersonation or
              providing false information is grounds for immediate termination.
            </p>
            <h3>3.4 Age Requirement</h3>
            <p>
              You must be at least 13 years of age to use the Platform. Users
              under 18 must have parental or guardian consent.
            </p>
          </LegalSection>

          <LegalSection id="content" title="4. User Content">
            <h3>4.1 Your Content</h3>
            <p>
              You retain ownership of all polls, quizzes, forms, petitions, and
              other content you create on the Platform (&ldquo;User Content&rdquo;).
              By posting content, you grant {COMPANY_NAME} a non-exclusive,
              worldwide, royalty-free license to host, store, display, and
              transmit your User Content solely to operate and improve the
              Platform.
            </p>
            <h3>4.2 Content Standards</h3>
            <p>You agree not to create or share content that:</p>
            <ul>
              <li>Is unlawful, defamatory, harassing, or threatening</li>
              <li>Infringes any third-party intellectual property rights</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Violates any individual&rsquo;s privacy rights</li>
              <li>
                Constitutes spam, unsolicited advertising, or deceptive
                practices
              </li>
            </ul>
            <h3>4.3 Google Drive Content</h3>
            <p>
              If you connect your Google Drive, {COMPANY_NAME} will create
              folders and upload response files on your behalf. You may
              disconnect Google Drive at any time from your account settings.
              Files already transferred to Drive remain subject to{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google&rsquo;s Terms
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection id="subscriptions" title="5. Subscriptions & Billing">
            <h3>5.1 Paid Plans</h3>
            <p>
              {COMPANY_NAME} offers paid subscription plans processed exclusively
              through{" "}
              <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway.
              By subscribing, you agree to{" "}
              <a
                href="https://razorpay.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Razorpay&rsquo;s Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://razorpay.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Privacy Policy
              </a>
              .
            </p>
            <h3>5.2 Billing Cycle</h3>
            <p>
              Subscriptions are billed on a recurring basis (monthly or yearly)
              starting from the date of activation. Your subscription renews
              automatically unless cancelled.
            </p>
            <h3>5.3 Coupons & Discounts</h3>
            <p>
              Promotional coupon codes may be applied at checkout. Each coupon
              has its own validity period, usage limits, and applicable plan
              restrictions. Coupons cannot be combined, transferred, or applied
              retroactively.
            </p>
            <h3>5.4 Plan Changes</h3>
            <p>
              You may upgrade or downgrade your plan at any time. Plan changes
              may take effect immediately or at the next billing cycle,
              depending on your payment method and the nature of the change
              (governed by Razorpay&rsquo;s subscription update rules).
            </p>
            <h3>5.5 Cancellation</h3>
            <p>
              You may cancel your subscription at any time. See our{" "}
              <Link
                href="/legal/cancellation"
                className="underline font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Cancellation Policy
              </Link>{" "}
              for full details on how cancellations work, including access
              retention until the end of your paid period.
            </p>
            <h3>5.6 Refunds</h3>
            <p>
              All subscription payments are non-refundable except as required by
              applicable law. We do not offer prorated refunds for unused
              subscription periods. If you believe you were charged in error,
              please contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>{" "}
              within 7 days of the charge.
            </p>
          </LegalSection>

          <LegalSection id="google-services" title="6. Google Services Integration">
            <p>
              {COMPANY_NAME} integrates with the following Google services
              subject to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements:
            </p>
            <ul>
              <li>
                <strong>Google Sign-In (OAuth 2.0)</strong> — used to
                authenticate users. We request your name, email address, and
                profile picture (scopes:{" "}
                <code>openid email profile</code>).
              </li>
              <li>
                <strong>Google Drive API</strong> — used, with your explicit
                authorisation, to create folders and upload your form responses
                to your personal Drive (scope:{" "}
                <code>drive.file</code> — we only access files{" "}
                <em>created by VibeCheck</em>).
              </li>
            </ul>
            <p>
              {COMPANY_NAME}&rsquo;s use and transfer of information received from
              Google APIs adheres to the Google API Services User Data Policy,
              including the Limited Use requirements. We do not share your
              Google data with third parties for advertising or any purpose
              beyond providing the Platform&rsquo;s features.
            </p>
          </LegalSection>

          <LegalSection id="prohibited" title="7. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>
                Reverse engineer, scrape, or attempt to extract source code or
                data from the Platform
              </li>
              <li>
                Use automated bots to create accounts, submit responses, or
                interact with the Platform
              </li>
              <li>
                Attempt to gain unauthorised access to other users&rsquo;
                accounts or the Platform&rsquo;s infrastructure
              </li>
              <li>
                Use the Platform to distribute unsolicited commercial messages
                (spam)
              </li>
              <li>
                Circumvent or attempt to circumvent any security or access
                controls
              </li>
              <li>
                Engage in any activity that interferes with or disrupts the
                Platform&rsquo;s performance
              </li>
              <li>
                Create forms or petitions to collect sensitive personal data
                without appropriate legal basis
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="intellectual-property" title="8. Intellectual Property">
            <p>
              The {COMPANY_NAME} name, logo, design system, and all Platform
              software are the exclusive property of {COMPANY_NAME} and are
              protected by copyright, trademark, and other applicable laws. You
              may not copy, modify, distribute, or create derivative works from
              our Platform without prior written consent.
            </p>
            <p>
              Feedback, suggestions, and ideas you submit to us may be used by{" "}
              {COMPANY_NAME} without restriction or compensation to you.
            </p>
          </LegalSection>

          <LegalSection id="disclaimers" title="9. Disclaimers">
            <p>
              THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT.
            </p>
            <p>
              {COMPANY_NAME} does not guarantee that the Platform will be
              uninterrupted, error-free, or free of viruses. We are not
              responsible for any loss of data resulting from your use of the
              Platform.
            </p>
          </LegalSection>

          <LegalSection id="limitation" title="10. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY_NAME.toUpperCase()}{" "}
              SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN
              CONNECTION WITH YOUR USE OF THE PLATFORM, EVEN IF WE HAVE BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              OUR AGGREGATE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF
              THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
              TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </LegalSection>

          <LegalSection id="termination" title="11. Termination">
            <p>
              {COMPANY_NAME} may suspend or terminate your account at any time,
              with or without notice, for violation of these Terms or for any
              other reason at our discretion. You may delete your account from
              your profile settings at any time.
            </p>
            <p>
              Upon termination, your right to use the Platform ceases
              immediately. Sections covering intellectual property, disclaimers,
              limitation of liability, and governing law survive termination.
            </p>
          </LegalSection>

          <LegalSection id="governing-law" title="12. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India, without regard to its conflict of law provisions.
              Any disputes arising under these Terms shall be subject to the
              exclusive jurisdiction of the courts in India. If you are a
              consumer in another jurisdiction, applicable mandatory local
              consumer protection laws may also apply.
            </p>
            <p>
              For users in the European Union, nothing in these Terms affects
              your statutory rights under EU consumer law.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="13. Contact Us">
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <div
              className="border-2 p-5 mt-4"
              style={{
                borderColor: "var(--color-ink-charcoal)",
                backgroundColor: "var(--color-surface-container-low)",
                boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
              }}
            >
              <p className="font-semibold text-body-md">{COMPANY_NAME}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-body-md underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="text-label-sm mt-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                We aim to respond within 5 business days.
              </p>
            </div>
          </LegalSection>

          {/* Footer links */}
          <div
            className="mt-12 pt-8 border-t-2 flex flex-wrap gap-4"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <Link
              href="/legal/privacy-policy"
              className="text-label-md underline"
              style={{ color: "var(--color-primary)" }}
            >
              Privacy Policy →
            </Link>
            <Link
              href="/legal/cancellation"
              className="text-label-md underline"
              style={{ color: "var(--color-primary)" }}
            >
              Cancellation Policy →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

/* ── Reusable Legal Section Component ──────────────────────────────────── */
function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-10 pb-10 border-b-2"
      style={{ borderColor: "var(--color-outline-variant)" }}
    >
      <h2
        className="text-headline-sm mb-5"
        style={{ color: "var(--color-ink-charcoal)" }}
      >
        {title}
      </h2>
      <div className="legal-content">{children}</div>
    </section>
  );
}
