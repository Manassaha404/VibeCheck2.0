"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { useRealtime } from "inngest/react";
import { realtime } from "inngest";
import { z } from "zod";
import type { AgentMessage } from "@/components/agent-chat/AgentMessageBubble";
import { useQuizStore, Question } from "@/store/quizStore";
import { useAgentSessionStore } from "@/store/agentSessionStore";


const quizAgentChannel = realtime.channel({
  name: ({ quizId }: { quizId: string }) => `quiz-agent:${quizId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.string(),
        result: z.any().optional(),
      }),
    },
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  text: string;
  options: QuizOption[];
  allowMultipleCorrect: boolean;
  timeLimit: number;
  points: number;
  mediaUrl?: string | null;
}

export interface TextEntryQuestion {
  type: "text_entry";
  text: string;
  timeLimit: number;
  points: number;
  mediaUrl?: string | null;
}

export type GeneratedQuestion = MultipleChoiceQuestion | TextEntryQuestion;

export interface QuizBuilderAgentResult {
  questions: GeneratedQuestion[];
  agentMessage: string;
}

export interface UseQuizBuilderAgentChatReturn {
  messages: AgentMessage[];
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: () => Promise<void>;
  handleClearHistory: () => Promise<void>;
  isGenerating: boolean;
  lastGeneratedQuestions: GeneratedQuestion[] | null;
  pushMessage: (msg: Omit<AgentMessage, "id" | "timestamp">) => void;
}



// ── Document-intent detection ─────────────────────────────────────────────────
const DOCUMENT_INTENT_RE =
  /\b(document|file|pdf|upload(ed)?|my (file|doc|notes)|from (the|my)|based on)/i;

// ── Build a short quiz-draft summary for agent context ────────────────────────
function buildQuizDraftContext(questions: Question[]): string {
  if (questions.length === 0) return "The quiz currently has no questions.";
  const lines = questions.map(
    (q, i) =>
      `  Q${i + 1} [${q.type}]: ${q.text || "(empty)"}${
        q.type === "multiple_choice"
          ? ` — ${q.options.length} options, ${q.options.filter((o) => o.isCorrect).length} correct`
          : ""
      }`,
  );
  return `The quiz currently has ${questions.length} question(s):\n${lines.join("\n")}`;
}

const WELCOME_MESSAGE: AgentMessage = {
  id: "welcome",
  role: "agent",
  content:
    "Hey! I'm your Quiz Maker Agent 🎉 Tell me what kind of quiz you want to create, or upload a document and I'll generate questions from it automatically.",
  timestamp: new Date(),
};

export function useQuizBuilderAgentChat(
  quizId: string,
): UseQuizBuilderAgentChatReturn {
  const questions = useQuizStore((s) => s.questions);
  const { conversationId, hasUploadedDocument } = useAgentSessionStore();

  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");

  // Inngest job lifecycle
  const [isGenerating, setIsGenerating] = useState(false);

  // Accumulate the last set of questions the agent returned
  const [lastGeneratedQuestions, setLastGeneratedQuestions] = useState<
    GeneratedQuestion[] | null
  >(null);

  // Guard against processing the same job's "done" event more than once
  const processedJobIds = useRef<Set<string>>(new Set());

  // Helper for external callers to inject system messages
  const pushMessage = useCallback(
    (msg: Omit<AgentMessage, "id" | "timestamp">) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, id: Math.random().toString(36).slice(2, 9), timestamp: new Date() },
      ]);
    },
    [],
  );

  // tRPC mutations / utils
  const { mutateAsync: runAgentMutation } =
    trpc.agent.runQuizBuilderAgent.useMutation();

  const { mutateAsync: clearHistoryMutation } =
    trpc.agent.clearQuizBuilderAgentHistory.useMutation();

  const trpcUtils = trpc.useUtils();

  // ── Inngest realtime subscription ──────────────────────────────────────────
  const tokenFactory = useCallback(async () => {
    const result = await trpcUtils.agent.getRealTimeToken.fetch({
      quizId,
    });
    if (!result) throw new Error("Failed to get realtime token");
    return result.token;
  }, [quizId, trpcUtils]);

  const topics = ["status"] as const;

  const channel = useMemo(
    () => quizAgentChannel({ quizId }),
    [quizId],
  );

  const { messages: realtimeMessages } = useRealtime({
    channel,
    topics,
    token: tokenFactory,
    enabled: true,
    bufferInterval: 100,
    autoCloseOnTerminal: false,
  });

  const latestStatusMsg = realtimeMessages.byTopic.status;

  // ── Handle realtime status updates ────────────────────────────────────────
  useEffect(() => {
    if (!latestStatusMsg) return;

    const payload = latestStatusMsg.data as {
      status: string;
      result?: any;
    };

    if (payload.status === "running") {
      setIsGenerating(true);
      return;
    }

    if (payload.status !== "done") return;

    const result = payload.result as QuizBuilderAgentResult & {
      error?: boolean;
      message?: string;
      jobId?: string;
    };

    // Mark job as handled to prevent duplicate renders processing the same message
    const resultJobId = result?.jobId || Math.random().toString();
    if (processedJobIds.current.has(resultJobId)) return;
    processedJobIds.current.add(resultJobId);

    if (result?.error) {
      // Surface guardrail / error messages
      let displayMessage =
        "Sorry, I encountered an error while processing your request.";
      if (result.message) {
        if (
          result.message.startsWith("Input guardrail triggered: ") ||
          result.message.startsWith("Output guardrail triggered: ")
        ) {
          try {
            const jsonStr = result.message.replace(
              /^.*?guardrail triggered: /,
              "",
            );
            const parsed = JSON.parse(jsonStr);
            displayMessage = parsed.reason ?? result.message;
          } catch {
            displayMessage = result.message;
          }
        } else {
          displayMessage = result.message;
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          role: "agent",
          content: displayMessage,
          timestamp: new Date(),
        },
      ]);
    } else if (result?.questions?.length) {
      setLastGeneratedQuestions(result.questions);

      // Map the agent's payload into the UI's Question store format
      const mappedQuestions: Question[] = result.questions.map((q: GeneratedQuestion) => ({
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: q.type,
        text: q.text,
        options:
          q.type === "multiple_choice"
            ? q.options.map((opt) => ({
                id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                text: opt.text,
                isCorrect: opt.isCorrect,
              }))
            : [], // text_entry has no predefined options
        timeLimit: q.timeLimit,
        points: q.points,
        mediaUrl: q.mediaUrl ?? undefined,
        collapsed: false,
        allowMultipleCorrect:
          q.type === "multiple_choice" ? q.allowMultipleCorrect : false,
      }));

      useQuizStore.getState().appendQuestions(mappedQuestions);

      const agentContent =
        result.agentMessage ||
        `✅ Done! I generated ${result.questions.length} question${result.questions.length !== 1 ? "s" : ""} for your quiz.`;

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          role: "agent",
          content: agentContent,
          timestamp: new Date(),
        },
      ]);
    } else {
      // Done but no questions returned
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          role: "agent",
          content: "I finished processing your request but couldn't generate any questions. Try rephrasing your prompt.",
          timestamp: new Date(),
        },
      ]);
    }

    setIsGenerating(false);
  }, [latestStatusMsg]);

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isGenerating) return;

    // ── Document-intent guard ────────────────────────────────────────────────
    // If the user is asking about documents but hasn't uploaded one yet, block
    // and explain — no API call needed.
    if (DOCUMENT_INTENT_RE.test(trimmed) && !hasUploadedDocument) {
      pushMessage({
        role: "agent",
        content:
          "⚠️ It looks like you want to generate questions from a document, but no document has been uploaded yet. " +
          "Please use the 📎 attachment button to upload a file first!",
      });
      return;
    }

    const userMsg: AgentMessage = {
      id: Math.random().toString(36).slice(2, 9),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsGenerating(true);

    // ── Build enriched prompt ────────────────────────────────────────────────
    // Inject conversationId + current quiz draft so the agent always has context.
    const quizContext = buildQuizDraftContext(questions);
    const enrichedPrompt = [
      conversationId ? `conversationId: ${conversationId}` : null,
      `Current quiz draft:\n${quizContext}`,
      `User request: ${trimmed}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const response = await runAgentMutation({
        prompt: enrichedPrompt,
        quizId,
        conversationId: conversationId ?? undefined,
      });

      if (!response) throw new Error("Failed to start quiz builder agent");
    } catch (error: any) {
      const displayMessage =
        error?.message || "Sorry, I encountered an error while starting the agent.";

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          role: "agent",
          content: displayMessage,
          timestamp: new Date(),
        },
      ]);
      setIsGenerating(false);
    }
  }, [inputValue, isGenerating, quizId, runAgentMutation, conversationId, hasUploadedDocument, questions, pushMessage]);

  // ── Clear history ─────────────────────────────────────────────────────────
  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistoryMutation({ quizId });
      setMessages([
        {
          id: Math.random().toString(36).slice(2, 9),
          role: "agent",
          content:
            "Conversation history cleared. Start fresh — describe the quiz you want to create!",
          timestamp: new Date(),
        },
      ]);
      setLastGeneratedQuestions(null);
    } catch {
      // silently ignore
    }
  }, [quizId, clearHistoryMutation]);

  return {
    messages,
    inputValue,
    setInputValue,
    handleSend,
    handleClearHistory,
    isGenerating,
    lastGeneratedQuestions,
    pushMessage,
  };
}
