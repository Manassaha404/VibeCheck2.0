import React from 'react';
import { Rss, Zap, Heart, Megaphone, ThumbsUp } from 'lucide-react';

export default function LiveVibeFeed({ signatures }: { signatures: { firstName: string, lastName: string, createdAt: Date | string, city: string | null }[] }) {
  const getBadgeAndIcon = (index: number) => {
    const badges = [
      { badge: "Super Hyped", bg: "bg-[var(--color-electric-sun)]", icon: <Zap size={16} /> },
      { badge: "Solidarity", bg: "bg-[var(--color-leaf-green)]", icon: <Heart size={16} /> },
      { badge: "Loud Supporter", bg: "bg-[var(--color-electric-sun)]", icon: <Megaphone size={16} /> },
      { badge: "Cool", bg: "bg-[var(--color-pure-white)]", icon: <ThumbsUp size={16} /> },
    ];
    return badges[index % badges.length];
  };

  const getTimeAgo = (date: Date | string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const feedItems = signatures.map((sig, idx) => {
    const style = getBadgeAndIcon(idx);
    return {
      id: idx,
      name: `${sig.firstName} ${sig.lastName.charAt(0)}.`,
      time: getTimeAgo(sig.createdAt),
      text: sig.city ? `Signed from ${sig.city}` : "",
      ...style
    };
  });

  return (
    <section className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-6 shadow-hard h-full min-h-[500px] flex flex-col overflow-hidden">
      <style>
        {`
          @keyframes scroll-vertical {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .animate-scroll-vertical {
            animation: scroll-vertical 15s linear infinite;
          }
          .animate-scroll-vertical:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-6 border-b-2 border-[var(--color-ink-charcoal)] pb-4 shrink-0 relative z-10 bg-[var(--color-pure-white)]">
        <h3 className="font-display text-headline-sm uppercase">Live Vibe Feed</h3>
        <Rss className="text-[var(--color-leaf-green)] animate-[pulse-border_2s_infinite] rounded-full" size={24} />
      </div>
      <div className="flex-grow overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 w-full animate-scroll-vertical space-y-4 pb-4">
          {/* Double the items for seamless scrolling, if any exist */}
          {feedItems.length > 0 ? [...feedItems, ...feedItems].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="border-2 border-[var(--color-ink-charcoal)] p-3 bg-[var(--color-canvas-cream)] flex items-start gap-3 hover:scale-[1.02] transition-transform cursor-pointer shadow-hard-sm">
              <div className={`${item.bg} border-2 border-[var(--color-ink-charcoal)] p-2 rounded-full mt-1 shrink-0`}>
                {item.icon}
              </div>
              <div>
                <p className="font-body text-label-md font-bold">{item.name} <span className="text-xs font-normal text-[var(--color-outline)] ml-2">{item.time}</span></p>
                {item.text && <p className="font-body text-body-md text-sm mt-1 text-[var(--color-ink-charcoal)]">{item.text}</p>}
                <span className="inline-block bg-[var(--color-pure-white)] border border-[var(--color-ink-charcoal)] px-2 py-0.5 mt-2 text-[10px] font-bold uppercase">{item.badge}</span>
              </div>
            </div>
          )) : (
            <p className="font-body text-label-md text-[var(--color-outline)] text-center py-8">No signatures yet. Be the first!</p>
          )}
        </div>
      </div>
    </section>
  );
}
