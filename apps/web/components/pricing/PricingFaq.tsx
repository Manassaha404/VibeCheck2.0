"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel anytime from Dashboard → Settings → Billing, no phone call needed. By default your subscription cancels at the end of your current billing period, so you keep full access until then. No further charges are made after that date. See our Cancellation Policy for the full details.",
    link: { label: "Cancellation Policy →", href: "/legal/cancellation" },
  },
  {
    q: "Do you offer refunds?",
    a: "We don't offer prorated refunds for unused time within a billing period. The exception is if you were charged in error (e.g. a duplicate charge) or the charge was unauthorised — contact support@vibecheck.app within 7 days of the charge and we'll sort it out. Our full no-refund policy is documented in our Terms of Service.",
    link: { label: "Terms of Service →", href: "/legal/terms" },
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Free plan gives you full access to core features with no time limit. Upgrade only when you need higher limits — there's no credit card required to start.",
    link: null,
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay — a PCI-DSS Level 1 compliant payment gateway. We never store your raw card details.",
    link: null,
  },
  {
    q: "What happens if my payment fails?",
    a: "Razorpay will automatically retry the charge. During retries your subscription moves to a 'pending' state. If all retries are exhausted it becomes 'halted' and access to paid features may be restricted until payment is updated. You'll receive email notifications throughout.",
    link: { label: "Cancellation Policy →", href: "/legal/cancellation" },
  },
  {
    q: "Can I switch plans?",
    a: "Yes — upgrade or downgrade at any time from your billing settings. Upgrades take effect immediately (or at cycle end, depending on your card type). Downgrades are scheduled for the next billing cycle so you enjoy your current plan until it ends.",
    link: null,
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "You'll receive a prompt to upgrade. Nothing is deleted and nothing stops working mid-session — you just won't be able to create new items until you upgrade or the next billing cycle resets your usage.",
    link: null,
  },
  {
    q: "How does Google Sign-In work? What data do you access?",
    a: "When you sign in with Google we request only your name, email, and profile picture (openid email profile scopes). If you connect Google Drive, we request the drive.file scope — which lets us create folders and upload your response files only. We never access files we didn't create, and we never use your Google data for ads. You can disconnect Drive anytime from account settings.",
    link: { label: "Privacy Policy →", href: "/legal/privacy-policy" },
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
    },
  }),
};

export function PricingFaq() {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-24 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)]">
          Got Questions?
        </h2>
        <p className="text-body-lg text-[var(--color-ink-charcoal)] opacity-70 mt-2">
          Honest answers — and links to the full legal detail when you need it.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <motion.details
            key={faq.q}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            className="group border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] shadow-hard overflow-hidden"
          >
            <summary
              className="flex items-center justify-between p-5 cursor-pointer list-none font-display font-bold text-[var(--color-ink-charcoal)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              id={`faq-${i}`}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={20}
                strokeWidth={2.5}
                className="transition-transform group-open:rotate-180 flex-shrink-0"
              />
            </summary>
            <div className="px-5 pb-5 pt-3 border-t-2 border-[var(--color-ink-charcoal)] bg-[var(--color-surface-container-low)]">
              <p className="text-body-md text-[var(--color-ink-charcoal)] opacity-80">
                {faq.a}
              </p>
              {faq.link && (
                <a
                  href={faq.link.href}
                  className="inline-block mt-3 text-label-md font-semibold underline underline-offset-2 text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                >
                  {faq.link.label}
                </a>
              )}
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
