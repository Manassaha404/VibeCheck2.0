import React from "react";
import { LineChart } from "lucide-react";

export function PreviousSessions({ sessions }: { sessions: any[] }) {
  return (
    <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b-2 border-[var(--color-ink-charcoal)] pb-4">
        <h3 className="text-headline-sm font-display text-[var(--color-ink-charcoal)]">Previous Sessions</h3>
        <button className="text-label-sm font-body font-bold text-[var(--color-primary)] hover:underline">View All</button>
      </div>
      <div className="flex flex-col gap-4">
        {sessions.length === 0 ? (
          <div className="p-4 text-center opacity-70">No previous sessions found.</div>
        ) : (
          sessions.map((session) => (
            <div key={session.sessionId} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] gap-4">
              <div className="flex flex-col">
                <span className="font-bold text-body-lg font-body">{session.name}</span>
                <span className="text-label-sm font-body opacity-70">{new Date(session.date).toLocaleDateString()} • {session.participantsCount} Participants</span>
              </div>
              <button className="bg-[var(--color-electric-sun)] text-label-md font-body font-bold text-[var(--color-ink-charcoal)] px-4 py-2 border-2 border-[var(--color-ink-charcoal)] btn-press transition-all flex items-center gap-2 shadow-hard">
                <LineChart className="w-4 h-4" /> Analytics
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
