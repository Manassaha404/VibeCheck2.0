import { create } from "zustand";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Maps questionId → optionId → vote count.
 * Populated via socket events (wired later).
 */
export type VoteTallies = Record<string, Record<string, number>>;

export interface LiveSessionState {
  /** The active session ID, null if no session loaded */
  sessionId: string | null;

  /**
   * Which question is currently being shown to participants.
   * -1 means no question has been emitted yet.
   */
  currentQuestionIndex: number;

  /** Vote counts per question per option, synced from server/socket */
  voteTallies: VoteTallies;

  /** Whether the per-question countdown is ticking */
  questionTimerRunning: boolean;

  /** Seconds remaining on the current question timer */
  questionTimeLeft: number;

  /**
   * Correct option IDs revealed by the host after timer expiry.
   * null = no reveal yet for this question.
   */
  revealedCorrectOptionIds: string[] | null;
}

export interface LiveSessionActions {
  /** Called once when entering the session page */
  initSession: (sessionId: string, initialState?: Partial<Pick<LiveSessionState, "currentQuestionIndex" | "voteTallies">>) => void;

  /** Called after host emits a question — resets timer with the question's time limit */
  setCurrentQuestion: (index: number, timeLimitSecs: number) => void;

  /** Called when the host reveals the correct answer for the current question */
  setRevealedAnswer: (correctOptionIds: string[]) => void;

  /** Decrements questionTimeLeft by 1; stops at 0 */
  tickTimer: () => void;

  /** Pauses the question timer */
  stopTimer: () => void;

  /** Starts the question timer (useful for resuming) */
  startTimer: () => void;

  /** Merge incoming vote tallies (called from socket events later) */
  mergeVoteTallies: (tallies: VoteTallies) => void;

  /** Full reset — called when navigating away or session ends */
  reset: () => void;
}

// ── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_STATE: LiveSessionState = {
  sessionId: null,
  currentQuestionIndex: -1,
  voteTallies: {},
  questionTimerRunning: false,
  questionTimeLeft: 0,
  revealedCorrectOptionIds: null,
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useLiveSessionStore = create<LiveSessionState & LiveSessionActions>()((set, get) => ({
  ...INITIAL_STATE,

  initSession: (sessionId, initialState = {}) =>
    set({
      ...INITIAL_STATE,
      sessionId,
      currentQuestionIndex: initialState.currentQuestionIndex ?? -1,
      voteTallies: initialState.voteTallies ?? {},
    }),

  setCurrentQuestion: (index, timeLimitSecs) =>
    set({
      currentQuestionIndex: index,
      questionTimeLeft: timeLimitSecs,
      questionTimerRunning: true,
      revealedCorrectOptionIds: null, // clear any previous reveal
    }),

  setRevealedAnswer: (correctOptionIds) =>
    set({ revealedCorrectOptionIds: correctOptionIds }),

  tickTimer: () =>
    set((s) => {
      if (!s.questionTimerRunning || s.questionTimeLeft <= 0) {
        return { questionTimerRunning: false, questionTimeLeft: 0 };
      }
      const next = s.questionTimeLeft - 1;
      return {
        questionTimeLeft: next,
        questionTimerRunning: next > 0,
      };
    }),

  stopTimer: () => set({ questionTimerRunning: false }),

  startTimer: () => {
    const { questionTimeLeft } = get();
    if (questionTimeLeft > 0) set({ questionTimerRunning: true });
  },

  mergeVoteTallies: (incoming) =>
    set((s) => ({
      voteTallies: {
        ...s.voteTallies,
        ...Object.fromEntries(
          Object.entries(incoming).map(([qId, optMap]) => [
            qId,
            { ...(s.voteTallies[qId] ?? {}), ...optMap },
          ])
        ),
      },
    })),

  reset: () => set(INITIAL_STATE),
}));
