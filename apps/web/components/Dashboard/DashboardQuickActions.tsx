"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, FileText, Megaphone, Lightbulb, ArrowRight } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accentClass: string;
  iconBgClass: string;
  id: string;
}

const actions: QuickAction[] = [
  {
    id: "quick-create-poll",
    title: "New Poll",
    description: "Gather quick opinions",
    href: "/create/poll",
    icon: <BarChart2 size={20} strokeWidth={2.5} />,
    accentClass: "hover:border-[var(--color-leaf-green)]",
    iconBgClass: "bg-[var(--color-leaf-green)]",
  },
  {
    id: "quick-create-form",
    title: "New Form",
    description: "Collect structured data",
    href: "/create/form",
    icon: <FileText size={20} strokeWidth={2.5} />,
    accentClass: "hover:border-[var(--color-electric-sun)]",
    iconBgClass: "bg-[var(--color-electric-sun)]",
  },
  {
    id: "quick-create-petition",
    title: "New Petition",
    description: "Rally your community",
    href: "/create/petition",
    icon: <Megaphone size={20} strokeWidth={2.5} />,
    accentClass: "hover:border-[var(--color-sky-blue)]",
    iconBgClass: "bg-[var(--color-sky-blue)]",
  },
  {
    id: "quick-create-quiz",
    title: "New Quiz",
    description: "Test knowledge & engage",
    href: "/create/quiz",
    icon: <Lightbulb size={20} strokeWidth={2.5} />,
    accentClass: "hover:border-[var(--color-lavender)]",
    iconBgClass: "bg-[var(--color-lavender)]",
  },
];

export function DashboardQuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="quick-actions-heading"
          className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)]"
        >
          Quick Create
        </h2>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-label-md font-bold text-[var(--color-primary)] hover:underline"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            id={action.id}
            href={action.href}
            className={`group flex flex-col gap-3 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-xl p-4 shadow-hard btn-press transition-all ${action.accentClass}`}
          >
            <div
              className={`w-10 h-10 rounded-lg border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center ${action.iconBgClass} shadow-hard-sm group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all`}
            >
              <span className="text-[var(--color-ink-charcoal)]">{action.icon}</span>
            </div>
            <div>
              <p className="text-label-md font-bold text-[var(--color-ink-charcoal)]">
                {action.title}
              </p>
              <p className="text-label-sm text-[var(--color-on-surface-variant)] mt-0.5">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
