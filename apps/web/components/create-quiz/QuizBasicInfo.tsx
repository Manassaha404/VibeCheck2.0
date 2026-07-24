"use client";

import React from "react";
import { useQuizStore } from "@/store/quizStore";
import { Zap } from "lucide-react";

export default function QuizBasicInfo() {
  const info = useQuizStore((s) => s.info);
  const setInfo = useQuizStore((s) => s.setInfo);
  const globalSettings = useQuizStore((s) => s.globalSettings);
  const setGlobalSettings = useQuizStore((s) => s.setGlobalSettings);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Quiz Title Input */}
      <div className="flex flex-col gap-4">
        <label
          className="self-start font-headline-sm text-headline-sm uppercase font-black tracking-tight bg-leaf-green px-2 py-0.5 border-2 border-ink-charcoal shadow-hard-sm -rotate-1 mb-1"
          htmlFor="quiz-title-input"
        >
          Quiz Title
        </label>
        <div className="bg-electric-sun border-4 border-ink-charcoal p-2 shadow-hard -rotate-1">
          <input
            className="w-full bg-transparent border-none font-headline-lg text-headline-lg uppercase font-black italic tracking-tighter text-ink-charcoal placeholder:text-ink-charcoal/40 focus:outline-none"
            id="quiz-title-input"
            placeholder="e.g., Physics 101 Midterm"
            type="text"
            value={info.title}
            onChange={(e) => setInfo({ title: e.target.value })}
          />
        </div>
      </div>

      {/* Quiz Description Input */}
      <div className="flex flex-col gap-4">
        <label
          className="self-start font-headline-sm text-headline-sm uppercase font-black tracking-tight bg-leaf-green px-2 py-0.5 border-2 border-ink-charcoal shadow-hard-sm rotate-1 mb-1"
          htmlFor="quiz-description-input"
        >
          Description
        </label>
        <div className="bg-pure-white border-4 border-ink-charcoal p-4 shadow-hard">
          <textarea
            className="w-full bg-transparent border-none font-body-lg text-body-lg text-on-surface-variant placeholder:text-outline focus:outline-none resize-none"
            id="quiz-description-input"
            placeholder="Tell them what this quiz is about..."
            rows={3}
            value={info.description}
            onChange={(e) => setInfo({ description: e.target.value })}
          />
        </div>
      </div>

    </div>
  );
}
