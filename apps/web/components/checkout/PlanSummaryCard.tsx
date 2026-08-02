import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";

export function PlanSummaryCard({
  plan,
  coupon,
}: {
  plan: { name: string; priceInPaise: number; interval: string };
  coupon: {
    discountedPriceInPaise: number;
    discountType: string;
    discountValue: number;
  } | null;
}) {
  const original = plan.priceInPaise / 100;
  const discounted = coupon ? coupon.discountedPriceInPaise / 100 : null;
  const intervalLabel = plan.interval === "yearly" ? "yr" : "mo";

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring" as const, stiffness: 90, damping: 14 }}
      className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] p-8"
      style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <ArrowUpCircle
          size={20}
          strokeWidth={2.5}
          className="text-[var(--color-electric-sun)]"
        />
        <h2 className="text-label-lg font-display font-black uppercase tracking-wide text-[var(--color-ink-charcoal)]">
          Upgrade Summary
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b-2 border-[var(--color-ink-charcoal)]/10">
          <span className="text-body-md font-semibold text-[var(--color-ink-charcoal)]/70">
            Plan
          </span>
          <span className="font-display font-black text-[var(--color-ink-charcoal)]">
            {plan.name}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b-2 border-[var(--color-ink-charcoal)]/10">
          <span className="text-body-md font-semibold text-[var(--color-ink-charcoal)]/70">
            Billing
          </span>
          <span className="font-bold text-[var(--color-ink-charcoal)] capitalize">
            {plan.interval}
          </span>
        </div>
        {coupon && (
          <>
            <div className="flex justify-between items-center py-3 border-b-2 border-[var(--color-ink-charcoal)]/10">
              <span className="text-body-md font-semibold text-[var(--color-ink-charcoal)]/70">
                Original Price
              </span>
              <span className="font-bold text-[var(--color-ink-charcoal)]/50 line-through">
                ₹{original.toLocaleString("en-IN")}/{intervalLabel}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b-2 border-[var(--color-ink-charcoal)]/10">
              <span className="text-body-md font-semibold text-[var(--color-ink-charcoal)]/70">
                Discount
              </span>
              <span className="font-bold text-[var(--color-leaf-green)]">
                -
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue / 100}`}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center pt-2">
          <span className="text-body-lg font-black text-[var(--color-ink-charcoal)]">
            Total
          </span>
          <div className="text-right">
            <span className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)]">
              ₹{(discounted ?? original).toLocaleString("en-IN")}
            </span>
            <span className="text-body-sm text-[var(--color-ink-charcoal)]/50 font-semibold ml-1">
              /{intervalLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[var(--color-electric-sun)]/20 border-2 border-[var(--color-electric-sun)]">
        <p className="text-body-sm font-bold text-[var(--color-ink-charcoal)]">
          ⚡ Upgrading from an existing plan means the change takes effect
          immediately. Razorpay will handle prorating automatically.
        </p>
      </div>
    </motion.div>
  );
}
