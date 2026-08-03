"use client";

import { motion } from "framer-motion";

const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`h-3 bg-[var(--color-surface-container)] rounded-sm animate-pulse ${className}`}
    />
  );
}

export function PlanCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.07 }}
      className="flex flex-col bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] overflow-hidden"
      style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
    >
      <div className="h-2 w-full bg-[var(--color-surface-container)] animate-pulse border-b-2 border-[var(--color-ink-charcoal)]" />

      <div className="p-6 border-b-2 border-[var(--color-ink-charcoal)] space-y-3">
        <div className="w-10 h-10 bg-[var(--color-surface-container)] animate-pulse border-2 border-[var(--color-ink-charcoal)]" />
        <SkeletonLine className="w-1/3" />
        <SkeletonLine className="w-1/2 h-8 mt-2" />
        <SkeletonLine className="w-1/4 h-2" />
      </div>

      <div className="flex-1 p-6 space-y-3">
        {SKELETON_WIDTHS.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[var(--color-surface-container)] animate-pulse border-2 border-[var(--color-ink-charcoal)]" />
            <SkeletonLine className={w} />
          </div>
        ))}
      </div>

      <div className="p-6 pt-0">
        <div className="h-11 bg-[var(--color-surface-container)] animate-pulse border-2 border-[var(--color-ink-charcoal)]" />
      </div>
    </motion.div>
  );
}
