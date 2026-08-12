import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation Policy | VibeCheck",
  description:
    "Learn how to cancel your VibeCheck subscription. Cancellations take effect at the end of your current billing period — no refunds, but you keep full access until then.",
};

const LAST_UPDATED = "August 12, 2026";
const EFFECTIVE_DATE = "August 12, 2026";
const CONTACT_EMAIL = "manassaha425@gmail.com";
const COMPANY_NAME = "VibeCheck";

export default function CancellationPolicyPage() {
  return (
    <main
      id="cancellation-policy"
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-canvas-cream)" }}
    >
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
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="text-label-sm hover:underline"
                  style={{ color: "var(--color-tangerine)" }}
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
                  style={{ color: "var(--color-tangerine)" }}
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
                Cancellation Policy
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="text-label-sm px-3 py-1 border-2"
                style={{
                  backgroundColor: "var(--color-tangerine)",
                  color: "var(--color-ink-charcoal)",
                  borderColor: "var(--color-tangerine)",
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
              Cancellation{" "}
              <span style={{ color: "var(--color-tangerine)" }}>Policy</span>
            </h1>
            <p
              className="text-body-lg"
              style={{
                color: "var(--color-canvas-cream)",
                opacity: 0.8,
                maxWidth: "680px",
              }}
            >
              You can cancel your subscription at any time — no questions
              asked. We believe you should always be in control of your billing.
            </p>
            <p className="text-label-sm" style={{ color: "var(--color-tangerine)" }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>
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
            className="text-label-sm px-3 py-1 border-2 transition-all"
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
            className="text-label-sm px-3 py-1 border-2"
            style={{
              backgroundColor: "var(--color-ink-charcoal)",
              color: "var(--color-pure-white)",
              borderColor: "var(--color-ink-charcoal)",
            }}
            aria-current="page"
          >
            Cancellation Policy
          </Link>
        </div>
      </section>
      <section
        className="border-b-2"
        style={{
          borderColor: "var(--color-ink-charcoal)",
          backgroundColor: "var(--color-surface-container-lowest)",
        }}
      >
        <div
          className="mx-auto px-6 py-10"
          style={{ maxWidth: "var(--spacing-container-max)" }}
        >
          <p
            className="text-label-sm mb-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            THE SHORT VERSION
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "✅",
                title: "Cancel Anytime",
                body: "Cancel your subscription at any time directly from your account dashboard. No penalty, no phone calls required.",
                accent: "var(--color-leaf-green)",
              },
              {
                icon: "📅",
                title: "Access Until Period Ends",
                body: "After cancellation, you keep full access to your plan's features until the end of your current billing period.",
                accent: "var(--color-sky-blue)",
              },
              {
                icon: "💳",
                title: "No Refunds on Paid Periods",
                body: "We do not offer prorated refunds for unused time within a billing period. See our full policy below for details.",
                accent: "var(--color-tangerine)",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border-2 p-5"
                style={{
                  borderColor: "var(--color-ink-charcoal)",
                  boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
                  backgroundColor: "var(--color-canvas-cream)",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center text-xl border-2 mb-4"
                  style={{
                    borderColor: "var(--color-ink-charcoal)",
                    backgroundColor: card.accent,
                  }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <h2
                  className="text-headline-sm mb-2"
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    color: "var(--color-ink-charcoal)",
                  }}
                >
                  {card.title}
                </h2>
                <p
                  className="text-body-md"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
                  { href: "#scope", label: "Scope" },
                  { href: "#how-to-cancel", label: "How to Cancel" },
                  { href: "#what-happens", label: "What Happens After" },
                  { href: "#cycle-end", label: "Cancel at Cycle End" },
                  { href: "#immediate-cancel", label: "Immediate Cancellation" },
                  { href: "#plan-changes", label: "Changing Your Plan" },
                  { href: "#no-refund", label: "No Refund Policy" },
                  { href: "#razorpay", label: "Razorpay & Payments" },
                  { href: "#resubscribe", label: "Resubscribing" },
                  { href: "#failed-payment", label: "Failed Payments" },
                  { href: "#contact", label: "Contact Support" },
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
        <article className="flex-1 min-w-0">
          <LegalSection id="scope" title="1. Scope of This Policy">
            <p>
              This Cancellation Policy applies to all paid subscription plans
              on {COMPANY_NAME} processed via <strong>Razorpay</strong>. It
              does not apply to the free plan, which has no billing and can be
              used indefinitely without cancellation.
            </p>
            <p>
              This policy should be read alongside our{" "}
              <Link
                href="/legal/terms"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy-policy"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection id="how-to-cancel" title="2. How to Cancel Your Subscription">
            <p>
              You can cancel your subscription at any time directly through
              your {COMPANY_NAME} account:
            </p>
            <ol>
              <li>
                Log in to your {COMPANY_NAME} account at{" "}
                <a
                  href="https://vibecheck.manasx.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  vibecheck.app
                </a>
              </li>
              <li>
                Navigate to <strong>Dashboard → Settings → Billing</strong>
              </li>
              <li>
                Click <strong>&ldquo;Cancel Subscription&rdquo;</strong> and
                confirm your choice
              </li>
            </ol>
            <p>
              No phone call, email, or cancellation form is required. You
              should receive a confirmation email from Razorpay once the
              cancellation is processed.
            </p>
            <p>
              If you experience any issues cancelling, please contact our
              support team at{" "}
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

          <LegalSection id="what-happens" title="3. What Happens After Cancellation">
            <p>
              When you cancel your subscription, the following occurs:
            </p>
            <ul>
              <li>
                Your subscription is <strong>marked for cancellation</strong>{" "}
                at the end of the current billing period
              </li>
              <li>
                You retain <strong>full access</strong> to all paid plan
                features until the scheduled cancellation date
              </li>
              <li>
                <strong>No further charges</strong> will be made to your
                payment method after the cancellation takes effect
              </li>
              <li>
                After the period ends, your account automatically downgrades to
                the <strong>free plan</strong> with its associated limits
              </li>
              <li>
                Your data, polls, forms, quizzes, and petitions are
                <strong> not deleted</strong> — they remain accessible on the
                free plan (subject to free plan limits)
              </li>
            </ul>
            <div
              className="mt-6 border-2 p-5"
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
                SUBSCRIPTION STATUS TIMELINE
              </p>
              <div className="flex flex-col gap-0">
                {[
                  {
                    status: "Active",
                    color: "var(--color-leaf-green)",
                    desc: "Subscription is live and charged normally",
                  },
                  {
                    status: "Cancellation Requested",
                    color: "var(--color-tangerine)",
                    desc: "You requested cancellation — still have full access",
                  },
                  {
                    status: "Active (Pending Cancellation)",
                    color: "var(--color-sky-blue)",
                    desc: "Enjoying remaining paid period — no new charges",
                  },
                  {
                    status: "Cancelled",
                    color: "var(--color-vivid-coral)",
                    desc: "Billing period ended — downgraded to free plan",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-4 h-4 border-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: step.color,
                          borderColor: "var(--color-ink-charcoal)",
                        }}
                      />
                      {i < 3 && (
                        <div
                          className="w-0.5 h-8"
                          style={{ backgroundColor: "var(--color-outline-variant)" }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <span
                        className="text-label-sm font-bold"
                        style={{ color: "var(--color-ink-charcoal)" }}
                      >
                        {step.status}
                      </span>
                      <p
                        className="text-label-sm"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </LegalSection>

          <LegalSection id="cycle-end" title="4. Cancel at End of Billing Cycle (Default)">
            <p>
              By default, when you cancel, {COMPANY_NAME} schedules the
              cancellation at the end of your current billing cycle
              (<strong>cancel_at_period_end = true</strong> in Razorpay terms).
              This means:
            </p>
            <ul>
              <li>
                Your subscription status remains <strong>Active</strong> in our
                system until the billing period ends
              </li>
              <li>
                The scheduled cancellation date is displayed on your billing
                dashboard
              </li>
              <li>
                Razorpay will send you a confirmation notification that the
                subscription will not renew
              </li>
            </ul>
            <p>
              This is the recommended and default cancellation method — it
              ensures you get the full value of what you&rsquo;ve already paid
              for.
            </p>
          </LegalSection>

          <LegalSection id="immediate-cancel" title="5. Immediate Cancellation">
            <p>
              In certain circumstances (for example, if a security concern
              requires immediate account action), {COMPANY_NAME} support can
              process an immediate cancellation. Immediate cancellations:
            </p>
            <ul>
              <li>
                Terminate your subscription access <strong>immediately</strong>
              </li>
              <li>Do not result in a refund for the unused portion of the period</li>
              <li>Can only be initiated by contacting support directly</li>
            </ul>
            <p>
              We do not offer self-serve immediate cancellation as a standard
              option. If you need immediate cancellation for any reason, please
              email us at{" "}
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

          <LegalSection id="plan-changes" title="6. Changing Your Plan (Upgrades & Downgrades)">
            <p>
              You may change your subscription plan at any time without
              cancelling. Plan changes are handled as follows:
            </p>
            <h3>Upgrading</h3>
            <p>
              When you upgrade to a higher-tier plan, the change takes effect
              immediately (or at cycle end, depending on your payment
              instrument). You gain access to higher-tier features right away.
              The new plan price applies from your next billing date.
            </p>
            <h3>Downgrading</h3>
            <p>
              When you downgrade to a lower-tier plan, the change is scheduled
              for your next billing cycle. You keep your current plan&rsquo;s
              features until the end of the current period.
            </p>
            <h3>Domestic Card Limitations</h3>
            <p>
              Due to Razorpay&rsquo;s mandate rules for domestic Indian cards,
              some plan changes may require completing a new checkout flow
              rather than an in-place update. In these cases, the old
              subscription is cancelled upon successful activation of the new
              subscription.
            </p>
          </LegalSection>

          <LegalSection id="no-refund" title="7. No Refund Policy">
            <div
              className="border-2 p-5 mb-6"
              style={{
                borderColor: "var(--color-tangerine)",
                backgroundColor: "var(--color-surface-container-lowest)",
                boxShadow: "4px 4px 0px 0px var(--color-tangerine)",
              }}
            >
              <p
                className="text-label-md mb-2"
                style={{ color: "var(--color-ink-charcoal)" }}
              >
                ⚠️ Important: No Prorated Refunds
              </p>
              <p
                className="text-body-md"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {COMPANY_NAME} does not offer prorated refunds for unused
                portions of a billing period. When you cancel, you will
                continue to have access to your paid plan until the end of the
                current billing period, but the subscription fee for that
                period will not be refunded.
              </p>
            </div>
            <p>
              We do not offer refunds except in the following limited
              circumstances:
            </p>
            <ul>
              <li>
                <strong>Duplicate charges:</strong> if you were charged twice
                for the same subscription period due to a technical error
              </li>
              <li>
                <strong>Unauthorised charges:</strong> if you can demonstrate
                that a charge was made without your authorisation
              </li>
              <li>
                <strong>Legal requirement:</strong> where applicable consumer
                protection law in your jurisdiction requires a refund (e.g.,
                EU 14-day cooling-off period for digital services, where
                applicable)
              </li>
            </ul>
            <p>
              To request a refund in these circumstances, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>{" "}
              within <strong>7 days</strong> of the charge with your
              Razorpay subscription ID and a description of the issue.
            </p>
          </LegalSection>

          <LegalSection id="razorpay" title="8. Razorpay & Payment Processing">
            <p>
              All subscription billing, renewal, and payment processing for{" "}
              {COMPANY_NAME} is handled by{" "}
              <strong>Razorpay</strong>, a PCI-DSS Level 1 compliant payment
              gateway. By subscribing to a paid plan, you also agree to{" "}
              <a
                href="https://razorpay.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                Razorpay&rsquo;s Terms of Service
              </a>
              .
            </p>
            <p>
              Razorpay manages the following on our behalf:
            </p>
            <ul>
              <li>Recurring subscription billing (monthly or yearly)</li>
              <li>
                Automated retry logic for failed payments (subscriptions enter a
                &ldquo;pending&rdquo; state, then &ldquo;halted&rdquo; if
                payment cannot be collected)
              </li>
              <li>
                Customer notification of upcoming charges and subscription
                status changes
              </li>
              <li>
                Subscription cancellation confirmation emails sent directly to
                your registered email
              </li>
            </ul>
            <p>
              {COMPANY_NAME} receives real-time subscription status updates via
              Razorpay webhooks (verified with HMAC-SHA256 signatures for
              security). Our subscription status reflects Razorpay&rsquo;s
              authoritative record.
            </p>
          </LegalSection>

          <LegalSection id="resubscribe" title="9. Resubscribing After Cancellation">
            <p>
              You are welcome to resubscribe at any time after your
              subscription has been cancelled. To resubscribe:
            </p>
            <ol>
              <li>Log in to your {COMPANY_NAME} account</li>
              <li>Navigate to the Pricing or Billing section</li>
              <li>Select a plan and complete the checkout via Razorpay</li>
            </ol>
            <p>
              Resubscribing starts a new subscription at the current plan price.
              Previously applied coupons may or may not be available for use
              again, subject to their individual terms.
            </p>
            <p>
              Your data, content, and history created during your previous
              subscription remain intact on the free plan while you are
              unsubscribed.
            </p>
          </LegalSection>

          <LegalSection id="failed-payment" title="10. Failed Payments & Account Status">
            <p>
              If a recurring payment fails, {COMPANY_NAME} (via Razorpay) will:
            </p>
            <ul>
              <li>
                Attempt to retry the payment according to Razorpay&rsquo;s
                retry schedule
              </li>
              <li>
                Send you a notification email about the payment failure
              </li>
              <li>
                Move your subscription to a <strong>&ldquo;pending&rdquo;</strong> state
                while retrying
              </li>
              <li>
                Move your subscription to a <strong>&ldquo;halted&rdquo;</strong> state
                if all retries are exhausted
              </li>
            </ul>
            <p>
              During a &ldquo;halted&rdquo; state, access to paid features may
              be restricted. To restore access, update your payment method
              through Razorpay&rsquo;s payment page or contact us at{" "}
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

          <LegalSection id="contact" title="11. Contact Support">
            <p>
              For cancellation assistance, billing questions, or any
              subscription-related issue, please reach us at:
            </p>
            <div
              className="border-2 p-5 mt-4"
              style={{
                borderColor: "var(--color-ink-charcoal)",
                backgroundColor: "var(--color-surface-container-low)",
                boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
              }}
            >
              <p className="font-semibold text-body-md">
                {COMPANY_NAME} Support
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-body-md underline"
                style={{ color: "var(--color-primary)" }}
              >
                {CONTACT_EMAIL}
              </a>
              <p
                className="text-label-sm mt-3"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Please include your registered email address and Razorpay
                Subscription ID (if available) in your message to help us
                assist you faster. We aim to respond within 2 business days.
              </p>
            </div>

            <div
              className="mt-6 border-2 p-5"
              style={{
                borderColor: "var(--color-leaf-green)",
                backgroundColor: "var(--color-primary-container)",
                boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)",
              }}
            >
              <p
                className="text-label-md mb-2"
                style={{ color: "var(--color-on-primary-container)" }}
              >
                💡 Tip: Before contacting us
              </p>
              <p
                className="text-body-md"
                style={{ color: "var(--color-on-primary-container)" }}
              >
                Most cancellations can be completed instantly from your
                account dashboard under{" "}
                <strong>Settings → Billing → Cancel Subscription</strong>.
                No support ticket needed.
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
              href="/legal/privacy-policy"
              className="text-label-md underline"
              style={{ color: "var(--color-primary)" }}
            >
              Privacy Policy →
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
