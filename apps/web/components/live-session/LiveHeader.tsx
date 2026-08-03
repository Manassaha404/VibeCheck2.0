import React from "react";

interface LiveHeaderProps {
  title: React.ReactNode;
  sessionId: string;
  description?: string;
  status?: "waiting" | "active" | "ended";
}

export default function LiveHeader({
  title,
  sessionId,
  description,
  status = "active",
}: LiveHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-block bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] px-5 py-1.5 -rotate-2 shadow-hard">
        <span className="font-label text-label-sm uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2 font-bold">
          <span
            className={[
              "w-3 h-3 rounded-full animate-pulse",
              status === "waiting"
                ? "bg-[var(--color-electric-sun)]"
                : "bg-[var(--color-error)]",
            ].join(" ")}
          />
          {status === "waiting"
            ? "Waiting for players…"
            : "Live Session Active"}
        </span>
      </div>

      <h1 className="font-display text-display-lg text-[var(--color-ink-charcoal)] leading-none uppercase max-w-4xl mx-auto text-center">
        {title}
      </h1>

      {description && (
        <p className="font-body text-body-lg text-[var(--color-on-surface-variant)] max-w-2xl text-center">
          {description}
        </p>
      )}

      <div className="flex items-center gap-3 mt-2">
        <div className="inline-flex flex-col items-center gap-1 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-8 py-4 rotate-1">
          <span className="font-body text-label-sm uppercase tracking-[0.25em] text-[var(--color-ink-charcoal)] font-bold opacity-70">
            Join Code
          </span>
          <span className="font-display font-black text-[clamp(2.5rem,6vw,4rem)] text-[var(--color-ink-charcoal)] tracking-[0.15em] leading-none">
            {sessionId}
          </span>
        </div>
      </div>
    </div>
  );
}
