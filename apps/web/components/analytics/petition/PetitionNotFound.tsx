import React from 'react';
import { Ghost, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PetitionNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-body bg-dot-pattern relative overflow-x-hidden items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" 
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-ink-charcoal) 2px, transparent 2.5px)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }}
      />
      
      <div className="relative z-10 bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] max-w-lg w-full text-center flex flex-col items-center transform -rotate-1">
        <div className="bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] p-4 rounded-full mb-6 animate-bounce shadow-hard">
          <Ghost size={48} className="text-[var(--color-ink-charcoal)]" />
        </div>
        
        <h1 className="font-display-lg text-display-lg md:text-5xl font-black uppercase text-[var(--color-ink-charcoal)] mb-4">
          Petition Missing!
        </h1>
        
        <p className="font-body text-body-lg text-[var(--color-ink-charcoal)] mb-8 font-bold">
          Looks like this petition doesn't exist, was deleted, or the vibe just faded away.
        </p>

        <button 
          onClick={() => router.push('/dashboard')}
          className="font-headline-sm text-headline-sm font-black uppercase px-6 py-3 border-4 border-[var(--color-ink-charcoal)] bg-[#FF007F] text-[var(--color-pure-white)] shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] transition-all flex items-center gap-2 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
