"use client";

import React, { useState } from "react";
import { Clock, LayoutGrid, Play, Edit3 } from "lucide-react";
import Link from "next/link";
import { StartSessionModal } from "./StartSessionModal";

export function QuizHeroCard({ title, durationMins, quizIdStr }: { title: string; durationMins: number; quizIdStr: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[var(--color-pure-white)] rounded-full border-4 border-[var(--color-ink-charcoal)] opacity-20 pointer-events-none"></div>
        <div className="flex-1 z-10 w-full">
          <div className="inline-block bg-[var(--color-pure-white)] text-label-sm font-body font-bold px-3 py-1 border-2 border-[var(--color-ink-charcoal)] mb-4 transform -rotate-2">CURRENT QUIZ</div>
          <h2 className="text-headline-md font-display text-[var(--color-ink-charcoal)] mb-4">{title}</h2>
          <div className="flex flex-wrap gap-4 text-label-md font-body mb-8">
            <span className="flex items-center gap-2 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {durationMins} mins</span>
            <span className="flex items-center gap-2 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-3 py-1 rounded-full"><LayoutGrid className="w-4 h-4" /> Multiple Choice</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--color-leaf-green)] text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] px-8 py-4 border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-current" /> START LIVE SESSION
            </button>
            <Link href={`/create/quiz/edit/${quizIdStr}`} className="bg-[var(--color-pure-white)] text-label-md font-body font-bold text-[var(--color-ink-charcoal)] px-6 py-4 border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <Edit3 className="w-5 h-5" /> EDIT QUIZ
            </Link>
          </div>
        </div>
      </div>

      <StartSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        quizIdStr={quizIdStr} 
      />
    </>
  );
}
