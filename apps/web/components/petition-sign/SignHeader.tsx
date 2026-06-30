import React from 'react';

export default function SignHeader({ title, description }: { title: string, description: string | null }) {
  return (
    <div className="text-center mb-16 relative">
      <h1 className="font-display-lg text-display-lg text-ink-charcoal uppercase tracking-tighter mb-4 transform -rotate-2">
        {title}
      </h1>

      {description && (
        <div className="max-w-3xl mx-auto bg-pure-white border-4 border-ink-charcoal p-8 transform rotate-1 shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] relative z-20">
          <p className="font-body-lg text-body-lg text-left text-ink-charcoal leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
