import React from "react";

type LeaderboardEntry = {
  rank: number;
  name: string;
  username: string;
  score: number;
  avatar: string;
};

export function SessionLeaderboard({
  leaderboard,
}: {
  leaderboard: LeaderboardEntry[];
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-end border-b-4 border-ink-charcoal pb-2">
        <h3 className="font-headline-md text-headline-md">Final Leaderboard</h3>
      </div>

      <div className="bg-[var(--color-pure-white)] border-2 border-ink-charcoal shadow-hard-lg rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-canvas-cream)] border-b-2 border-ink-charcoal font-headline-sm text-headline-sm">
              <th className="p-4 border-r-2 border-ink-charcoal w-24 text-center">
                Rank
              </th>
              <th className="p-4 border-r-2 border-ink-charcoal">
                Participant
              </th>
              <th className="p-4 border-r-2 border-ink-charcoal">Username</th>
              <th className="p-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="font-body-lg text-body-lg">
            {leaderboard.map((entry, idx) => {
              const bgClass =
                entry.rank === 1
                  ? "bg-[var(--color-electric-sun)]"
                  : entry.rank === 2
                    ? "bg-[var(--color-canvas-cream)]"
                    : entry.rank === 3
                      ? "bg-[var(--color-surface-container)]"
                      : "bg-[var(--color-pure-white)]";

              const fontClass = entry.rank <= 3 ? "font-black" : "font-bold";
              const borderClass = entry.rank <= 3 ? "border-b-4" : "border-b";
              const textClass =
                entry.rank <= 3
                  ? "text-headline-md"
                  : "text-[var(--color-on-surface-variant)]";

              return (
                <tr
                  key={entry.username}
                  className={`${bgClass} ${idx !== leaderboard.length - 1 ? borderClass : ""} border-ink-charcoal`}
                >
                  <td
                    className={`p-6 border-r-4 border-ink-charcoal text-center ${fontClass} ${textClass}`}
                  >
                    #{entry.rank}
                  </td>
                  <td className="p-6 border-r-4 border-ink-charcoal flex items-center gap-6">
                    <img
                      className={`w-16 h-16 rounded-full border-4 border-ink-charcoal bg-[var(--color-pure-white)] ${entry.rank <= 3 ? "shadow-hard" : ""}`}
                      src={entry.avatar}
                      alt={entry.name}
                    />
                    <span
                      className={
                        entry.rank <= 3 ? "font-headline-sm" : "font-bold"
                      }
                    >
                      {entry.name}
                    </span>
                  </td>
                  <td
                    className={`p-6 border-r-4 border-ink-charcoal font-bold ${entry.rank > 3 ? "text-[var(--color-on-surface-variant)]" : ""}`}
                  >
                    {entry.username}
                  </td>
                  <td className={`p-6 text-right font-black ${textClass}`}>
                    {entry.score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
