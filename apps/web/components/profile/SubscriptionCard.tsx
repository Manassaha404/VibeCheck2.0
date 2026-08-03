"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  X,
  Zap,
} from "lucide-react";
import { useCancelSubscription } from "@/hook/subscription/useCancelSubscription";
import { useGetPlans } from "@/hook/subscription/useGetPlans";

interface Plan {
  planId: string;
  name: string;
  interval: "monthly" | "yearly";
  priceInPaise: number;
}

interface SubscriptionCardProps {
  plan: Plan;
  razorpaySubscriptionId?: string | null;
  status?: string | null;
  cancelAtCycleEnd?: boolean | null;
  scheduledCancellationDate?: Date | string | null;
  currentEnd?: Date | string | null;
  pendingPlanId?: string | null;
  onCancelled?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-[var(--color-leaf-green)]",
    icon: <CheckCircle2 className="w-4 h-4" strokeWidth={3} />,
  },
  authenticated: {
    label: "Authenticated",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-[var(--color-sky-blue)]",
    icon: <CheckCircle2 className="w-4 h-4" strokeWidth={3} />,
  },
  pending: {
    label: "Payment Pending",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-yellow-300",
    icon: <Clock className="w-4 h-4" strokeWidth={3} />,
  },
  halted: {
    label: "Halted",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-orange-300",
    icon: <AlertTriangle className="w-4 h-4" strokeWidth={3} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-[var(--color-vivid-coral)]",
    icon: <XCircle className="w-4 h-4" strokeWidth={3} />,
  },
  completed: {
    label: "Completed",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-gray-300",
    icon: <CheckCircle2 className="w-4 h-4" strokeWidth={3} />,
  },
  failed: {
    label: "Failed",
    color: "text-white",
    bg: "bg-red-500",
    icon: <XCircle className="w-4 h-4" strokeWidth={3} />,
  },
};

const formatDate = (d: Date | string | null | undefined) => {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
};

const formatPrice = (paise: number, interval: string) => {
  const inr = paise / 100;
  return `₹${inr.toLocaleString("en-IN")} / ${interval === "yearly" ? "yr" : "mo"}`;
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  razorpaySubscriptionId,
  status,
  cancelAtCycleEnd,
  scheduledCancellationDate,
  currentEnd,
  pendingPlanId,
  onCancelled,
}) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { cancelSubscription, isPending, error } = useCancelSubscription();
  const { plans } = useGetPlans(plan.interval);

  const isFree = plan.name.toLowerCase() === "free";
  const isPro = plan.name.toLowerCase() === "pro";
  const isMaxPlan = plan.name.toLowerCase().includes("max");

  let targetPlan: Plan | null = null;
  if (isFree) {
    targetPlan = plans.find((p) => p.name.toLowerCase() === "pro") ?? null;
  } else if (isPro) {
    targetPlan =
      plans.find((p) => p.name.toLowerCase().includes("max")) ?? null;
  }

  const canUpgrade = !isMaxPlan && targetPlan !== null && !pendingPlanId;
  const pendingPlan = pendingPlanId
    ? plans.find((p) => p.planId === pendingPlanId)
    : null;

  const isCancellable =
    !isFree &&
    razorpaySubscriptionId &&
    status &&
    !cancelAtCycleEnd &&
    !["cancelled", "completed", "failed", "expired"].includes(status);

  const defaultStatusInfo = {
    label: "Active",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-[var(--color-leaf-green)]",
    icon: <CheckCircle2 className="w-4 h-4" strokeWidth={3} />,
  };

  const statusInfo = cancelAtCycleEnd
    ? {
        label: "Cancelling at Cycle End",
        color: "text-[var(--color-ink-charcoal)]",
        bg: "bg-amber-300",
        icon: <Clock className="w-4 h-4" strokeWidth={3} />,
      }
    : status && STATUS_CONFIG[status]
      ? STATUS_CONFIG[status]
      : (STATUS_CONFIG["active"] ?? defaultStatusInfo);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 },
    );
  }, []);

  const handleConfirmCancel = async () => {
    if (!razorpaySubscriptionId) return;
    const res = await cancelSubscription(razorpaySubscriptionId);
    if (res?.success) {
      setShowConfirm(false);
      onCancelled?.();
    }
  };

  const handleUpgrade = () => {
    if (targetPlan) {
      if (isFree) {
        router.push(`/checkout?planId=${targetPlan.planId}`);
      } else {
        router.push(`/checkout/update?planId=${targetPlan.planId}`);
      }
    }
  };

  const effectiveEndDate = scheduledCancellationDate || currentEnd;

  return (
    <>
      <div
        ref={cardRef}
        className="bg-[var(--color-surface)] border-4 border-[var(--color-ink-charcoal)] shadow-neubrutalist p-6 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm bg-[var(--color-canvas-cream)]">
              <CreditCard className="w-8 h-8 text-[var(--color-ink-charcoal)]" />
            </div>
            <div>
              <h3 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] flex items-center gap-3 flex-wrap">
                {plan.name} Plan
                {!isFree && status && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-label-sm font-bold border-2 border-[var(--color-ink-charcoal)] ${statusInfo.bg} ${statusInfo.color}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                )}
                {pendingPlan && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-label-sm font-bold border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)]">
                    <Zap className="w-4 h-4" strokeWidth={3} />
                    Upgrading to {pendingPlan.name} at cycle end
                  </span>
                )}
              </h3>

              <div className="mt-1 flex flex-col gap-0.5">
                {!isFree && effectiveEndDate && (
                  <p className="text-body-sm text-[var(--color-ink-charcoal)]/60 font-semibold">
                    {status === "cancelled"
                      ? `Access until ${formatDate(effectiveEndDate)}`
                      : cancelAtCycleEnd
                        ? `Subscription cancels on ${formatDate(effectiveEndDate)}`
                        : `Renews ${formatDate(effectiveEndDate)}`}
                  </p>
                )}
                {isFree && (
                  <p className="text-body-md font-bold text-[var(--color-ink-charcoal)]/80">
                    Free forever — upgrade anytime.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {canUpgrade && (
              <button
                onClick={handleUpgrade}
                disabled={isPending}
                className="px-6 py-3 font-display font-black text-label-md border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] hover:bg-yellow-400 disabled:opacity-60 disabled:pointer-events-none"
              >
                <Zap className="w-4 h-4" strokeWidth={3} />
                UPGRADE TO {targetPlan?.name.toUpperCase()}
              </button>
            )}

            {isCancellable && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="px-6 py-3 font-display font-black text-label-md border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press flex items-center gap-2 bg-[var(--color-vivid-coral)] text-[var(--color-ink-charcoal)] hover:bg-[#ff4f4f] disabled:opacity-60 disabled:pointer-events-none"
              >
                {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                {!isPending && "CANCEL PLAN"}
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-body-sm font-bold text-red-600 border-2 border-red-500 bg-red-50 px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-[var(--color-surface)] border-4 border-[var(--color-ink-charcoal)] shadow-neubrutalist p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-[var(--color-ink-charcoal)] hover:opacity-70"
              aria-label="Close"
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle
                className="w-8 h-8 text-[var(--color-vivid-coral)] shrink-0"
                strokeWidth={3}
              />
              <h2 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)]">
                Cancel Subscription?
              </h2>
            </div>

            <p className="text-body-md text-[var(--color-ink-charcoal)]/80 font-semibold mb-2">
              Your plan will be cancelled at the end of the current billing
              period.
            </p>
            {currentEnd && (
              <p className="text-body-md font-bold text-[var(--color-ink-charcoal)] mb-6">
                You'll keep access until{" "}
                <span className="underline underline-offset-4">
                  {formatDate(currentEnd)}
                </span>
                .
              </p>
            )}

            {error && (
              <p className="mb-4 text-body-sm font-bold text-red-600 border-2 border-red-500 bg-red-50 px-4 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 px-6 py-3 font-display font-black text-label-md border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] hover:bg-gray-100 disabled:opacity-60"
              >
                KEEP PLAN
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isPending}
                className="flex-1 px-6 py-3 font-display font-black text-label-md border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press bg-[var(--color-vivid-coral)] text-[var(--color-ink-charcoal)] hover:bg-[#ff4f4f] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                {isPending ? "CANCELLING…" : "YES, CANCEL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
