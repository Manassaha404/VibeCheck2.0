"use client";

import React from 'react';
import { useCreateQuiz } from '@/hook/quiz/useCreateQuiz';
import { Loader2 } from 'lucide-react';

export default function PublishButton() {
  const { submitQuiz, isSubmitting } = useCreateQuiz();

  return (
    <div className="mt-16 mb-8 flex justify-center">
      <button 
        onClick={submitQuiz}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 bg-leaf-green text-ink-charcoal border-4 border-ink-charcoal py-6 px-12 font-display-lg text-display-lg uppercase font-black tracking-tight shadow-[8px_8px_0px_0px_#2C2E2A] hover:shadow-[4px_4px_0px_0px_#2C2E2A] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 relative overflow-hidden group"
      >
        {/* Hover Effect Background Sweep */}
        <div className="absolute inset-0 bg-ink-charcoal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
        <span className="relative z-10 group-hover:text-leaf-green transition-colors duration-300 flex items-center gap-3">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={32} />
              <span>Creating Quiz...</span>
            </>
          ) : (
            "Create Quiz"
          )}
        </span>
      </button>
    </div>
  );
}
