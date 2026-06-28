import React from 'react';
import { CreateHeader } from '@/components/Create/CreateHeader';
import { CreateCard } from '@/components/Create/CreateCard';
import { BarChart, FileText, Lightbulb, LayoutTemplate, Megaphone } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function CreateSelectionPage() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body antialiased min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      <main className="flex-grow w-full px-4 md:px-[var(--spacing-margin-desktop)] py-16 md:py-24 max-w-[var(--spacing-container-max)] mx-auto flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl mx-auto">
          <CreateHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10">
          <CreateCard
            title="Poll"
            description="Gather quick vibes and opinions from your community."
            icon={<BarChart className="w-8 h-8" strokeWidth={2.5} />}
            href="/create/poll"
            accentColorClass="bg-[var(--color-leaf-green)] opacity-20"
            badgeBgClass="bg-[var(--color-leaf-green)]"
            badgeColorClass="text-[var(--color-ink-charcoal)]"
          />
          <CreateCard
            title="Form"
            description="Build powerful, custom data collectors."
            icon={<FileText className="w-8 h-8" strokeWidth={2.5} />}
            href="/create/form"
            accentColorClass="bg-[var(--color-electric-sun)] opacity-20"
            badgeBgClass="bg-[var(--color-electric-sun)]"
            badgeColorClass="text-[var(--color-ink-charcoal)]"
          />
          <CreateCard
            title="Quiz"
            description="Test knowledge with engaging, scored challenges."
            icon={<Lightbulb className="w-8 h-8" strokeWidth={2.5} />}
            href="/create/quiz"
            accentColorClass="bg-[var(--color-error-container)] opacity-50"
            badgeBgClass="bg-[var(--color-error-container)]"
            badgeColorClass="text-[var(--color-ink-charcoal)]"
          />
          <CreateCard
            title="Petition"
            description="Craft a narrative that moves people to action. Bold ideas win."
            icon={<Megaphone className="w-8 h-8" strokeWidth={2.5} />}
            href="/create/petition"
            accentColorClass="bg-[var(--color-sky-blue)] opacity-50"
            badgeBgClass="bg-[var(--color-sky-blue)]"
            badgeColorClass="text-[var(--color-ink-charcoal)]"
          />
        </div>
        </div>
      </main>
    </div>
  );
}
