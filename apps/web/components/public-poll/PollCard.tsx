"use client";

import React, { useState } from "react";
import { PollOption } from "./PollOption";

interface Option {
  pollOptionId: string;
  text: string;
}

interface PollCardProps {
  title?: string | null;
  description?: string | null;
  question: string;
  options: Option[];
  isCommentsAllowed: boolean;
  isMultipleOptionVoteAllowed?: boolean; // Not handled here yet, assume single vote
  isSubmitting?: boolean;
  onSubmit: (data: { optionId: string; comment: string }) => void;
}

export const PollCard = ({
  title,
  description,
  question,
  options,
  isCommentsAllowed,
  isSubmitting,
  onSubmit,
}: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    onSubmit({ optionId: selectedOption, comment });
  };

  return (
    <div className="bg-pure-white wiggly-border hard-shadow p-8 md:p-12 relative overflow-hidden">
      {/* Internal Halftone */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #2C2E2A 2px, transparent 2px)",
          backgroundSize: "20px 20px"
        }}
      />
      <div className="relative z-30">
        
        {/* Title & Description */}
        <div className="text-center mb-12 max-w-2xl mx-auto flex flex-col gap-4">
          {title && (
            <h2 className="font-headline-md text-headline-md uppercase text-ink-charcoal border-b-4 border-electric-sun pb-2 inline-block mx-auto">
              {title}
            </h2>
          )}
          {description && (
            <p className="font-body-lg text-ink-charcoal bg-canvas-cream border-2 border-ink-charcoal rounded-xl p-6 hard-shadow-sm">
              {description}
            </p>
          )}
        </div>

        {/* Big Question */}
        <h1 
          className="font-display-lg text-[40px] md:text-[64px] mb-8 uppercase text-pure-white leading-tight text-center font-black tracking-normal relative z-40" 
          style={{ WebkitTextStroke: "2px #2C2E2A", textShadow: "4px 4px 0px #2C2E2A" }}
        >
          <span className="inline-block transform -rotate-2 bg-electric-sun px-8 py-6 border-4 border-ink-charcoal hard-shadow text-ink-charcoal" style={{ WebkitTextStroke: "0", textShadow: "none" }}>
            {question}
          </span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-12 relative z-30">
          <div className="space-y-6">
            {options.map((opt, idx) => (
              <PollOption
                key={opt.pollOptionId}
                id={`opt-${opt.pollOptionId}`}
                name="poll_option"
                text={opt.text}
                value={opt.pollOptionId}
                checked={selectedOption === opt.pollOptionId}
                onChange={(val) => setSelectedOption(val)}
                index={idx}
              />
            ))}
          </div>

          {isCommentsAllowed && (
            <div className="mt-12 relative max-w-2xl mx-auto group">
              {/* Decorative Tape */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-candy-pink/80 border-2 border-ink-charcoal rotate-[-2deg] z-20 backdrop-blur-sm" />
              
              <div className="bg-electric-sun border-4 border-ink-charcoal p-6 md:p-8 hard-shadow-sm relative z-10 transition-transform focus-within:-translate-y-2 focus-within:shadow-hard"
                   style={{ borderRadius: "2px 24px 4px 20px" }}>
                <label className="flex items-center gap-3 font-headline-sm text-2xl uppercase mb-4 text-ink-charcoal font-black" htmlFor="poll-comments">
                  <span className="bg-pure-white border-2 border-ink-charcoal rounded-full w-8 h-8 flex items-center justify-center rotate-12 group-focus-within:rotate-45 transition-transform">
                    ✍️
                  </span>
                  Got thoughts? Drop 'em!
                </label>
                <textarea 
                  id="poll-comments" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-pure-white/90 border-4 border-ink-charcoal p-4 font-body-lg text-ink-charcoal focus:ring-0 focus:outline-none placeholder:italic placeholder:text-ink-charcoal/40 resize-y" 
                  placeholder="Spill the tea here... (optional)" 
                  rows={3}
                  style={{ 
                    borderRadius: "8px 2px 12px 4px",
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #2C2E2A20 31px, #2C2E2A20 32px)",
                    lineHeight: "32px",
                    paddingTop: "6px"
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="mt-12 pt-8 border-t-4 border-ink-charcoal border-dashed text-center flex justify-center">
            <button 
              type="submit" 
              disabled={!selectedOption || isSubmitting}
              className="w-full md:w-auto bg-leaf-green border-4 border-ink-charcoal font-headline-md text-headline-md uppercase px-12 py-4 hard-shadow hover:bg-electric-sun transition-colors btn-hover-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Voting..." : "Smash To Vote!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
