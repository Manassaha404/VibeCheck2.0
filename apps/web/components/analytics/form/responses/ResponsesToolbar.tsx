'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface ResponsesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  totalResults: number;
}

const LIMIT_OPTIONS = [10, 25, 50];

export function ResponsesToolbar({
  search,
  onSearchChange,
  limit,
  onLimitChange,
  totalResults,
}: ResponsesToolbarProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-pure-white p-4 border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] w-full">
      {/* Search */}
      <div className="relative flex-1 md:max-w-md">
        <Search
          size={18}
          strokeWidth={2.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-charcoal pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by respondent identity…"
          className="w-full pl-10 pr-10 py-3 bg-canvas-cream border-4 border-ink-charcoal font-bold text-base text-ink-charcoal placeholder:text-ink-charcoal/40 focus:outline-none focus:border-electric-sun transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-charcoal hover:text-[#FF007F] transition-colors"
          >
            <X size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Results label */}
        <span className="font-black text-sm uppercase text-ink-charcoal/60 whitespace-nowrap">
          {totalResults.toLocaleString()} results
        </span>

        {/* Per-page */}
        <div className="flex items-center gap-2">
          <span className="font-black text-xs uppercase text-ink-charcoal/60 whitespace-nowrap">
            Show:
          </span>
          <div className="flex border-4 border-ink-charcoal overflow-hidden">
            {LIMIT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => onLimitChange(opt)}
                className={`px-3 py-2 font-black text-sm uppercase transition-colors ${
                  limit === opt
                    ? 'bg-ink-charcoal text-pure-white'
                    : 'bg-pure-white text-ink-charcoal hover:bg-canvas-cream'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
