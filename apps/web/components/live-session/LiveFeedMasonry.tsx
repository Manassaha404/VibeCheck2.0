import React, { useMemo } from "react";
import { Rss } from "lucide-react";

export interface FeedMessage {
  id: string;
  authorInitial: string;
  authorName: string;
  text: string;
  colorClass: string; // for the avatar background
  isRightAligned?: boolean; // alternate sides
  isBoom?: boolean; // special 'BOOM!' comic burst
}

interface LiveFeedWordCloudProps {
  messages: FeedMessage[];
}

export default function LiveFeedWordCloud({
  messages,
}: LiveFeedWordCloudProps) {
  const groupedTexts = useMemo(() => {
    const counts = messages.reduce(
      (acc, msg) => {
        const normalized = msg.text.trim().toLowerCase();
        if (!normalized || msg.isBoom) return acc;

        if (!acc[normalized]) {
          acc[normalized] = {
            text: msg.text.trim(),
            count: 0,
          };
        }
        acc[normalized].count += 1;
        return acc;
      },
      {} as Record<string, { text: string; count: number }>,
    );

    const arr = Object.values(counts).sort((a, b) => b.count - a.count);
    return arr;
  }, [messages]);

  const maxCount =
    groupedTexts.length > 0
      ? Math.max(...groupedTexts.map((item) => item.count))
      : 1;

  // Generate random colors for the tags from our palette
  const getColor = (index: number) => {
    const colors = [
      "text-[var(--color-ink-charcoal)]",
      "text-[var(--color-primary)]",
      "text-[var(--color-leaf-green)]",
      "text-[var(--color-sky-blue)]",
      "text-[var(--color-vivid-coral)]",
      "text-[var(--color-electric-sun)]",
    ];
    // Hash string to pick color for consistency
    return colors[index % colors.length];
  };

  return (
    <section className="mt-12 flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center bg-[var(--color-canvas-cream)] border-4 border-[var(--color-ink-charcoal)] px-6 py-3 shadow-hard inline-block w-max mx-auto">
        <h3 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] uppercase flex items-center gap-2">
          <Rss
            className="text-[var(--color-leaf-green)] animate-pulse"
            size={32}
            strokeWidth={3}
          />
          LIVE ANSWERS
        </h3>
      </div>

      <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-10 min-h-[300px] flex flex-wrap items-center justify-center gap-6">
        {groupedTexts.length === 0 ? (
          <p className="font-body text-body-lg text-[var(--color-on-surface-variant)] text-center w-full">
            Waiting for participants to answer...
          </p>
        ) : (
          groupedTexts.map((item, index) => {
            const ratio = item.count / maxCount;
            // Scale font size between 1rem and 4rem depending on frequency
            const size = 1 + ratio * 3;

            return (
              <span
                key={index}
                className={`font-display font-black uppercase transition-all duration-300 hover:scale-110 cursor-default ${getColor(index)}`}
                style={{
                  fontSize: `${size}rem`,
                  lineHeight: 1.1,
                  WebkitTextStroke:
                    size > 2
                      ? "2px var(--color-ink-charcoal)"
                      : "1px var(--color-ink-charcoal)",
                  opacity: ratio < 0.3 ? 0.7 : 1,
                }}
                title={`${item.count} participants answered this`}
              >
                {item.text}
                {item.count > 1 && (
                  <sup
                    className="text-label-sm ml-1 text-[var(--color-ink-charcoal)]"
                    style={{ WebkitTextStroke: "0" }}
                  >
                    x{item.count}
                  </sup>
                )}
              </span>
            );
          })
        )}
      </div>
    </section>
  );
}
