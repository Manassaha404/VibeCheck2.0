import React from "react";
import { Users } from "lucide-react";

export default function PublicPollsSection() {
  return (
    <section>
      <div className="flex justify-between items-end mb-8 border-b-4 border-[var(--color-ink-charcoal)] pb-4">
        <h2 className="text-headline-md font-display font-extrabold text-[var(--color-ink-charcoal)]">
          Public Polls & Petitions
        </h2>
        <div className="hidden md:flex gap-2">
          <button className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] px-4 py-1 rounded-full font-bold hover:bg-[var(--color-leaf-green)] transition-colors">
            Latest
          </button>
          <button className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] px-4 py-1 rounded-full font-bold hover:bg-[var(--color-leaf-green)] transition-colors">
            Most Discussed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300 flex flex-col">
          <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
            <span className="inline-block bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-2 py-1 rounded-md mb-3 font-bold w-fit">
              Tech
            </span>
            <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] mb-4 leading-tight z-10">
              Will AI replace designers in 5 years?
            </h3>
            <div className="mt-auto z-10">
              <div className="flex justify-between font-bold text-sm mb-1">
                <span>Yes (65%)</span>
                <span>No (35%)</span>
              </div>
              <div className="w-full h-4 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden flex">
                <div className="w-[65%] bg-[var(--color-electric-sun)] border-r-2 border-[var(--color-ink-charcoal)] h-full"></div>
              </div>
            </div>
          </div>
          <div className="border-t-4 border-[var(--color-ink-charcoal)] p-4 bg-[var(--color-canvas-cream)] flex justify-between items-center rounded-b-lg">
            <span className="font-bold flex items-center gap-1">
              <Users size={16} /> 3,402
            </span>
            <button className="bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full font-bold shadow-hard-sm hover:shadow-none hover:translate-y-[2px] transition-all">
              Vote
            </button>
          </div>
        </article>

        <article className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300 flex flex-col">
          <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
            <span className="inline-block bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-2 py-1 rounded-md mb-3 font-bold w-fit">
              Gaming
            </span>
            <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] mb-4 leading-tight z-10">
              Favorite Console Generation?
            </h3>
            <div className="mt-auto z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-leaf-green)]"></div>
                <span className="font-bold text-sm">PS2/Xbox Era</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)]"></div>
                <span className="font-bold text-sm">Current Gen</span>
              </div>
            </div>
          </div>
          <div className="border-t-4 border-[var(--color-ink-charcoal)] p-4 bg-[var(--color-electric-sun)] flex justify-between items-center rounded-b-lg">
            <span className="font-bold flex items-center gap-1">
              <Users size={16} /> 12,890
            </span>
            <button className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full font-bold shadow-hard-sm hover:shadow-none hover:translate-y-[2px] transition-all">
              Vote
            </button>
          </div>
        </article>

        <article className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300 flex flex-col">
          <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
            <span className="inline-block bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-2 py-1 rounded-md mb-3 font-bold w-fit">
              Lifestyle
            </span>
            <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] mb-4 leading-tight z-10">
              Best time to wake up for maximum productivity?
            </h3>
            <div className="mt-auto z-10 grid grid-cols-2 gap-2">
              <div className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] text-center py-1 font-bold rounded">
                5 AM
              </div>
              <div className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] text-center py-1 font-bold rounded">
                7 AM
              </div>
              <div className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] text-center py-1 font-bold rounded">
                9 AM
              </div>
              <div className="border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] text-center py-1 font-bold rounded">
                Whenever
              </div>
            </div>
          </div>
          <div className="border-t-4 border-[var(--color-ink-charcoal)] p-4 bg-[var(--color-canvas-cream)] flex justify-between items-center rounded-b-lg">
            <span className="font-bold flex items-center gap-1">
              <Users size={16} /> 5,112
            </span>
            <button className="bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full font-bold shadow-hard-sm hover:shadow-none hover:translate-y-[2px] transition-all">
              Vote
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
