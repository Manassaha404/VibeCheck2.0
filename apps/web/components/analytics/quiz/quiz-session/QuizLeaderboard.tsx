import React from "react";
import { Trophy } from "lucide-react";

export function QuizLeaderboard({ leaderboard }: { leaderboard: any[] }) {
  return (
    <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-6">
      <h3 className="text-headline-sm font-display text-[var(--color-ink-charcoal)] border-b-2 border-[var(--color-ink-charcoal)] pb-4 mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-[var(--color-electric-sun)] fill-current" />{" "}
        Top 10 Leaderboard
      </h3>
      <ul className="flex flex-col gap-3 text-body-md font-body">
        {leaderboard.length === 0 ? (
          <li className="p-4 text-center opacity-70">No participants yet.</li>
        ) : (
          leaderboard.map((user, index) => {
            const rank = index + 1;
            let bgColor = "";
            if (rank === 1)
              bgColor = "bg-[var(--color-electric-sun)] bg-opacity-20";
            else if (rank === 2)
              bgColor = "bg-[var(--color-leaf-green)] bg-opacity-20";
            else if (rank === 3) bgColor = "bg-[var(--color-canvas-cream)]";
            else bgColor = "border-b-2 border-dashed border-opacity-20";

            return (
              <li
                key={user.id}
                className={`flex items-center justify-between p-3 border-[var(--color-ink-charcoal)] ${rank <= 3 ? "border-2 rounded-lg" : ""} ${bgColor}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-headline-sm font-display font-bold w-8 text-center text-[var(--color-ink-charcoal)] ${rank > 3 ? "opacity-50 text-label-md" : ""}`}
                  >
                    {rank}
                  </span>
                  <span className={rank <= 3 ? "font-bold" : ""}>
                    {user.name}
                  </span>
                </div>
                <span
                  className={
                    rank <= 3
                      ? "bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-2 py-1 text-label-sm font-body font-bold"
                      : "text-label-sm font-body font-bold opacity-70"
                  }
                >
                  {user.score} pts
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
