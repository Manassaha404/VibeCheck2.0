import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export type QuestionType = "multiple_choice" | "text_entry";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: QuizOption[];
  /** Accepted answers for text_entry type */
  acceptedAnswers: string;
  /** Per-question overrides; if null, global settings apply */
  timeLimit: number;
  points: number;
  mediaUrl?: string;
  collapsed: boolean;
  /** When true, multiple options can be marked correct simultaneously */
  allowMultipleCorrect: boolean;
}

export interface GlobalSettings {
  /** Default time limit in seconds applied to newly added questions */
  defaultTimeLimit: number;
  /** Default points applied to newly added questions */
  defaultPoints: number;
  /** When true, any change to global settings immediately syncs all questions */
  syncAllQuestions: boolean;
  passwordProtect: boolean;
  password: string;
}

export interface QuizInfo {
  title: string;
  description: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_GLOBAL: GlobalSettings = {
  defaultTimeLimit: 30,
  defaultPoints: 10,
  syncAllQuestions: false,
  passwordProtect: false,
  password: "",
};

const DEFAULT_INFO: QuizInfo = {
  title: "",
  description: "",
};

function makeQuestion(
  overrides: Partial<Omit<Question, "id">> = {},
  globalSettings: GlobalSettings
): Question {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: "multiple_choice",
    text: "",
    options: [
      { id: "opt-1", text: "", isCorrect: false },
      { id: "opt-2", text: "", isCorrect: false },
    ],
    acceptedAnswers: "",
    timeLimit: globalSettings.defaultTimeLimit,
    points: globalSettings.defaultPoints,
    collapsed: false,
    allowMultipleCorrect: false,
    ...overrides,
  };
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface QuizStore {
  info: QuizInfo;
  globalSettings: GlobalSettings;
  questions: Question[];

  // Info actions
  setInfo: (partial: Partial<QuizInfo>) => void;

  // Global settings actions
  setGlobalSettings: (partial: Partial<GlobalSettings>) => void;
  /** Force-apply current defaultTimeLimit & defaultPoints to every question */
  applyGlobalToAllQuestions: () => void;

  // Correct-answer actions
  /** Toggle a single option's correct state. If allowMultipleCorrect is false, clears all others first. */
  toggleCorrectOption: (questionId: string, optionId: string) => void;

  // Question actions
  addQuestion: (type?: QuestionType) => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, partial: Partial<Omit<Question, "id">>) => void;
  reorderQuestions: (questions: Question[]) => void;

  // Option actions (inside a question)
  addOption: (questionId: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, partial: Partial<QuizOption>) => void;
  reorderOptions: (questionId: string, options: QuizOption[]) => void;

  reset: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-init-1",
    type: "multiple_choice",
    text: "",
    options: [
      { id: "opt-1a", text: "Radical", isCorrect: false },
      { id: "opt-1b", text: "Tubular", isCorrect: true },
      { id: "opt-1c", text: "", isCorrect: false },
    ],
    acceptedAnswers: "",
    timeLimit: DEFAULT_GLOBAL.defaultTimeLimit,
    points: DEFAULT_GLOBAL.defaultPoints,
    collapsed: false,
    allowMultipleCorrect: false,
  },
  {
    id: "q-init-2",
    type: "text_entry",
    text: "What is the ultimate answer to life, the universe, and everything?",
    options: [],
    acceptedAnswers: "42",
    timeLimit: 60,
    points: 20,
    collapsed: false,
    allowMultipleCorrect: false,
  },
];

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      info: DEFAULT_INFO,
      globalSettings: DEFAULT_GLOBAL,
      questions: INITIAL_QUESTIONS,

      // ── Info ────────────────────────────────────────────────────────────
      setInfo: (partial) =>
        set((s) => ({ info: { ...s.info, ...partial } })),

      // ── Global Settings ─────────────────────────────────────────────────
      setGlobalSettings: (partial) =>
        set((s) => {
          const next = { ...s.globalSettings, ...partial };

          // If syncAllQuestions is on, immediately propagate time/points
          const shouldSync =
            next.syncAllQuestions &&
            (partial.defaultTimeLimit !== undefined || partial.defaultPoints !== undefined);

          return {
            globalSettings: next,
            questions: shouldSync
              ? s.questions.map((q) => ({
                  ...q,
                  timeLimit: next.defaultTimeLimit,
                  points: next.defaultPoints,
                }))
              : s.questions,
          };
        }),

      applyGlobalToAllQuestions: () =>
        set((s) => ({
          questions: s.questions.map((q) => ({
            ...q,
            timeLimit: s.globalSettings.defaultTimeLimit,
            points: s.globalSettings.defaultPoints,
          })),
        })),

      // ── Questions ───────────────────────────────────────────────────────
      addQuestion: (type = "multiple_choice") =>
        set((s) => ({
          questions: [
            ...s.questions,
            makeQuestion({ type }, s.globalSettings),
          ],
        })),

      removeQuestion: (id) =>
        set((s) => ({
          questions: s.questions.filter((q) => q.id !== id),
        })),

      updateQuestion: (id, partial) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...partial } : q
          ),
        })),

      reorderQuestions: (questions) => set({ questions }),

      // ── Options ─────────────────────────────────────────────────────────
      addOption: (questionId) =>
        set((s) => ({
          questions: s.questions.map((q) => {
            if (q.id !== questionId || q.options.length >= 6) return q;
            return {
              ...q,
              options: [
                ...q.options,
                {
                  id: `opt-${Date.now()}`,
                  text: "",
                  isCorrect: false,
                },
              ],
            };
          }),
        })),

      removeOption: (questionId, optionId) =>
        set((s) => ({
          questions: s.questions.map((q) => {
            if (q.id !== questionId || q.options.length <= 2) return q;
            return {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            };
          }),
        })),

      updateOption: (questionId, optionId, partial) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id !== questionId
              ? q
              : {
                  ...q,
                  options: q.options.map((o) =>
                    o.id === optionId ? { ...o, ...partial } : o
                  ),
                }
          ),
        })),

      toggleCorrectOption: (questionId, optionId) =>
        set((s) => ({
          questions: s.questions.map((q) => {
            if (q.id !== questionId) return q;
            if (q.allowMultipleCorrect) {
              // Multi-correct: simply flip the toggled option
              return {
                ...q,
                options: q.options.map((o) =>
                  o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
                ),
              };
            } else {
              // Single-correct: clear all others, set the clicked one
              return {
                ...q,
                options: q.options.map((o) => ({
                  ...o,
                  isCorrect: o.id === optionId,
                })),
              };
            }
          }),
        })),

      reorderOptions: (questionId, options) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === questionId ? { ...q, options } : q
          ),
        })),

      // ── Reset ────────────────────────────────────────────────────────────
      reset: () =>
        set({
          info: DEFAULT_INFO,
          globalSettings: DEFAULT_GLOBAL,
          questions: [],
        }),
    }),
    { name: "vibecheck-quiz-store" }
  )
);
