import React from 'react';

export function CreateHeader() {
  return (
    <header className="text-center mb-16 relative z-10 w-full animate-pop-in">
      <div className="inline-block relative">
        <h1 className="font-display text-headline-lg md:text-display-lg font-extrabold text-[var(--color-ink-charcoal)] mb-6 px-4 leading-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span>What would you like to</span>
          <span className="bg-[var(--color-lavender)] px-6 py-1 rounded-2xl border-4 border-[var(--color-ink-charcoal)] shadow-[6px_6px_0px_0px_var(--color-shadow-hard)] rotate-2 hover:rotate-[-2deg] transition-transform duration-300 mt-2 md:mt-0">
            create?
          </span>
        </h1>
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-[var(--color-electric-sun)] rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-hard -z-10 animate-wiggle hidden md:block"></div>
        <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-[var(--color-sky-blue)] border-2 border-[var(--color-ink-charcoal)] rotate-12 shadow-hard -z-10 hidden md:block"></div>
      </div>
      <div className="mt-2">
        <p className="font-body text-body-lg text-[var(--color-ink-charcoal)] font-bold max-w-2xl mx-auto bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] py-2 px-6 rounded-full shadow-hard-sm inline-block">
          Choose a format below to start building your next vibe.
        </p>
      </div>
    </header>
  );
}
