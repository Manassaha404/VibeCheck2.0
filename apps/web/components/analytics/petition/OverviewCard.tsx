import React from 'react';
import { Activity } from 'lucide-react';

export default function OverviewCard({ title, totalSignatures, target }: { title: string, totalSignatures: number, target: number }) {
  const progress = target > 0 ? Math.min(100, Math.round((totalSignatures / target) * 100)) : 100;

  return (
    <section className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-6 md:p-8 shadow-hard relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-block bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-3 py-1 font-body text-label-sm uppercase mb-3 font-bold">
            Active Status
          </span>
          <h2 className="font-display text-headline-sm md:text-headline-md mb-2">{title}</h2>
        </div>
        <Activity size={40} className="text-[var(--color-ink-charcoal)]" />
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-end mb-2">
          <span className="font-display text-headline-md font-extrabold text-[var(--color-primary)]">{totalSignatures.toLocaleString()}</span>
          <span className="font-body text-label-md text-[var(--color-outline)]">Target: {target.toLocaleString()} Signatures</span>
        </div>
        <div className="w-full h-8 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden relative">
          <div className="h-full bg-[var(--color-leaf-green)] border-r-2 border-[var(--color-ink-charcoal)] flex items-center justify-end pr-2" style={{ width: `${progress}%` }}>
            <span className="font-body text-label-sm font-bold text-[var(--color-ink-charcoal)]">{progress}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
