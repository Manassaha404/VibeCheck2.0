"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tag, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import type { CouponResult } from "@/hook/subscription/useApplyCoupon";

interface CheckoutCouponInputProps {
  planId: string;
  onApply: (code: string, planId: string) => Promise<unknown>;
  onClear: () => void;
  result: CouponResult | null;
  error: string | null;
  isLoading: boolean;
}

export function CheckoutCouponInput({
  planId,
  onApply,
  onClear,
  result,
  error,
  isLoading,
}: CheckoutCouponInputProps) {
  const [code, setCode] = useState("");

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    await onApply(trimmed, planId);
  };

  const handleClear = () => {
    setCode("");
    onClear();
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-label-md font-bold text-[var(--color-ink-charcoal)] uppercase tracking-wide">
        <Tag size={14} strokeWidth={2.5} />
        Coupon Code
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="checkout-coupon-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="ENTER CODE"
            disabled={!!result || isLoading}
            className="w-full font-display font-bold text-sm uppercase tracking-widest px-4 py-3 border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] placeholder:text-[var(--color-ink-charcoal)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf-green)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {result && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-charcoal)] opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          id="checkout-coupon-apply"
          onClick={handleApply}
          disabled={!code.trim() || !!result || isLoading}
          className="px-5 py-3 bg-[var(--color-ink-charcoal)] text-[var(--color-electric-sun)] font-display font-bold text-sm uppercase tracking-wide border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm btn-press disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            key="coupon-success"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-label-md text-[var(--color-ink-charcoal)] bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-3 py-2"
          >
            <CheckCircle2 size={14} strokeWidth={2.5} />
            <span>
              {result.discountType === "percentage"
                ? `${result.discountValue}% off applied!`
                : `₹${(result.discountValue / 100).toLocaleString("en-IN")} off applied!`}
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="coupon-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-label-md text-[var(--color-pure-white)] bg-[var(--color-vivid-coral)] border-2 border-[var(--color-ink-charcoal)] px-3 py-2"
          >
            <XCircle size={14} strokeWidth={2.5} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
