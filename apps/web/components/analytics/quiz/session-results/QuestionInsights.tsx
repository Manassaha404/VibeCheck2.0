import React from 'react';

type Insight = {
  id: string;
  title: string;
  status: 'High Pass' | 'Pass' | 'Fail' | 'Warning';
  percentage: number;
  isTextAnswer?: boolean;
};

export function QuestionInsights({ insights }: { insights: Insight[] }) {
  const getColors = (status: Insight['status']) => {
    switch (status) {
      case 'High Pass':
      case 'Pass':
        return { bg: 'hover:bg-[var(--color-leaf-green)]', badgeBg: 'bg-[var(--color-leaf-green)]', badgeText: 'text-ink-charcoal' };
      case 'Fail':
        return { bg: 'hover:bg-[var(--color-vivid-coral)]', badgeBg: 'bg-[var(--color-vivid-coral)]', badgeText: 'text-[var(--color-pure-white)]' };
      case 'Warning':
        return { bg: 'hover:bg-[var(--color-electric-sun)]', badgeBg: 'bg-[var(--color-electric-sun)]', badgeText: 'text-ink-charcoal' };
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h3 className="font-headline-md text-headline-md border-b-4 border-ink-charcoal pb-2 inline-block self-start">Question Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, idx) => {
          const colors = getColors(insight.status);
          return (
            <div key={insight.id} className={`bg-[var(--color-pure-white)] border-2 border-ink-charcoal shadow-hard card-lift rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group transition-colors ${colors.bg}`}>
              <div className="flex justify-between items-start">
                <span className="font-display-lg text-headline-md">Q{idx + 1}</span>
                {insight.isTextAnswer ? (
                  <span className="font-label-md text-label-md px-2 py-1 rounded border-2 border-ink-charcoal shadow-hard-sm bg-[var(--color-sky-blue)] text-ink-charcoal">
                    OPEN ENDED
                  </span>
                ) : (
                  <span className={`font-label-md text-label-md px-2 py-1 rounded border-2 border-ink-charcoal shadow-hard-sm ${colors.badgeBg} ${colors.badgeText}`}>
                    {insight.percentage}% {insight.status.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md font-bold line-clamp-2">{insight.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
