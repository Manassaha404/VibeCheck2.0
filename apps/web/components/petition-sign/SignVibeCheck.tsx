import React from 'react';
import { Flame } from 'lucide-react';

export default function SignVibeCheck({ totalSignatures, signaturesTarget }: { totalSignatures: number, signaturesTarget: number }) {
  const progress = signaturesTarget > 0 ? Math.min(100, Math.round((totalSignatures / signaturesTarget) * 100)) : 100;
  
  return (
    <div className="bg-electric-sun border-4 border-ink-charcoal p-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transform rotate-1">
      <h3 className="font-headline-md text-headline-md uppercase mb-2 flex items-center gap-2">
        <Flame size={32} />
        Vibe Check
      </h3>
      <p className="font-label-md text-label-md mb-4">
        {totalSignatures.toLocaleString()} signatures and counting!
      </p>
      
      <div className="w-full h-6 bg-canvas-cream border-2 border-ink-charcoal rounded-full overflow-hidden relative">
        <div className="h-full bg-leaf-green border-r-2 border-ink-charcoal flex items-center justify-end pr-2" style={{ width: `${progress}%` }}>
          {progress > 10 && <span className="font-body text-[10px] font-bold text-ink-charcoal">{progress}%</span>}
        </div>
      </div>
      <p className="font-label-sm text-label-sm mt-2 opacity-80 text-right">Target: {signaturesTarget.toLocaleString()}</p>
    </div>
  );
}
