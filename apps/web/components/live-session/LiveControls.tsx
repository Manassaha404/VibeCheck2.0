import React from 'react';
import { BarChart, Link as LinkIcon } from 'lucide-react';

interface LiveControlsProps {
  joinCode: string;
  /** The session UUID — used to build the participant join URL (/q/{sessionId}) */
  sessionId: string;
  onGoToLeaderboard: () => void;
}

export default function LiveControls({ joinCode, sessionId, onGoToLeaderboard }: LiveControlsProps) {
  const participantUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/q/${sessionId}`
      : `/q/${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(participantUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* Left: Go to Leaderboard */}
      <div className="flex flex-col border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl p-4 bg-[var(--color-surface-container)] h-full min-h-[160px]">
        <button
          onClick={onGoToLeaderboard}
          className="flex-grow bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-3 font-body text-headline-sm uppercase font-bold flex flex-col items-center justify-center gap-4 hover:bg-[var(--color-surface-variant)] transition-colors btn-press"
        >
          <BarChart size={48} strokeWidth={2.5} />
          Go to Leaderboard
        </button>
      </div>

      {/* Right: Spread the Vibe */}
      <div className="flex flex-col border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl p-4 bg-[var(--color-surface-container)] h-full min-h-[160px]">
        <h3 className="font-display text-headline-sm font-bold uppercase text-[var(--color-ink-charcoal)] mb-4 text-center">
          Spread the Vibe
        </h3>
        <div className="flex flex-col items-center gap-4 bg-[var(--color-pure-white)] p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard flex-grow justify-between">
          {/* Live QR code pointing to the participant page */}
          <a
            href={participantUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-28 h-28 border-4 border-[var(--color-ink-charcoal)] bg-white flex-shrink-0 shadow-hard rotate-1 hover:rotate-0 transition-transform"
            title="Open participant page"
          >
            <img
              alt="Participant join QR Code"
              className="w-full h-full p-1"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(participantUrl)}&margin=4`}
            />
          </a>
          <div className="flex w-full border-4 border-[var(--color-ink-charcoal)] mt-auto">
            <a
              href={participantUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow border-none font-body text-body-md px-2 py-2 bg-[var(--color-surface-container)] text-[var(--color-ink-charcoal)] w-full min-w-0 truncate hover:underline"
              title={participantUrl}
            >
              {participantUrl}
            </a>
            <button
              onClick={handleCopy}
              className="bg-[var(--color-leaf-green)] px-4 py-2 font-body font-bold text-label-md border-l-4 border-[var(--color-ink-charcoal)] hover:bg-[var(--color-primary)] hover:text-[var(--color-pure-white)] transition-colors uppercase flex items-center gap-2 flex-shrink-0"
            >
              <LinkIcon size={16} />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
