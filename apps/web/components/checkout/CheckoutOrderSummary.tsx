"use client";

import { motion } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  Zap,
  BrainCircuit,
  FileText,
  LayoutList,
  Users,
} from "lucide-react";
import type { CouponResult } from "@/hook/subscription/useApplyCoupon";

interface Plan {
  planId: string;
  name: string;
  priceInPaise: number;
  interval: "monthly" | "yearly";
  maxQuizzes: number;
  maxQuestionsPerQuiz: number;
  maxSessionsPerQuiz: number;
  maxForms: number;
  aiFeaturesForQuizEnabled: boolean;
  aiFeaturesForFormsEnabled: boolean;
}

interface CheckoutOrderSummaryProps {
  plan: Plan;
  coupon: CouponResult | null;
}

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  quiz: <LayoutList size={14} strokeWidth={2.5} />,
  session: <Users size={14} strokeWidth={2.5} />,
  form: <FileText size={14} strokeWidth={2.5} />,
  ai: <BrainCircuit size={14} strokeWidth={2.5} />,
};

function buildFeatureLines(plan: Plan) {
  const lines = [
    {
      icon: FEATURE_ICONS.quiz,
      label:
        plan.maxQuizzes === -1
          ? "Unlimited Quizzes"
          : `${plan.maxQuizzes} Quizzes`,
    },
    {
      icon: FEATURE_ICONS.session,
      label:
        plan.maxSessionsPerQuiz === -1
          ? "Unlimited Sessions / Quiz"
          : `${plan.maxSessionsPerQuiz} Sessions / Quiz`,
    },
    {
      icon: FEATURE_ICONS.form,
      label:
        plan.maxForms === -1 ? "Unlimited Forms" : `${plan.maxForms} Forms`,
    },
  ];
  if (plan.aiFeaturesForQuizEnabled)
    lines.push({ icon: FEATURE_ICONS.ai, label: "AI Quiz Builder" });
  if (plan.aiFeaturesForFormsEnabled)
    lines.push({ icon: FEATURE_ICONS.ai, label: "AI Form Builder" });
  return lines;
}

export function CheckoutOrderSummary({
  plan,
  coupon,
}: CheckoutOrderSummaryProps) {
  const hasDiscount = !!coupon;
  const finalPaise = coupon ? coupon.discountedPriceInPaise : plan.priceInPaise;
  const features = buildFeatureLines(plan);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
        delay: 0.1,
      }}
      className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] overflow-hidden"
      style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
    >
      <div className="bg-[var(--color-ink-charcoal)] px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-electric-sun)] border-2 border-[var(--color-electric-sun)] flex items-center justify-center flex-shrink-0">
          <Crown
            size={16}
            strokeWidth={2.5}
            className="text-[var(--color-ink-charcoal)]"
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-electric-sun)] uppercase tracking-widest">
            Order Summary
          </p>
          <p className="font-display font-black text-[var(--color-pure-white)] text-lg leading-tight">
            {plan.name} Plan
          </p>
        </div>
      </div>

      <ul className="px-6 py-5 space-y-2.5 border-b-2 border-[var(--color-ink-charcoal)]">
        {features.map((f) => (
          <li
            key={f.label}
            className="flex items-center gap-3 text-body-md text-[var(--color-ink-charcoal)]"
          >
            <span className="w-5 h-5 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center flex-shrink-0">
              <CheckCircle2
                size={11}
                strokeWidth={3}
                className="text-[var(--color-ink-charcoal)]"
              />
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      <div className="px-6 py-5 space-y-3">
        <div className="flex items-center justify-between text-body-md text-[var(--color-ink-charcoal)]">
          <span>Plan price</span>
          <span
            className={hasDiscount ? "line-through opacity-50" : "font-bold"}
          >
            {formatINR(plan.priceInPaise)}
          </span>
        </div>

        {hasDiscount && coupon && (
          <div className="flex items-center justify-between text-body-md">
            <span className="flex items-center gap-1.5 text-[var(--color-ink-charcoal)]">
              <Zap
                size={13}
                strokeWidth={2.5}
                className="text-[var(--color-leaf-green)]"
              />
              Coupon discount
            </span>
            <span className="font-bold text-[var(--color-primary)]">
              −{" "}
              {coupon.discountType === "percentage"
                ? `${coupon.discountValue}%`
                : formatINR(coupon.discountValue)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t-2 border-[var(--color-ink-charcoal)] pt-3">
          <span className="font-display font-black text-[var(--color-ink-charcoal)]">
            Total / month
          </span>
          <span className="font-display font-black text-[var(--color-ink-charcoal)] text-2xl">
            {formatINR(finalPaise)}
          </span>
        </div>

        <p className="text-label-sm text-[var(--color-ink-charcoal)] opacity-50 uppercase tracking-widest">
          Billed monthly · cancel anytime
        </p>
      </div>
    </motion.div>
  );
}
