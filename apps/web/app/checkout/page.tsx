"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutCouponInput } from "@/components/checkout/CheckoutCouponInput";
import { useCreateCheckout } from "@/hook/subscription/useCreateCheckout";
import type { PaymentPollingStatus } from "@/hook/subscription/usePaymentStatusPoller";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { PaymentStatusOverlay } from "@/components/checkout/PaymentStatusOverlay";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const {
    router,
    plan,
    plansLoading,
    isCreating,
    checkoutError,
    couponResult,
    couponError,
    isCouponLoading,
    handleApplyCoupon,
    handleClearCoupon,
    handlePay,
    overlayStatus,
    handleSuccessRedirect,
    handleRetry,
    showOverlay,
  } = useCreateCheckout();

  if (plansLoading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] flex flex-col">
        <Navbar />
        <DashboardError
          title="PLAN NOT FOUND!"
          message="The requested plan could not be found. Please select a valid plan from our pricing page."
          onRetry={() => router.push("/pricing")}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)]">
      <Navbar />

      {/* ── Payment Status Overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <PaymentStatusOverlay
            status={overlayStatus}
            planName={plan.name}
            onSuccessRedirect={handleSuccessRedirect}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>

      {/* Dot-pattern hero strip */}
      <div className="relative w-full pt-28 pb-8 overflow-hidden border-b-2 border-[var(--color-ink-charcoal)]">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">
          <button
            id="checkout-back"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-label-md font-bold text-[var(--color-ink-charcoal)] opacity-60 hover:opacity-100 transition-opacity mb-6"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Pricing
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
              <CreditCard size={14} strokeWidth={2.5} />
              Secure Checkout
            </div>
            <h1 className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)]">
              Complete Your Upgrade
            </h1>
            <p className="text-body-lg text-[var(--color-ink-charcoal)] opacity-70 mt-1">
              You&apos;re one step away from unlocking the full VibeCheck
              experience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
          {/* Left — payment form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring" as const, stiffness: 90, damping: 14 }}
            className="space-y-6"
          >
            {/* Coupon */}
            <div
              className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] p-6"
              style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
            >
              <CheckoutCouponInput
                planId={plan.planId}
                onApply={handleApplyCoupon}
                onClear={handleClearCoupon}
                result={couponResult}
                error={couponError}
                isLoading={isCouponLoading}
              />
            </div>

            {/* Error banner */}
            {checkoutError && (
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
                  {checkoutError}
                </p>
              </motion.div>
            )}

            {/* Pay button */}
            <button
              id="checkout-pay-btn"
              onClick={handlePay}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-3 bg-[var(--color-ink-charcoal)] text-[var(--color-electric-sun)] font-display font-black text-lg uppercase tracking-wide py-5 px-8 border-2 border-[var(--color-ink-charcoal)] shadow-hard-lg btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <CreditCard size={22} strokeWidth={2} />
                  Pay
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
                Cancel anytime
              </span>
            </div>
          </motion.div>

          {/* Right — order summary */}
          <CheckoutOrderSummary plan={plan} coupon={couponResult} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
