"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizHero from '@/components/create-quiz/QuizHero';
import QuizBasicInfo from '@/components/create-quiz/QuizBasicInfo';
import QuizSettings from '@/components/create-quiz/QuizSettings';
import QuestionCard from '@/components/create-quiz/QuestionCard';
import AddQuestionButton from '@/components/create-quiz/AddQuestionButton';
import PublishButton from '@/components/create-quiz/CreateButton';
import { useQuizStore } from '@/store/quizStore';

export default function CreateQuizPage() {
  const questions = useQuizStore((s) => s.questions);

  return (
    <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col bg-dot-pattern selection:bg-electric-sun selection:text-ink-charcoal">
      <Navbar />
      
      <main className="flex-grow relative overflow-hidden py-16 px-4 md:px-10 flex justify-center w-full">
        <div className="w-full max-w-[1280px] mx-auto flex justify-center">
          {/* Main Form Column matching max-w-4xl from design */}
          <div className="w-full max-w-4xl flex flex-col gap-12 z-10">
            <QuizHero />
            
            <div className="flex flex-col items-center text-center gap-4 w-full">
              <QuizBasicInfo />
            </div>
            
            <QuizSettings />

            {/* Divider */}
            <div className="w-full border-t-8 border-ink-charcoal border-dashed my-4" />

            {/* Question Builder Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg font-black uppercase tracking-tight">Questions</h2>
              <div className="font-label-md text-label-md bg-surface-container-high border-2 border-ink-charcoal px-4 py-1 shadow-hard-sm">
                Total: {questions.length}
              </div>
            </div>

            {/* Question Cards */}
            <div className="flex flex-col gap-10">
              {questions.map((q, index) => (
                <QuestionCard key={q.id} questionId={q.id} number={index + 1} />
              ))}
            </div>

            <AddQuestionButton />
            
            <PublishButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
