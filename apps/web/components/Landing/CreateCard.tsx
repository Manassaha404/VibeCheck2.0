"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CreateCardVariant = "poll" | "quiz" | "form" | "petition";

export interface CreateCardProps {
  variant: CreateCardVariant;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Override the accent color (CSS value or var()) */
  accentColor?: string;
  /** Override the destination href */
  href?: string;
  onClick?: () => void;
  id?: string;
}

const variantDefaults: Record<
  CreateCardVariant,
  { color: string; href: string }
> = {
  poll:     { color: "var(--color-electric-sun)",  href: "/create/poll" },
  quiz:     { color: "var(--color-leaf-green)",     href: "/create/quiz" },
  form:     { color: "var(--color-tertiary-fixed)", href: "/create/form" },
  petition: { color: "var(--color-primary-fixed)",  href: "/create/petition" },
};

export default function CreateCard({
  variant,
  title,
  description,
  icon,
  accentColor,
  href,
  onClick,
  id,
}: CreateCardProps) {
  const defaults = variantDefaults[variant];
  const accent   = accentColor ?? defaults.color;
  const dest     = href ?? defaults.href;

  return (
    <Link
      id={id}
      href={dest}
      onClick={onClick}
      aria-label={`Create a new ${title}`}
      className="group relative flex flex-col gap-6 w-full text-left rounded-2xl border-4 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] p-7 overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-electric-sun)] focus-visible:ring-offset-2"
      style={{ boxShadow: "5px 5px 0px 0px var(--color-ink-charcoal)" }}
    >
      <div
        className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-25 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl border-2 border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] select-none"
        style={{
          backgroundColor: accent,
          boxShadow: "2px 2px 0px 0px var(--color-ink-charcoal)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="relative z-10 flex flex-col gap-2 flex-grow">
        <h3 className="font-display font-black text-[22px] leading-tight text-[var(--color-ink-charcoal)]">
          {title}
        </h3>
        <p className="text-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--color-ink-charcoal)] text-label-md font-bold text-[var(--color-ink-charcoal)] transition-all duration-200 group-hover:gap-3"
          style={{
            backgroundColor: accent,
            boxShadow: "2px 2px 0px 0px var(--color-ink-charcoal)",
          }}
        >
          Create {title}
          <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
