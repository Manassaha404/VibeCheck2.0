"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, RefreshCw, BadgeCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PlanCard } from "@/components/pricing/PlanCard";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { useGetPlans } from "@/hook/subscription/useGetPlans";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const router = useRouter();
  const { plans, isLoading, isError } = useGetPlans("monthly");

  const handleSelectPlan = useCallback(
    (planId: string) => {
      const selectedPlan = plans.find((p) => p.planId === planId);
      if (!selectedPlan || selectedPlan.priceInPaise === 0) {
        // Free plan — send them straight into the app
        router.push("/create");
        return;
      }
      router.push(`/checkout?planId=${planId}`);
    },
    [plans, router],
  );

  // Most popular = cheapest paid plan
  const popularPlanId =
    plans
      .filter((p) => p.priceInPaise > 0)
      .sort((a, b) => a.priceInPaise - b.priceInPaise)[0]?.planId ?? null;

  const TRUST_ITEMS = [
    {
      icon: <Lock size={14} strokeWidth={2.5} />,
      label: "Secure Payments via Razorpay",
    },
    {
      icon: <RefreshCw size={14} strokeWidth={2.5} />,
      label: "Cancel Anytime",
    },
    {
      icon: <BadgeCheck size={14} strokeWidth={2.5} />,
      label: "Cancel Anytime — No Refunds on Used Periods",
    },
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] flex flex-col">
        <Navbar />
        <DashboardError
          title="COULD NOT LOAD PLANS!"
          message="Failed to fetch subscription plans. Please refresh or try again later."
          onRetry={() => window.location.reload()}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)]">
      <Navbar />

      {/* Dot-pattern hero strip */}
      <div className="relative w-full pt-28 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">
          <PricingHeader />
        </div>
      </div>

      {/* Plans grid */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.planId}
              plan={plan}
              index={i}
              isPopular={plan.planId === popularPlanId}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {/* Trust strip */}
        {!isLoading && plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-label-md text-[var(--color-ink-charcoal)] opacity-70"
          >
            {TRUST_ITEMS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                {icon}
                {label}
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* FAQ */}
      <PricingFaq />

      {/* Bottom CTA banner */}
      <section className="border-t-2 border-[var(--color-ink-charcoal)] bg-[var(--color-ink-charcoal)] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-headline-lg font-display font-black text-[var(--color-electric-sun)] mb-4">
            Still Not Sure?
          </h2>
          <p className="text-body-lg text-[var(--color-canvas-cream)] opacity-80 mb-8">
            Start with the Free plan today. Upgrade when you&apos;re ready — no
            pressure, no catch.
          </p>
          <button
            id="pricing-cta-free"
            onClick={() => router.push("/create")}
            className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-bold text-sm uppercase tracking-wide px-8 py-4 border-2 border-[var(--color-electric-sun)] shadow-[4px_4px_0px_0px_rgba(142,212,98,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all btn-press"
          >
            Start Creating →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
