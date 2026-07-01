"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart2,
  FileText,
  Megaphone,
  Archive,
  AlertTriangle,
  SearchX,
  Home,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentKind = "poll" | "form" | "petition";

export type ContentErrorVariant =
  | "not_found"      // 404 – content doesn't exist or never published
  | "archived"       // owner archived it
  | "forbidden"      // generic access denied / server FORBIDDEN
  | "error";         // unexpected / network error

interface ContentErrorStateProps {
  /** What type of content failed to load */
  kind?: ContentKind;
  /** Specific error variant — drives icon, heading, and copy */
  variant?: ContentErrorVariant;
  /** Custom heading override */
  heading?: string;
  /** Custom description override */
  description?: string;
  /** Show a retry button */
  onRetry?: () => void;
}

// ─── Per-variant copy ─────────────────────────────────────────────────────────

const kindLabel: Record<ContentKind, string> = {
  poll: "Poll",
  form: "Form",
  petition: "Petition",
};

const kindIcon: Record<ContentKind, React.ReactNode> = {
  poll: <BarChart2 size={28} strokeWidth={2.5} />,
  form: <FileText size={28} strokeWidth={2.5} />,
  petition: <Megaphone size={28} strokeWidth={2.5} />,
};

type VariantConfig = {
  icon: React.ReactNode;
  accent: string;       // bg color for the icon box
  badge: string;        // small status badge text
  badgeBg: string;
  heading: (kind: string) => string;
  description: (kind: string) => string;
};

const variantConfig: Record<ContentErrorVariant, VariantConfig> = {
  not_found: {
    icon: <SearchX size={28} strokeWidth={2.5} />,
    accent: "bg-[var(--color-electric-sun)]",
    badge: "Not Found",
    badgeBg: "bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)]",
    heading: (k) => `${k} Not Found`,
    description: (k) =>
      `This ${k.toLowerCase()} doesn't exist, hasn't been published yet, or the link is incorrect.`,
  },
  archived: {
    icon: <Archive size={28} strokeWidth={2.5} />,
    accent: "bg-[var(--color-surface-container-high)]",
    badge: "Archived",
    badgeBg:
      "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
    heading: (k) => `${k} Archived`,
    description: (k) =>
      `This ${k.toLowerCase()} has been archived by its creator and is no longer accepting new responses.`,
  },
  forbidden: {
    icon: <AlertTriangle size={28} strokeWidth={2.5} />,
    accent: "bg-[var(--color-vivid-coral)]",
    badge: "Access Denied",
    badgeBg: "bg-[var(--color-vivid-coral)] text-white",
    heading: (k) => `${k} Unavailable`,
    description: (k) =>
      `You don't have permission to access this ${k.toLowerCase()}, or it's no longer available.`,
  },
  error: {
    icon: <AlertTriangle size={28} strokeWidth={2.5} />,
    accent: "bg-[var(--color-tangerine)]",
    badge: "Something went wrong",
    badgeBg: "bg-[var(--color-tangerine)] text-[var(--color-ink-charcoal)]",
    heading: (_k) => "Something Went Wrong",
    description: (k) =>
      `We couldn't load this ${k.toLowerCase()}. Please try again or come back later.`,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ContentErrorState({
  kind = "form",
  variant = "not_found",
  heading,
  description,
  onRetry,
}: ContentErrorStateProps) {
  const vc = variantConfig[variant];
  const label = kindLabel[kind];
  const KindIcon = kindIcon[kind];

  const finalHeading = heading ?? vc.heading(label);
  const finalDesc = description ?? vc.description(label);

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)] bg-dot-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl shadow-hard-xl p-8 md:p-10 flex flex-col items-center text-center gap-6">

          {/* Icon stack */}
          <div className="relative">
            {/* Main variant icon box */}
            <div
              className={`w-20 h-20 rounded-2xl border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center ${vc.accent}`}
            >
              {vc.icon}
            </div>
            {/* Kind badge — overlapping bottom-right */}
            <div
              className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm flex items-center justify-center bg-[var(--color-pure-white)]"
            >
              {KindIcon}
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full border-2 border-[var(--color-ink-charcoal)] text-label-sm font-bold ${vc.badgeBg}`}
          >
            {vc.badge}
          </span>

          {/* Heading */}
          <h1 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] leading-tight -mt-2">
            {finalHeading}
          </h1>

          {/* Description */}
          <p className="text-body-md text-[var(--color-on-surface-variant)] -mt-2">
            {finalDesc}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-outline-variant)]" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] text-label-md font-bold rounded-xl border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press"
            >
              <Home size={15} />
              Go Home
            </Link>

            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] text-label-md font-bold rounded-xl border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-label-sm text-[var(--color-on-surface-variant)] mt-4 opacity-70">
          Think this is a mistake?{" "}
          <Link href="/" className="underline underline-offset-2 hover:opacity-100">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
