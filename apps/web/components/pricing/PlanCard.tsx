"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Crown } from "lucide-react";

export interface PlanCardData {
  planId: string;
  name: string;
  razorpayPlanId: string | null;
  priceInPaise: number;
  interval: "monthly" | "yearly";
  maxQuizzes: number;
  maxQuestionsPerQuiz: number;
  maxSessionsPerQuiz: number;
  maxForms: number;
  aiFeaturesForQuizEnabled: boolean;
  aiFeaturesForFormsEnabled: boolean;
  createdAt: string | null; // Date → serialized to ISO string by JSON transport
}

interface PlanCardProps {
  plan: PlanCardData;
  index: number;
  isPopular?: boolean;
  onSelect: (planId: string) => void;
}

const ACCENT_COLORS = [
  "var(--color-leaf-green)",
  "var(--color-electric-sun)",
  "var(--color-vivid-coral)",
  "var(--color-sky-blue)",
  "var(--color-lavender)",
];

const ACCENT_BG_CLASSES = [
  "bg-[var(--color-leaf-green)]",
  "bg-[var(--color-electric-sun)]",
  "bg-[var(--color-vivid-coral)]",
  "bg-[var(--color-sky-blue)]",
  "bg-[var(--color-lavender)]",
];

function formatPrice(paise: number): string {
  if (paise === 0) return "₹0";
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function buildFeatures(plan: PlanCardData): string[] {
  const feats: string[] = [];
  feats.push(
    plan.maxQuizzes === -1 ? "Unlimited Quizzes" : `${plan.maxQuizzes} Quizzes`,
  );
  feats.push(
    plan.maxQuestionsPerQuiz === -1
      ? "Unlimited Questions / Quiz"
      : `${plan.maxQuestionsPerQuiz} Questions / Quiz`,
  );
  feats.push(
    plan.maxSessionsPerQuiz === -1
      ? "Unlimited Sessions / Quiz"
      : `${plan.maxSessionsPerQuiz} Sessions / Quiz`,
  );
  feats.push(
    plan.maxForms === -1 ? "Unlimited Forms" : `${plan.maxForms} Forms`,
  );
  if (plan.aiFeaturesForQuizEnabled) feats.push("AI Quiz Builder");
  if (plan.aiFeaturesForFormsEnabled) feats.push("AI Form Builder");
  return feats;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
      delay: i * 0.1,
    },
  }),
};

export function PlanCard({
  plan,
  index,
  isPopular = false,
  onSelect,
}: PlanCardProps) {
  const isFree = plan.priceInPaise === 0;
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length]!;
  const accentBg = ACCENT_BG_CLASSES[index % ACCENT_BG_CLASSES.length]!;
  const features = buildFeatures(plan);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{
        y: -6,
        boxShadow: `8px 8px 0px 0px var(--color-ink-charcoal)`,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className={`relative flex flex-col bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] shadow-hard overflow-hidden ${
        isPopular ? "ring-4 ring-offset-2 ring-[var(--color-leaf-green)]" : ""
      }`}
      style={{ boxShadow: `6px 6px 0px 0px var(--color-ink-charcoal)` }}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] font-display font-black text-[10px] uppercase tracking-widest px-3 py-1 border-l-2 border-b-2 border-[var(--color-ink-charcoal)] z-10 flex items-center gap-1">
          <Zap size={10} strokeWidth={3} />
          Most Popular
        </div>
      )}

      <div
        className="h-2 w-full border-b-2 border-[var(--color-ink-charcoal)]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="p-6 border-b-2 border-[var(--color-ink-charcoal)]">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 ${accentBg} border-2 border-[var(--color-ink-charcoal)] mb-4`}
        >
          {isFree ? (
            <Star
              size={18}
              strokeWidth={2.5}
              className="text-[var(--color-ink-charcoal)]"
            />
          ) : (
            <Crown
              size={18}
              strokeWidth={2.5}
              className="text-[var(--color-ink-charcoal)]"
            />
          )}
        </div>

        <h2 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] mb-1">
          {plan.name}
        </h2>

        <div className="flex items-end gap-1 mt-3">
          <span className="text-display-lg font-display font-black text-[var(--color-ink-charcoal)] leading-none">
            {formatPrice(plan.priceInPaise)}
          </span>
          {!isFree && (
            <span className="text-label-md text-[var(--color-ink-charcoal)] opacity-60 pb-1">
              /mo
            </span>
          )}
        </div>

        {!isFree && (
          <p className="text-label-sm text-[var(--color-ink-charcoal)] opacity-50 mt-1 uppercase tracking-widest">
            Billed monthly
          </p>
        )}
      </div>

      <ul className="flex-1 p-6 space-y-3">
        {features.map((feat) => (
          <li
            key={feat}
            className="flex items-center gap-3 text-body-md text-[var(--color-ink-charcoal)]"
          >
            <span
              className={`flex-shrink-0 w-5 h-5 ${accentBg} border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center`}
            >
              <Check
                size={11}
                strokeWidth={3}
                className="text-[var(--color-ink-charcoal)]"
              />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      <div className="p-6 pt-0">
        <button
          id={`plan-select-${plan.planId}`}
          onClick={() => onSelect(plan.planId)}
          className={`w-full font-display font-bold text-sm uppercase tracking-wide py-3 px-6 border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm transition-all btn-press ${
            isFree
              ? "bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] hover:bg-[var(--color-surface-container)]"
              : `${accentBg} text-[var(--color-ink-charcoal)]`
          }`}
        >
          {isFree ? "Get Started Free" : `Choose ${plan.name}`}
        </button>
      </div>
    </motion.div>
  );
}
