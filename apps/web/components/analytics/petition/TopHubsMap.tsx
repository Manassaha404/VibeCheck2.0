"use client";
import React from 'react';
import { Globe } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center font-display font-bold text-headline-sm text-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)]">Loading Map...</div>
});

export default function TopHubsMap({ topCities }: { topCities: { city: string, country: string, count: number }[] }) {
  return (
    <section className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-6 shadow-hard text-[var(--color-ink-charcoal)] relative flex flex-col h-[600px] w-full">
      <div className="relative z-10 flex justify-between items-center mb-6 border-b-2 border-[var(--color-ink-charcoal)] pb-4 shrink-0 bg-[var(--color-pure-white)]">
        <h3 className="font-display text-headline-sm uppercase">Global Map</h3>
        <Globe className="text-[var(--color-electric-sun)] bg-[var(--color-ink-charcoal)] p-1 animate-[pulse-border_2s_infinite] rounded-full border-2 border-[var(--color-ink-charcoal)]" size={32} />
      </div>

      <div className="relative z-0 flex-grow w-full border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm overflow-hidden bg-[var(--color-canvas-cream)]">
        <LeafletMap topCities={topCities} />
      </div>
    </section>
  );
}
