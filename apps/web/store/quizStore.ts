import { create } from "zustand";

//types
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
  acceptedAnswers?: string;
  timeLimit: number;
  points: number;
  mediaUrl?: string;
  collapsed: boolean;
  allowMultipleCorrect: boolean;
}

export interface GlobalSettings {
  defaultTimeLimit: number;
  defaultPoints: number;
  syncAllQuestions: boolean;
  passwordProtect: boolean;
  password: string;
  isBonusPointsEnabled: boolean;
}

export interface QuizInfo {
  title: string;
  description: string;
}

function makeQuestion(
  overrides: Partial<Omit<Question, "id">> = {},
  globalSettings: GlobalSettings,
): Question {
  const type = overrides.type || "multiple_choice";
  const base: Omit<Question, "id"> = {
    type,
    text: "",
    options: [
      { id: "opt-1", text: "", isCorrect: false },
      { id: "opt-2", text: "", isCorrect: false },
    ],
    timeLimit: globalSettings.defaultTimeLimit,
    points: globalSettings.defaultPoints,
    collapsed: false,
    allowMultipleCorrect: type === "multiple_choice",
    ...overrides,
  };

  if (base.type === "text_entry") {
    base.points = 0;
  }

  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...base,
  };
}

interface QuizStore {
  info: QuizInfo;
  globalSettings: GlobalSettings;
  questions: Question[];

  //actions
  setInfo: (partial: Partial<QuizInfo>) => void;
  setGlobalSettings: (partial: Partial<GlobalSettings>) => void;
  applyGlobalToAllQuestions: () => void;
  toggleCorrectOption: (questionId: string, optionId: string) => void;
  addQuestion: (type?: QuestionType) => void;
  appendQuestions: (questions: Question[]) => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, partial: Partial<Omit<Question, "id">>) => void;
  reorderQuestions: (questions: Question[]) => void;
  addOption: (questionId: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  updateOption: (
    questionId: string,
    optionId: string,
    partial: Partial<QuizOption>,
  ) => void;
  reorderOptions: (questionId: string, options: QuizOption[]) => void;
  reset: () => void;
}

//default values
const DEFAULT_GLOBAL: GlobalSettings = {
  defaultTimeLimit: 30,
  defaultPoints: 10,
  syncAllQuestions: false,
  passwordProtect: false,
  password: "",
  isBonusPointsEnabled: false,
};
const DEFAULT_INFO: QuizInfo = {
  title: "",
  description: "",
};
const INITIAL_QUESTIONS: Question[] = [
  {
    id: `q-init-${Date.now()}`,
    type: "multiple_choice",
    text: "",
    options: [
      { id: "opt-1", text: "", isCorrect: false },
      { id: "opt-2", text: "", isCorrect: false },
    ],
    timeLimit: DEFAULT_GLOBAL.defaultTimeLimit,
    points: DEFAULT_GLOBAL.defaultPoints,
    collapsed: false,
    allowMultipleCorrect: true,
  },
];

export const useQuizStore = create<QuizStore>()((set, get) => ({
  info: DEFAULT_INFO,
  globalSettings: DEFAULT_GLOBAL,
  questions: INITIAL_QUESTIONS,

  //quiz information settings
  setInfo: (partial) => set((s) => ({ info: { ...s.info, ...partial } })),

  //global information settings
  setGlobalSettings: (partial) =>
    set((s) => {
      const next = { ...s.globalSettings, ...partial };
      const shouldSync =
        next.syncAllQuestions &&
        (partial.defaultTimeLimit !== undefined ||
          partial.defaultPoints !== undefined);

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

  //questions settings
  addQuestion: (type = "multiple_choice") =>
    set((s) => ({
      questions: [...s.questions, makeQuestion({ type }, s.globalSettings)],
    })),

  appendQuestions: (newQuestions) =>
    set((s) => ({
      questions: [...s.questions, ...newQuestions],
    })),

  removeQuestion: (id) =>
    set((s) => ({
      questions: s.questions.filter((q) => q.id !== id),
    })),

  updateQuestion: (id, partial) =>
    set((s) => ({
      questions: s.questions.map((q) =>
        q.id === id ? { ...q, ...partial } : q,
      ),
    })),

  reorderQuestions: (questions) => set({ questions }),

  //options settings
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
              o.id === optionId ? { ...o, ...partial } : o,
            ),
          },
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
              o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o,
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
        q.id === questionId ? { ...q, options } : q,
      ),
    })),

  //reset
  reset: () =>
    set({
      info: DEFAULT_INFO,
      globalSettings: DEFAULT_GLOBAL,
      questions: [],
    }),
}));
