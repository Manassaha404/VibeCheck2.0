import React from 'react';

export function FormSetupHeader() {
  return (
    <div className="mb-12 relative z-10 flex flex-col items-center text-center gap-6">
      <div>
        <h1 className="font-display-lg text-4xl md:text-6xl text-ink-charcoal uppercase italic font-black tracking-tighter bg-electric-sun border-4 border-ink-charcoal px-8 py-4 shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] inline-block mb-4">
          Build Your Form
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl bg-pure-white border-2 border-ink-charcoal rounded-DEFAULT p-4 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] inline-block mx-auto">
          Craft the ultimate data collection experience. Keep it loud.
        </p>
      </div>
    </div>
  );
}
