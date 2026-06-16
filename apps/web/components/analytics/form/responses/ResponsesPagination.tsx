'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResponsesPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ResponsesPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: ResponsesPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="p-4 border-t-4 border-ink-charcoal bg-canvas-cream flex justify-between items-center">
      {/* Info */}
      <span className="font-bold text-sm uppercase tracking-wide text-ink-charcoal">
        {total === 0
          ? 'No responses'
          : `Showing ${from}–${to} of ${total.toLocaleString()}`}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className={`flex items-center gap-1 px-4 py-2 font-black text-sm uppercase border-4 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all ${
            canPrev
              ? 'bg-pure-white text-ink-charcoal hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer'
              : 'bg-pure-white/50 text-ink-charcoal/30 cursor-not-allowed shadow-none'
          }`}
        >
          <ChevronLeft size={16} strokeWidth={3} />
          Prev
        </button>

        {/* Page indicator */}
        <span className="px-4 py-2 font-black text-sm uppercase border-4 border-ink-charcoal bg-ink-charcoal text-pure-white">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className={`flex items-center gap-1 px-4 py-2 font-black text-sm uppercase border-4 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all ${
            canNext
              ? 'bg-leaf-green text-ink-charcoal hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer'
              : 'bg-leaf-green/30 text-ink-charcoal/30 cursor-not-allowed shadow-none'
          }`}
        >
          Next
          <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
