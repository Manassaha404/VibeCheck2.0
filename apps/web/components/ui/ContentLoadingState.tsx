"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function ContentLoadingState() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl shadow-hard-xl p-8 md:p-10 flex flex-col items-center text-center gap-6">

          {/* Icon stack */}
          <div className="relative">
            {/* Main variant icon box */}
            <div className="w-20 h-20 rounded-2xl border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center bg-[var(--color-sky-blue)]">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-ink-charcoal)]" strokeWidth={2.5} />
            </div>
            {/* Badge — overlapping bottom-right */}
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm flex items-center justify-center bg-[var(--color-electric-sun)] animate-wiggle">
               <span className="w-3 h-3 rounded-full bg-[var(--color-ink-charcoal)] animate-pulse" />
            </div>
          </div>

          {/* Status badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-[var(--color-ink-charcoal)] text-label-sm font-bold bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]">
            Loading
          </span>

          {/* Heading */}
          <h1 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] leading-tight -mt-2">
            Getting things ready...
          </h1>

          {/* Description Skeletons */}
          <div className="flex flex-col items-center gap-3 w-full mt-2">
            <div className="h-4 w-4/5 bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] rounded-full animate-pulse" />
            <div className="h-4 w-3/5 bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] rounded-full animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
}
