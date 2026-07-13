import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { useRealtime } from "inngest/react";
import { realtime } from "inngest";
import { z } from "zod";

export interface Message {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

const agentChannel = realtime.channel({
  name: ({ jobId }: { jobId: string }) => `agent:${jobId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.string(),
        result: z.any().optional(),
      }),
    },
  },
});

export function useAgentChat(
  formId: string,
  formTitle: string,
  onComplete: (responseId?: string) => void,
  onClear: () => void,
) {
  const utils = trpc.useUtils();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      text: `👋 Hi! I'm your AI guide for **"${formTitle}"**. I'll walk you through each question one at a time. Just reply naturally — let's get started!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const processedJobIds = useRef<Set<string>>(new Set());

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const tokenFactory = useCallback(async () => {
    if (!activeJobId) throw new Error("No active job");
    const result = await utils.agent.getRealTimeToken.fetch({
      jobId: activeJobId,
    });
    if (!result) throw new Error("Failed to get token");
    return result.token;
  }, [activeJobId, utils]);

  const topics = ["status"] as const;
  const channel = useMemo(
    () =>
      activeJobId
        ? agentChannel({ jobId: activeJobId })
        : agentChannel({ jobId: "__none__" }),
    [activeJobId],
  );

  const { messages: realtimeMessages } = useRealtime({
    channel,
    topics,
    token: tokenFactory,
    enabled: !!activeJobId,
    bufferInterval: 100,
    autoCloseOnTerminal: false,
  });

  const latestStatusMsg = realtimeMessages.byTopic.status;

  useEffect(() => {
    if (!latestStatusMsg || !activeJobId) return;
    if (processedJobIds.current.has(activeJobId)) return;

    const payload = latestStatusMsg.data as { status: string; result?: any };
    if (payload.status !== "done") return;

    processedJobIds.current.add(activeJobId);

    const data = payload.result;

    if (data?.error) {
      let displayMessage = `⚠️ Something went wrong: ${data.message}. Please try again.`;
      if (data.message) {
        if (
          data.message.startsWith("Input guardrail triggered: ") ||
          data.message.startsWith("Output guardrail triggered: ")
        ) {
          try {
            const jsonStr = data.message.replace(
              /^.*?guardrail triggered: /,
              "",
            );
            const parsed = JSON.parse(jsonStr);
            displayMessage = parsed.reason ?? data.message;
          } catch {
            displayMessage = data.message;
          }
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          text: displayMessage,
          timestamp: new Date(),
        },
      ]);
    } else if (data) {
      utils.agent.respondentAgentGetSession.setData({ formId }, (prev) => {
        if (!prev) {
          return {
            hasSession: true,
            isCompleted: data.isComplete,
            collectedAnswers: data.collectedAnswers,
            currentFieldId: data.currentFieldId,
            responseId: data.responseId,
          };
        }
        return {
          ...prev,
          isCompleted: data.isComplete,
          collectedAnswers: data.collectedAnswers,
          currentFieldId: data.currentFieldId,
          responseId: data.responseId,
        };
      });
      utils.agent.respondentAgentGetSession.invalidate({ formId });

      const agentMsg: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        text: data.reply || "Done.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);

      if (data.isComplete) {
        setTimeout(() => onComplete(data.responseId), 800);
      }
    }

    setActiveJobId(null);
    setIsTyping(false);
  }, [latestStatusMsg, activeJobId]);

  const chatMutation = trpc.agent.respondentAgentChat.useMutation({
    onSuccess: (data) => {
      if (data?.jobId) {
        setActiveJobId(data.jobId);
      } else {
        setIsTyping(false);
      }
    },
    onError: (err) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          text: `⚠️ Something went wrong: ${err.message}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const clearMutation = trpc.agent.respondentAgentClearSession.useMutation({
    onSuccess: () => {
      utils.agent.respondentAgentGetSession.setData({ formId }, () => ({
        hasSession: false,
        isCompleted: false,
        collectedAnswers: [],
        currentFieldId: null,
      }));
      setMessages([
        {
          id: "restart",
          role: "agent",
          text: `👋 Session cleared! Let's start fresh. Ready to begin with **"${formTitle}"**? Just say hi!`,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      onClear();
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    chatMutation.mutate({ formId, message: text });
  };

  const clearSession = () => {
    clearMutation.mutate({ formId });
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    clearSession,
    isClearing: clearMutation.isPending,
    bottomRef,
    inputRef,
  };
}
