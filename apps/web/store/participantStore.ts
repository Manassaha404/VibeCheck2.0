import { create } from "zustand";

export interface LiveQuestion {
  questionId: string;
  orderIndex: number;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  isTextAnswer: boolean;
  allowMultipleCorrect: boolean;
  timeLimitSecs: number;
  points: number;
  mediaUrl: string | null;
}

export interface ParticipantState {
  sessionStatus: "waiting" | "active" | "ended";
  currentQuestion: LiveQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  timerActive: boolean;
  selectedId: string | null;
  selectedIds: string[];
  submitted: boolean;
  revealedOptionIds: string[] | null;
  rank: number | null;
  score: number;
  questionStartTime: number | null;
}

export interface ParticipantActions {
  setSessionStatus: (status: "waiting" | "active" | "ended") => void;
  setQuestion: (question: LiveQuestion, index: number) => void;
  setTimer: (timeLeft: number, active: boolean) => void;
  tickTimer: () => void;
  stopTimer: () => void;
  setRankAndScore: (rank: number | null, score: number) => void;
  selectSingle: (id: string) => void;
  selectMultiple: (id: string) => void;
  setSubmitted: (submitted: boolean) => void;
  setRevealedAnswer: (optionIds: string[]) => void;
  resetQuestionState: () => void;
  resetAll: () => void;
}

const INITIAL_STATE: ParticipantState = {
  sessionStatus: "waiting",
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  timeLeft: 0,
  timerActive: false,
  selectedId: null,
  selectedIds: [],
  submitted: false,
  revealedOptionIds: null,
  rank: null,
  score: 0,
  questionStartTime: null,
};

export const useParticipantStore = create<
  ParticipantState & ParticipantActions
>()((set, get) => ({
  ...INITIAL_STATE,

  setSessionStatus: (status) => set({ sessionStatus: status }),

  setQuestion: (question, index) =>
    set({
      currentQuestion: question,
      questionIndex: index,
      timeLeft: question.timeLimitSecs,
      timerActive: true,
      questionStartTime: Date.now(),
    }),

  setTimer: (timeLeft, active) => set({ timeLeft, timerActive: active }),

  tickTimer: () =>
    set((state) => {
      if (!state.timerActive || state.timeLeft <= 0) {
        return { timerActive: false, timeLeft: 0 };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),

  stopTimer: () => set({ timerActive: false }),

  setRankAndScore: (rank, score) => set({ rank, score }),

  selectSingle: (id) =>
    set((state) => {
      if (state.submitted || state.timeLeft <= 0) return {};
      return { selectedId: id };
    }),

  selectMultiple: (id) =>
    set((state) => {
      if (state.submitted || state.timeLeft <= 0) return {};
      const prev = state.selectedIds;
      return {
        selectedIds: prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id],
      };
    }),

  setSubmitted: (submitted) => set({ submitted, timerActive: false }),

  setRevealedAnswer: (optionIds) =>
    set({ revealedOptionIds: optionIds, timerActive: false, timeLeft: 0 }),

  resetQuestionState: () =>
    set({
      selectedId: null,
      selectedIds: [],
      submitted: false,
      revealedOptionIds: null,
    }),

  resetAll: () => set(INITIAL_STATE),
}));
