import React from 'react';
import Link from 'next/link';

interface CreateCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColorClass: string;
  badgeBgClass: string;
  badgeColorClass: string;
}

export function CreateCard({
  title,
  description,
  icon,
  href,
  accentColorClass,
  badgeBgClass,
  badgeColorClass,
}: CreateCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl p-8 shadow-neubrutalist hover-lift relative overflow-hidden"
    >
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full group-hover:scale-150 transition-transform duration-500 ${accentColorClass}`}
      ></div>
      <div className="flex items-start gap-6 relative z-10">
        <div
          className={`w-16 h-16 border-2 border-[var(--color-ink-charcoal)] rounded-lg flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all ${badgeBgClass}`}
        >
          <div className={badgeColorClass}>{icon}</div>
        </div>
        <div>
          <h2 className="font-display text-headline-sm md:text-headline-md font-bold text-[var(--color-ink-charcoal)] mb-2">
            {title}
          </h2>
          <p className="font-body text-body-md text-[var(--color-on-surface-variant)]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
