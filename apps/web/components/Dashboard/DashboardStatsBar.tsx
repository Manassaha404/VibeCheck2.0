"use client";

import React from "react";
import { BarChart2, FileText, Megaphone, TrendingUp } from "lucide-react";

interface DashboardStatsBarProps {
  totalPolls: number;
  totalForms: number;
  totalPetitions: number;
  totalResponses: number;
  isLoading?: boolean;
}

export function DashboardStatsBar({
  totalPolls,
  totalForms,
  totalPetitions,
  totalResponses,
  isLoading = false,
}: DashboardStatsBarProps) {
  const stats = [
    {
      label: "Total Polls",
      value: totalPolls,
      icon: <BarChart2 size={22} strokeWidth={2.5} />,
      accentClass: "bg-[var(--color-leaf-green)]",
      id: "stat-total-polls",
    },
    {
      label: "Active Forms",
      value: totalForms,
      icon: <FileText size={22} strokeWidth={2.5} />,
      accentClass: "bg-[var(--color-electric-sun)]",
      id: "stat-active-forms",
    },
    {
      label: "Petitions",
      value: totalPetitions,
      icon: <Megaphone size={22} strokeWidth={2.5} />,
      accentClass: "bg-[var(--color-sky-blue)]",
      id: "stat-petitions",
    },
    {
      label: "Total Responses",
      value: totalResponses,
      icon: <TrendingUp size={22} strokeWidth={2.5} />,
      accentClass: "bg-[var(--color-lavender)]",
      id: "stat-total-responses",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          id={stat.id}
          className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-xl p-5 shadow-hard card-lift flex flex-col gap-3"
        >
          {/* Icon badge */}
          <div
            className={`w-10 h-10 rounded-lg border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center shrink-0 ${stat.accentClass}`}
          >
            <span className="text-[var(--color-ink-charcoal)]">{stat.icon}</span>
          </div>

          {/* Value */}
          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-[var(--color-surface-container-high)] rounded animate-pulse" />
            ) : (
              <p className="text-headline-md font-display font-bold text-[var(--color-ink-charcoal)] leading-none">
                {stat.value.toLocaleString()}
              </p>
            )}
            <p className="text-label-md text-[var(--color-on-surface-variant)] mt-0.5">
              {stat.label}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
