import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Zap } from "lucide-react";
import { UpgradeStatus } from "@/store/updateCheckoutStore";

interface UpgradeStatusOverlayProps {
  status: UpgradeStatus;
  onSuccessRedirect: () => void;
  onRetry: () => void;
}

export function UpgradeStatusOverlay({
  status,
  onSuccessRedirect,
  onRetry,
}: UpgradeStatusOverlayProps) {
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(onSuccessRedirect, 2500);
    return () => clearTimeout(t);
  }, [isSuccess, onSuccessRedirect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink-charcoal)]/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-sm mx-4 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] p-8 text-center"
        style={{ boxShadow: "8px 8px 0px 0px var(--color-ink-charcoal)" }}
      >
        {isLoading && (
          <>
            <div className="flex justify-center mb-5">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)]">
                <Loader2
                  size={28}
                  className="animate-spin text-[var(--color-ink-charcoal)]"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <h2 className="text-xl font-display font-black text-[var(--color-ink-charcoal)] uppercase tracking-wide mb-2">
              Upgrading Plan
            </h2>
            <p className="text-body-md text-[var(--color-ink-charcoal)] opacity-60 mb-5">
              Switching you to Max… this takes a moment.
            </p>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--color-leaf-green)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {isSuccess && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex justify-center mb-5"
            >
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)]">
                <CheckCircle2
                  size={32}
                  className="text-white"
                  strokeWidth={2.5}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[var(--color-leaf-green)]"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                />
              </div>
            </motion.div>
            <div className="inline-flex items-center gap-1.5 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-bold text-xs uppercase tracking-widest px-3 py-1 border-2 border-[var(--color-ink-charcoal)] mb-3">
              <Zap size={11} strokeWidth={2.5} />
              Max Plan Activated
            </div>
            <h2 className="text-xl font-display font-black text-[var(--color-ink-charcoal)] uppercase tracking-wide mb-2">
              You&apos;re on Max! 🚀
            </h2>
            <p className="text-body-md text-[var(--color-ink-charcoal)] opacity-60">
              Your subscription is upgraded. Taking you to your profile…
            </p>
            <div className="mt-5 h-1 bg-[var(--color-ink-charcoal)]/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-leaf-green)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
