import React from 'react';
import { LineChart, Users } from 'lucide-react';

export function SessionHeroStats({ averageScore, totalParticipants }: { averageScore: number; totalParticipants: number }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-[var(--color-electric-sun)] border-4 border-ink-charcoal shadow-hard-xl rounded-xl p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group hover-lift card-lift">
        <div className="absolute -right-8 -top-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-300">
          <LineChart size={200} />
        </div>
        <h2 className="font-headline-sm uppercase tracking-widest mb-4 relative z-10">Average Score</h2>
        <div className="font-display-lg text-[120px] leading-none font-black text-ink-charcoal relative z-10">{averageScore}</div>
      </div>

      <div className="bg-[var(--color-leaf-green)] border-4 border-ink-charcoal shadow-hard-xl rounded-xl p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group hover-lift card-lift">
        <div className="absolute -left-8 -bottom-8 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-300">
          <Users size={200} />
        </div>
        <h2 className="font-headline-sm uppercase tracking-widest mb-4 relative z-10">Total Participants</h2>
        <div className="font-display-lg text-[120px] leading-none font-black text-ink-charcoal relative z-10">{totalParticipants.toLocaleString()}</div>
        <div className="absolute top-4 left-4 bg-[var(--color-pure-white)] border-2 border-ink-charcoal px-4 py-1 rounded-full font-bold -rotate-3 shadow-hard-sm">LIVE NOW</div>
      </div>
    </section>
  );
}
