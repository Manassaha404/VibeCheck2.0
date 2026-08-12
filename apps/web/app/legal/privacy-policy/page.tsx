import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | VibeCheck",
  description:
    "VibeCheck's Privacy Policy explains how we collect, use, protect, and share your personal data, including data collected via Google OAuth, Google Drive, and Razorpay.",
};

const LAST_UPDATED = "August 12, 2026";
const EFFECTIVE_DATE = "August 12, 2026";
const CONTACT_EMAIL = "manassaha425@gmail.com";
const COMPANY_NAME = "VibeCheck";
const WEBSITE = "https://vibecheck.manasx.online";

export default function PrivacyPolicyPage() {
  return (
    <main
      id="privacy-policy"
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
                Privacy Policy
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="text-label-sm px-3 py-1 border-2"
                style={{
                  backgroundColor: "var(--color-sky-blue)",
                  color: "var(--color-ink-charcoal)",
                  borderColor: "var(--color-sky-blue)",
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
              Privacy{" "}
              <span style={{ color: "var(--color-sky-blue)" }}>Policy</span>
            </h1>
            <p
              className="text-body-lg"
              style={{
                color: "var(--color-canvas-cream)",
                opacity: 0.8,
                maxWidth: "680px",
              }}
            >
              We believe privacy is a right, not a privilege. This policy
              explains what data we collect, why we collect it, and how we
              protect it — in plain language.
            </p>
            <p className="text-label-sm" style={{ color: "var(--color-sky-blue)" }}>
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
              backgroundColor: "transparent",
              color: "var(--color-ink-charcoal)",
              borderColor: "var(--color-ink-charcoal)",
            }}
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/privacy-policy"
            className="text-label-sm px-3 py-1 border-2"
            style={{
              backgroundColor: "var(--color-ink-charcoal)",
              color: "var(--color-pure-white)",
              borderColor: "var(--color-ink-charcoal)",
            }}
            aria-current="page"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/cancellation"
            className="text-label-sm px-3 py-1 border-2 transition-all"
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
                  { href: "#who-we-are", label: "Who We Are" },
                  { href: "#data-collected", label: "Data We Collect" },
                  { href: "#how-we-use", label: "How We Use Data" },
                  { href: "#google-data", label: "Google Data" },
                  { href: "#payment-data", label: "Payment Data" },
                  { href: "#data-sharing", label: "Data Sharing" },
                  { href: "#cookies", label: "Cookies & Storage" },
                  { href: "#data-retention", label: "Data Retention" },
                  { href: "#your-rights", label: "Your Rights" },
                  { href: "#children", label: "Children's Privacy" },
                  { href: "#security", label: "Security" },
                  { href: "#changes", label: "Policy Changes" },
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
          {/* Google verification notice */}
          <div
            className="mb-8 border-2 p-5 flex gap-4"
            style={{
              borderColor: "var(--color-leaf-green)",
              backgroundColor: "var(--color-primary-container)",
              boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
            }}
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🔒</span>
            <div>
              <p
                className="text-label-md mb-1"
                style={{ color: "var(--color-on-primary-container)" }}
              >
                Google API Services
              </p>
              <p
                className="text-body-md"
                style={{ color: "var(--color-on-primary-container)" }}
              >
                {COMPANY_NAME}&rsquo;s use and transfer to any other app of
                information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </div>
          </div>

          <LegalSection id="who-we-are" title="1. Who We Are">
            <p>
              {COMPANY_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;) operates the platform at{" "}
              <a
                href={WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {WEBSITE}
              </a>
              . We are the data controller for personal data collected through
              the Platform.
            </p>
            <p>
              For privacy inquiries, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection id="data-collected" title="2. Data We Collect">
            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li>
                <strong>Registration data:</strong> first name, last name,
                username, email address, and password (stored as a bcrypt hash)
              </li>
              <li>
                <strong>Profile data:</strong> avatar image URL and display
                preferences
              </li>
              <li>
                <strong>User-created content:</strong> polls, quizzes, forms,
                petitions, and the responses collected therein
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li>
                <strong>Usage data:</strong> pages visited, features used,
                session duration, and interaction patterns
              </li>
              <li>
                <strong>Device data:</strong> IP address, browser type, and
                operating system (used for security and analytics)
              </li>
              <li>
                <strong>Authentication logs:</strong> login timestamps and
                failed login attempt counts (reset after successful login)
              </li>
            </ul>

            <h3>2.3 Information from Third-Party Services</h3>
            <ul>
              <li>
                <strong>Google OAuth:</strong> your name, email address, Google
                Account ID (&ldquo;sub&rdquo;), and profile picture URL when
                you choose to sign in with Google
              </li>
              <li>
                <strong>Google Drive:</strong> a refresh token (encrypted at
                rest using AES encryption) that allows us to create folders and
                upload files to your Drive on your behalf — only when you
                explicitly connect Google Drive
              </li>
              <li>
                <strong>Razorpay:</strong> subscription ID, payment status, and
                plan details. We do not store raw card numbers or full payment
                details — these are handled exclusively by Razorpay
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="how-we-use" title="3. How We Use Your Data">
            <DataUseTable />
          </LegalSection>

          <LegalSection id="google-data" title="4. Google Data — Limited Use Disclosure">
            <p>
              {COMPANY_NAME}&rsquo;s use of data obtained via Google APIs is
              strictly limited to the following purposes:
            </p>
            <ul>
              <li>
                <strong>Google Sign-In (openid, email, profile):</strong>{" "}
                Authenticating your identity and creating or linking your{" "}
                {COMPANY_NAME} account. We store your Google Account ID to link
                your account, your email for communication, and your name and
                photo for your profile display.
              </li>
              <li>
                <strong>Google Drive (drive.file scope):</strong> Creating
                folders and uploading your form response data files to{" "}
                <em>your own</em> Google Drive. We access only files that{" "}
                {COMPANY_NAME} itself creates — not any other files in your
                Drive. The refresh token is encrypted with AES encryption
                before being stored in our database.
              </li>
            </ul>
            <p>
              We do <strong>not</strong>:
            </p>
            <ul>
              <li>Use Google user data to serve advertisements</li>
              <li>Sell Google user data to third parties</li>
              <li>
                Share Google user data with third parties for any purpose other
                than providing the Platform&rsquo;s features
              </li>
              <li>
                Use Google user data for any purpose not described in this
                Privacy Policy
              </li>
              <li>
                Allow humans to read your Google data unless you have given
                express permission, or it is necessary for security purposes
                such as investigating a bug
              </li>
            </ul>
            <p>
              You can disconnect your Google Drive at any time from your account
              settings. Disconnecting revokes our stored refresh token.
            </p>
          </LegalSection>

          <LegalSection id="payment-data" title="5. Payment Data (Razorpay)">
            <p>
              All payment processing is handled by{" "}
              <strong>Razorpay</strong> (
              <a
                href="https://razorpay.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Razorpay Privacy Policy
              </a>
              ), a PCI-DSS compliant payment gateway. {COMPANY_NAME} does not
              receive, store, or process raw payment card data.
            </p>
            <p>We store the following payment-related data from Razorpay:</p>
            <ul>
              <li>Razorpay Subscription ID (to manage your subscription)</li>
              <li>
                Subscription status (created, authenticated, active, cancelled,
                etc.)
              </li>
              <li>Billing period start and end dates</li>
              <li>Plan ID and coupon redemption records</li>
              <li>
                Razorpay Webhook Event IDs (for idempotency — to prevent
                duplicate event processing)
              </li>
            </ul>
            <p>
              Razorpay&rsquo;s webhook events are verified using a
              cryptographic HMAC-SHA256 signature before being processed. We
              retain payment records for as long as required by Indian tax and
              accounting regulations (typically 7 years).
            </p>
          </LegalSection>

          <LegalSection id="data-sharing" title="6. Data Sharing & Disclosure">
            <p>
              We do not sell your personal data. We share data only in the
              following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We engage trusted third
                parties who process data on our behalf (e.g., Razorpay for
                payments, Google for authentication and Drive integration,
                email delivery providers for OTP and password reset emails).
                These providers are contractually bound to protect your data.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your
                information if required by law, court order, or governmental
                authority.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or asset sale, your data may be transferred to the
                acquiring entity, subject to equivalent privacy protections.
              </li>
              <li>
                <strong>Protection of Rights:</strong> We may disclose data
                when necessary to protect the rights, property, or safety of{" "}
                {COMPANY_NAME}, our users, or the public.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="cookies" title="7. Cookies & Local Storage">
            <p>
              {COMPANY_NAME} uses session-based authentication (JWTs or secure
              HTTP-only cookies) to keep you logged in. We may also use:
            </p>
            <ul>
              <li>
                <strong>Session storage:</strong> for temporary verification
                OTPs and registration flow state
              </li>
              <li>
                <strong>Local storage:</strong> for user interface preferences
                (e.g., theme settings)
              </li>
              <li>
                <strong>Analytics cookies:</strong> to understand aggregate
                usage patterns and improve the Platform (these do not
                personally identify you)
              </li>
            </ul>
            <p>
              We do not use tracking cookies for cross-site advertising. You
              can clear cookies and local storage through your browser settings
              at any time.
            </p>
          </LegalSection>

          <LegalSection id="data-retention" title="8. Data Retention">
            <ul>
              <li>
                <strong>Account data:</strong> retained for as long as your
                account is active. Upon account deletion, personal data is
                removed within 30 days, except where retention is required by
                law.
              </li>
              <li>
                <strong>Google refresh tokens:</strong> deleted immediately upon
                disconnecting Google Drive or deleting your account.
              </li>
              <li>
                <strong>Payment records:</strong> retained for 7 years as
                required by applicable tax law.
              </li>
              <li>
                <strong>Authentication logs:</strong> failed login counts and
                lock timestamps are reset upon successful login and deleted upon
                account removal.
              </li>
              <li>
                <strong>User-created content:</strong> retained until you
                delete it or your account is terminated.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="your-rights" title="9. Your Rights">
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul>
              <li>
                <strong>Access:</strong> request a copy of the personal data we
                hold about you
              </li>
              <li>
                <strong>Rectification:</strong> correct inaccurate or
                incomplete data via your profile settings, or by contacting us
              </li>
              <li>
                <strong>Erasure:</strong> request deletion of your account and
                associated personal data
              </li>
              <li>
                <strong>Portability:</strong> request your data in a portable
                format
              </li>
              <li>
                <strong>Objection / Restriction:</strong> object to certain
                processing activities
              </li>
              <li>
                <strong>Withdraw consent:</strong> disconnect Google Drive or
                unlink Google Sign-In at any time from account settings
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
            <p>
              EU/EEA residents may also lodge a complaint with their local Data
              Protection Authority.
            </p>
          </LegalSection>

          <LegalSection id="children" title="10. Children's Privacy">
            <p>
              {COMPANY_NAME} is not directed at children under the age of 13.
              We do not knowingly collect personal data from children under 13.
              If we become aware that a child under 13 has provided us with
              personal data, we will delete it promptly. If you believe a child
              has registered, please contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection id="security" title="11. Security">
            <p>
              We implement industry-standard security measures to protect your
              data, including:
            </p>
            <ul>
              <li>
                <strong>Password hashing:</strong> passwords are hashed with
                bcrypt (cost factor 10) — we never store plain-text passwords
              </li>
              <li>
                <strong>Token encryption:</strong> Google Drive refresh tokens
                are encrypted with AES encryption before storage
              </li>
              <li>
                <strong>Brute-force protection:</strong> accounts are
                temporarily locked after 5 failed login attempts
              </li>
              <li>
                <strong>HTTPS:</strong> all data is transmitted over TLS/HTTPS
              </li>
              <li>
                <strong>Webhook verification:</strong> Razorpay webhooks are
                verified using HMAC-SHA256 signatures
              </li>
              <li>
                <strong>OTP expiry:</strong> email verification OTPs expire
                after 15 minutes
              </li>
            </ul>
            <p>
              No method of transmission over the internet or method of
              electronic storage is 100% secure. While we strive to protect
              your data, we cannot guarantee absolute security.
            </p>
          </LegalSection>

          <LegalSection id="changes" title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify
              you of material changes by posting the new policy on this page
              with an updated &ldquo;Last Updated&rdquo; date and, where
              required, by email. Your continued use of the Platform after
              changes are posted constitutes acceptance of the updated policy.
            </p>
          </LegalSection>

          <LegalSection id="contact" title="13. Contact Us">
            <p>
              For privacy-related questions, data requests, or to report a
              concern, please contact:
            </p>
            <div
              className="border-2 p-5 mt-4"
              style={{
                borderColor: "var(--color-ink-charcoal)",
                backgroundColor: "var(--color-surface-container-low)",
                boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
              }}
            >
              <p className="font-semibold text-body-md">{COMPANY_NAME} — Privacy Team</p>
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
                We aim to respond within 5 business days for general inquiries,
                and within 30 days for data subject requests.
              </p>
            </div>
          </LegalSection>

          {/* Footer links */}
          <div
            className="mt-12 pt-8 border-t-2 flex flex-wrap gap-4"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <Link
              href="/legal/terms"
              className="text-label-md underline"
              style={{ color: "var(--color-primary)" }}
            >
              Terms of Service →
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

/* ── Data Use Table ─────────────────────────────────────────────────────── */
function DataUseTable() {
  const rows = [
    {
      purpose: "Create and manage your account",
      data: "Name, email, username, password hash",
      basis: "Contract performance",
    },
    {
      purpose: "Authenticate via Google Sign-In",
      data: "Google Account ID, email, name, profile picture",
      basis: "Contract performance / Consent",
    },
    {
      purpose: "Google Drive integration",
      data: "Encrypted Drive refresh token",
      basis: "Explicit consent",
    },
    {
      purpose: "Process subscription payments",
      data: "Razorpay subscription ID, plan ID, billing dates",
      basis: "Contract performance",
    },
    {
      purpose: "Send OTP / password reset emails",
      data: "Email address, OTP (expires in 15 min)",
      basis: "Contract performance",
    },
    {
      purpose: "Security and fraud prevention",
      data: "IP address, failed login counts, lock timestamps",
      basis: "Legitimate interest",
    },
    {
      purpose: "Improve the Platform",
      data: "Anonymised usage analytics",
      basis: "Legitimate interest",
    },
    {
      purpose: "Comply with legal obligations",
      data: "Payment records, audit logs",
      basis: "Legal obligation",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-2 text-sm"
        style={{ borderColor: "var(--color-ink-charcoal)" }}
        aria-label="Data use purposes table"
      >
        <thead>
          <tr
            style={{
              backgroundColor: "var(--color-ink-charcoal)",
              color: "var(--color-electric-sun)",
            }}
          >
            <th
              className="text-left p-3 text-label-sm border-r-2"
              style={{ borderColor: "var(--color-outline)" }}
            >
              Purpose
            </th>
            <th
              className="text-left p-3 text-label-sm border-r-2"
              style={{ borderColor: "var(--color-outline)" }}
            >
              Data Used
            </th>
            <th className="text-left p-3 text-label-sm">Legal Basis</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                backgroundColor:
                  i % 2 === 0
                    ? "var(--color-surface-container-lowest)"
                    : "var(--color-surface-container-low)",
                borderTop: "1px solid var(--color-outline-variant)",
              }}
            >
              <td
                className="p-3 border-r"
                style={{ borderColor: "var(--color-outline-variant)" }}
              >
                {row.purpose}
              </td>
              <td
                className="p-3 border-r"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {row.data}
              </td>
              <td className="p-3">
                <span
                  className="text-label-sm px-2 py-0.5 border"
                  style={{
                    borderColor: "var(--color-leaf-green)",
                    color: "var(--color-primary)",
                    backgroundColor: "var(--color-primary-container)",
                  }}
                >
                  {row.basis}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
