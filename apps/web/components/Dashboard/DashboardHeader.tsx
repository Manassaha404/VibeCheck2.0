"use client";

import React from "react";
import Link from "next/link";
import { Plus, Sparkles, Bookmark } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Creator" }: DashboardHeaderProps) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative w-full overflow-hidden border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-ink-charcoal)] rounded-xl shadow-hard-xl p-8 md:p-10">
      {/* Background decorative blobs */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-20"
        style={{ background: "var(--color-leaf-green)" }}
      />
      <div
        className="absolute -bottom-8 right-32 w-40 h-40 rounded-full opacity-10"
        style={{ background: "var(--color-electric-sun)" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: greeting */}
        <div>
          <p className="text-label-md text-[var(--color-leaf-green)] tracking-widest uppercase mb-1">
            {dateStr}
          </p>
          <h1 className="text-display-lg text-[var(--color-pure-white)] leading-tight">
            {greeting},{" "}
            <span className="text-[var(--color-electric-sun)]">{userName}</span>
            &nbsp;
            <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-body-lg text-[var(--color-pure-white)] opacity-60 mt-2 max-w-md">
            Here's everything happening across your content today.
          </p>
        </div>

        {/* Right: CTA */}
        <div className="flex flex-col gap-3 shrink-0">
          <Link
            href="/create"
            id="dashboard-create-cta"
            className="inline-flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-electric-sun)] px-6 py-3 font-display font-bold text-headline-sm shadow-hard-lg btn-press rounded-lg"
          >
            <Plus size={20} strokeWidth={3} />
            Create New
          </Link>
          <Link
            href="/explore"
            id="dashboard-explore-cta"
            className="inline-flex items-center gap-2 border-2 border-[var(--color-pure-white)] text-[var(--color-pure-white)] px-6 py-3 font-display font-bold text-headline-sm hover:bg-white hover:text-[var(--color-ink-charcoal)] transition-colors rounded-lg"
          >
            <Sparkles size={18} />
            Explore Vibes
          </Link>
          <Link
            href="/saved"
            id="dashboard-saved-cta"
            className="inline-flex items-center gap-2 border-2 border-[var(--color-pure-white)] text-[var(--color-pure-white)] px-6 py-3 font-display font-bold text-headline-sm hover:bg-white hover:text-[var(--color-ink-charcoal)] transition-colors rounded-lg"
          >
            <Bookmark size={18} />
            Saved
          </Link>
        </div>
      </div>
    </section>
  );
}
