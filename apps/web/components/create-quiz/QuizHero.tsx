import React from 'react';
import { Zap } from 'lucide-react';

export default function QuizHero() {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative inline-block">
        <h1 className="font-display-lg text-display-lg uppercase font-black italic -rotate-3 bg-electric-sun text-ink-charcoal px-8 py-4 border-4 border-ink-charcoal shadow-hard relative z-10 tracking-tighter">
          QUIZ MASTER
        </h1>
        {/* Decorative element behind title */}
        <div aria-hidden="true" className="absolute -top-4 -right-6 text-pure-white rotate-12 z-0 opacity-80">
          <Zap size={80} fill="currentColor" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
}
