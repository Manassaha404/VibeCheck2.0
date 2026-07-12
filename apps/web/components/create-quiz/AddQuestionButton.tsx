"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";

export default function AddQuestionButton() {
  const addQuestion = useQuizStore((s) => s.addQuestion);

  return (
    <div className="mt-8 flex justify-center relative">
      <button
        onClick={() => addQuestion("multiple_choice")}
        className="w-full md:w-2/3 bg-pure-white border-4 border-ink-charcoal border-dashed py-8 font-headline-md text-headline-md font-black hover:bg-electric-sun hover:border-solid hover:shadow-hard transition-all group flex items-center justify-center gap-4"
      >
        <span className="bg-ink-charcoal text-pure-white rounded-full p-1 group-hover:rotate-90 transition-transform duration-300 inline-flex items-center justify-center">
          <Plus size={32} strokeWidth={4} />
        </span>
        ADD QUESTION
      </button>
    </div>
  );
}
