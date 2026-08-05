import React from "react";

export function PollSetupHeader() {
  return (
    <div className="mb-8 sm:mb-12 relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6">
      <div>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-6xl text-ink-charcoal uppercase italic font-black tracking-tighter bg-leaf-green border-4 border-ink-charcoal px-4 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] sm:shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] inline-block mb-3 sm:mb-4">
          Build Your Poll
        </h1>
        <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl bg-pure-white border-2 border-ink-charcoal rounded-DEFAULT p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] inline-block mx-auto">
          Start gathering vibes from your community. Keep it sharp.
        </p>
      </div>
    </div>
  );
}
