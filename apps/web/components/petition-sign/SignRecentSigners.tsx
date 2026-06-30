import React from 'react';
import { Megaphone } from 'lucide-react';

const bgColors = ['bg-electric-sun', 'bg-leaf-green', 'bg-[#FF007F]', 'bg-mint', 'bg-sky-blue'];

export default function SignRecentSigners({ signers }: { signers: { firstName: string, lastName: string, createdAt: Date | string, city: string | null }[] }) {
  const formattedSigners = signers.map((s, i) => {
     const initials = `${s.firstName[0] || ''}${s.lastName[0] || ''}`.toUpperCase();
     const name = `${s.firstName} ${s.lastName}`;
     const bg = bgColors[i % bgColors.length];
     const time = new Date(s.createdAt).toLocaleDateString();
     return { initials, name, time, bg };
  });

  return (
    <div className="bg-pure-white border-4 border-ink-charcoal flex-grow p-6 flex flex-col relative overflow-hidden">
      <Megaphone size={200} className="absolute -right-10 -bottom-10 text-canvas-cream opacity-50 pointer-events-none" />
      <h3 className="font-headline-sm text-headline-sm uppercase mb-6 border-b-2 border-ink-charcoal pb-2 relative z-10">
        Recent Signers
      </h3>
      <ul className="space-y-4 relative z-10">
        {formattedSigners.length === 0 && <p className="opacity-70 italic font-body">Be the first to sign!</p>}
        {formattedSigners.map((signer, index) => (
          <li key={index} className="flex items-center gap-4 bg-canvas-cream p-3 border-2 border-ink-charcoal hover:bg-leaf-green transition-colors cursor-default">
            <div className={`w-10 h-10 ${signer.bg} rounded-full border-2 border-ink-charcoal flex items-center justify-center font-bold text-ink-charcoal shrink-0`}>
              {signer.initials}
            </div>
            <div>
              <p className="font-label-md text-label-md text-ink-charcoal">{signer.name}</p>
              <p className="font-label-sm text-label-sm text-ink-charcoal opacity-70">{signer.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
