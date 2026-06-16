'use client';

import React from 'react';

export function ResponsesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex flex-col gap-3 w-full md:w-2/3">
          <div className="h-8 w-40 bg-ink-charcoal/10 border-2 border-ink-charcoal/10" />
          <div className="h-20 w-3/4 bg-ink-charcoal/10 border-2 border-ink-charcoal/10" />
          <div className="h-10 w-1/2 bg-pure-white border-4 border-ink-charcoal/10" />
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="w-44 h-24 bg-electric-sun/40 border-4 border-ink-charcoal/10" />
          <div className="w-44 h-24 bg-ink-charcoal/10 border-4 border-ink-charcoal/10" />
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="h-16 bg-pure-white border-4 border-ink-charcoal/20 shadow-[8px_8px_0px_0px_rgba(44,46,42,0.08)]" />

      {/* Table skeleton */}
      <div className="bg-pure-white border-4 border-ink-charcoal/20 shadow-[8px_8px_0px_0px_rgba(44,46,42,0.08)] overflow-hidden">
        {/* Table header */}
        <div className="h-12 bg-canvas-cream border-b-4 border-ink-charcoal/10 hidden md:block" />
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b-4 border-ink-charcoal/10"
          >
            <div className="w-10 h-10 rounded-full bg-ink-charcoal/10 border-2 border-ink-charcoal/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-ink-charcoal/10 rounded w-1/4" />
              <div className="h-3 bg-ink-charcoal/10 rounded w-2/3" />
            </div>
            <div className="h-3 w-20 bg-ink-charcoal/10 rounded hidden md:block" />
          </div>
        ))}
        {/* Pagination skeleton */}
        <div className="h-14 bg-canvas-cream border-t-4 border-ink-charcoal/10" />
      </div>
    </div>
  );
}
