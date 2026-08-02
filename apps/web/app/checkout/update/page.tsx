"use client";

import { useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";
import { CheckoutCouponInput } from "@/components/checkout/CheckoutCouponInput";
import {
  useUpdateCheckoutStore,
  UpgradeStatus,
} from "@/store/updateCheckoutStore";
import { useUpdateCheckoutLogic } from "@/hook/subscription/useUpdateCheckoutLogic";
import { UpgradeStatusOverlay } from "@/components/checkout/UpgradeStatusOverlay";
import { PlanSummaryCard } from "@/components/checkout/PlanSummaryCard";
import Footer from "@/components/Footer";

function UpdateCheckoutContent() {
  const { upgradeStatus, showOverlay } = useUpdateCheckoutStore();
  const {
    router,
    targetPlan,
    subData,
    subLoading,
    plansLoading,
    isUpdating,
    updateError,
    couponResult,
    couponError,
    isCouponLoading,
    handleApplyCoupon,
    handleClearCoupon,
    handleSuccessRedirect,
    handleRetry,
    handleUpgrade,
    currentPlanId,
  } = useUpdateCheckoutLogic();

  if (subLoading || plansLoading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (!targetPlan) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] flex flex-col">
        <Navbar />
        <DashboardError
          title="INVALID TARGET PLAN!"
          message="The plan you are attempting to upgrade to could not be found. Please select a valid plan."
          onRetry={() => router.push("/profile")}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)]">
      <Navbar />

      <AnimatePresence>
        {showOverlay &&
          (upgradeStatus === "loading" || upgradeStatus === "success") && (
            <UpgradeStatusOverlay
              status={upgradeStatus}
              onSuccessRedirect={handleSuccessRedirect}
              onRetry={handleRetry}
            />
          )}
      </AnimatePresence>

      {/* Hero strip */}
      <div className="relative w-full pt-28 pb-8 overflow-hidden border-b-2 border-[var(--color-ink-charcoal)]">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">
          <button
            id="upgrade-back"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-label-md font-bold text-[var(--color-ink-charcoal)] opacity-60 hover:opacity-100 transition-opacity mb-6"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Profile
          </button>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring" as const,
              stiffness: 100,
              damping: 14,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-bold text-sm uppercase tracking-widest px-4 py-1.5 border-2 border-[var(--color-ink-charcoal)] shadow-hard mb-4">
              <Zap size={14} strokeWidth={2.5} />
              Upgrade to {targetPlan ? targetPlan.name : "Premium"}
            </div>
            <h1 className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)]">
              Unlock Everything
            </h1>
            <p className="text-body-lg text-[var(--color-ink-charcoal)] opacity-70 mt-1">
              {subData?.subscription
                ? "You have an active subscription. We'll switch your plan instantly."
                : `Complete your upgrade to the ${targetPlan ? targetPlan.name : "Premium"} plan and unlock all features.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
          {/* Left — coupon + action */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring" as const, stiffness: 90, damping: 14 }}
            className="space-y-6"
          >
            {/* Current plan info */}
            {subData?.plan && (
              <div
                className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-surface)] p-6"
                style={{
                  boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)",
                }}
              >
                <p className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-ink-charcoal)]/50 mb-1">
                  Current Plan
                </p>
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={20}
                    strokeWidth={2}
                    className="text-[var(--color-ink-charcoal)]"
                  />
                  <span className="font-display font-black text-[var(--color-ink-charcoal)] text-headline-sm">
                    {subData.plan.name} Plan
                  </span>
                  {targetPlan && (
                    <span className="text-label-sm font-bold border-2 border-[var(--color-ink-charcoal)] px-2 py-0.5 bg-[var(--color-canvas-cream)]">
                      →&nbsp; {targetPlan.name} Plan
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Coupon */}
            {currentPlanId && (
              <div
                className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] p-6"
                style={{
                  boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)",
                }}
              >
                <CheckoutCouponInput
                  planId={currentPlanId}
                  onApply={handleApplyCoupon}
                  onClear={handleClearCoupon}
                  result={couponResult}
                  error={couponError}
                  isLoading={isCouponLoading}
                />
              </div>
            )}

            {/* Error banner */}
            {updateError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 border-2 border-[var(--color-vivid-coral)] bg-[var(--color-error-container)] p-4"
              >
                <AlertCircle
                  size={18}
                  strokeWidth={2.5}
                  className="text-[var(--color-error)] flex-shrink-0 mt-0.5"
                />
                <p className="text-body-md text-[var(--color-error)] font-bold">
                  {updateError}
                </p>
              </motion.div>
            )}

            {/* Upgrade button */}
            <button
              id="upgrade-confirm-btn"
              onClick={handleUpgrade}
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-3 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-black text-lg uppercase tracking-wide py-5 px-8 border-2 border-[var(--color-ink-charcoal)] shadow-hard-lg btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <Zap size={22} strokeWidth={2} />
                  Upgrade to {targetPlan ? targetPlan.name : "Premium"}
                </>
              )}
            </button>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 text-label-sm text-[var(--color-ink-charcoal)] opacity-50 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={2.5} />
                256-bit SSL
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={2.5} />
                Powered by Razorpay
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={2.5} />
                Cancel anytime
              </span>
            </div>
          </motion.div>

          {/* Right — plan summary */}
          {targetPlan && (
            <PlanSummaryCard
              plan={{
                name: targetPlan.name,
                priceInPaise: targetPlan.priceInPaise,
                interval: targetPlan.interval,
              }}
              coupon={couponResult}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function UpdateCheckoutPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <UpdateCheckoutContent />
    </Suspense>
  );
}
