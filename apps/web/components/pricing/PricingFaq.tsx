"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time from your account settings. Your plan remains active until the end of the billing period.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Free plan gives you full access to core features forever. Upgrade only when you need more power.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking and wallets via Razorpay.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "You'll receive a friendly prompt to upgrade. No data is deleted and nothing stops working — you just won't be able to create new items until you upgrade.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all paid plans if you're not satisfied.",
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
          We&apos;ve got honest answers.
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
            <div className="px-5 pb-5 pt-1 text-body-md text-[var(--color-ink-charcoal)] opacity-80 border-t-2 border-[var(--color-ink-charcoal)] bg-[var(--color-surface-container-low)]">
              {faq.a}
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
