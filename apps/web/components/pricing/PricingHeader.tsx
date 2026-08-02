"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function PricingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 14 }}
      className="text-center mb-16"
    >
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-bold text-sm uppercase tracking-widest px-4 py-1.5 border-2 border-[var(--color-ink-charcoal)] shadow-hard mb-6">
        <Zap size={14} strokeWidth={2.5} />
        Simple Pricing
      </div>

      <h1 className="text-display-lg font-display font-black text-[var(--color-ink-charcoal)] mb-4 drop-shadow-[4px_4px_0_rgba(142,212,98,1)]">
        Pick Your Vibe.
      </h1>
      <p className="text-body-lg text-[var(--color-ink-charcoal)] max-w-xl mx-auto opacity-80">
        Start free. Unlock superpowers as you grow. No hidden fees, no
        surprises.
      </p>
    </motion.div>
  );
}
