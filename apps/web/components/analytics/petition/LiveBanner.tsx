import React from 'react';

export default function LiveBanner() {
  return (
    <div className="w-full flex justify-center mb-12">
      <div className="bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 rounded-full flex items-center gap-3 animate-[pulse-border_2s_infinite] font-body text-label-md font-bold uppercase tracking-widest shadow-hard">
        <span className="w-3 h-3 bg-[var(--color-error)] rounded-full animate-pulse border border-[var(--color-ink-charcoal)]"></span>
        Live Updates Active
      </div>
    </div>
  );
}
