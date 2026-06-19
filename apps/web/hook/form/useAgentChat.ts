import { useState, useRef, useEffect } from "react";
import { trpc } from "@/trpc/client";

export interface Message {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.agent.respondentAgentChat.useMutation({
    onSuccess: (data) => {
      if (!data) return;

      utils.agent.respondentAgentGetSession.setData({ formId }, (prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          isCompleted: data.isComplete,
          collectedAnswers: data.collectedAnswers,
          currentFieldId: data.currentFieldId,
          responseId: data.responseId,
        };
      });

      const agentMsg: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        text: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
      if (data.isComplete) {
        setTimeout(() => onComplete(data.responseId), 800);
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
