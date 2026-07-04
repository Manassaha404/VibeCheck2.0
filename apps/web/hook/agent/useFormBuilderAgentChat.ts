import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { useFormBuilderStore, FieldNode } from "@/store/formStore/formBuilderStore";
import { useRealtime } from "inngest/react";
import { realtime } from "inngest";
import { z } from "zod";

// the copy of agent channel what in inngest agent function so,don't need depend on backend call for loading the channel
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

//type of messages
export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export const useAgentChat = () => {
  //message initial state  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "agent",
      content: "Hello! Describe the form you want to build, and I'll generate the fields for you.",
    },
  ]);
  //initial state of input
  const [input, setInput] = useState("");

  //jobId of the currently running Inngest job
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  //True while we're waiting for the agent job to complete (from send → done).
  const [isGenerating, setIsGenerating] = useState(false);

  //Guard so we process each job's "done" message exactly once.
  const processedJobIds = useRef<Set<string>>(new Set());

  const { nodes, setNodes, syncLinearEdges, formId } = useFormBuilderStore();
  //generate form called to add a job in inngest queue
  const { mutateAsync: generateFormMutation } = trpc.agent.generateForm.useMutation();
  //clear the history of conversation 
  const { mutateAsync: clearHistoryMutation } = trpc.agent.clearFormBuilderAgentHistory.useMutation();

  const trpcUtils = trpc.useUtils();

  // to generate realtime token token 
  const tokenFactory = useCallback(async () => {
    if (!activeJobId) throw new Error("No active job");
    const result = await trpcUtils.agent.getRealTimeToken.fetch({ jobId: activeJobId });
    if (!result) throw new Error("Failed to get token");
    return result.token;
  }, [activeJobId, trpcUtils]);

  const topics = ["status"] as const;
  //to generate channel 
  const channel = useMemo(
    () =>
      activeJobId
        ? agentChannel({ jobId: activeJobId })
        : agentChannel({ jobId: "__none__" }),
    [activeJobId],
  );
  //call realtime hook 
  const { messages: realtimeMessages } = useRealtime({
    channel,
    topics,
    token: tokenFactory,
    enabled: !!activeJobId,
    bufferInterval: 100,
    autoCloseOnTerminal: false,
  });

  
  const latestStatusMsg = realtimeMessages.byTopic.status;
  console.log(latestStatusMsg);
  
  useEffect(() => {
    if (!latestStatusMsg || !activeJobId) return;
    if (processedJobIds.current.has(activeJobId)) return;

    const payload = latestStatusMsg.data as { status: string; result?: any };
    if (payload.status !== "done") return;

    // Mark this job as handled before any async work.
    processedJobIds.current.add(activeJobId);

    const result = payload.result;
    
    if (result?.error) {
      let displayMessage = "Sorry, I encountered an error while processing your request.";
      if (result.message) {
        if (
          result.message.startsWith("Input guardrail triggered: ") ||
          result.message.startsWith("Output guardrail triggered: ")
        ) {
          try {
            const jsonStr = result.message.replace(/^.*?guardrail triggered: /, "");
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
        { id: crypto.randomUUID(), role: "agent", content: displayMessage },
      ]);
    } else if (result?.fields) {
      const newNodes: FieldNode[] = result.fields.map((field: any, index: number) => ({
        id: crypto.randomUUID(),
        type: "fieldNode",
        position: { x: 350, y: 50 + index * 250 },
        data: {
          label: field.label,
          type: field.type,
          placeholder: field.placeholder ?? undefined,
          helperText: field.helperText ?? undefined,
          isRequired: field.isRequired,
          isPrimary: field.isPrimary,
          options: field.options
            ? field.options.map((opt: any) => ({
                id: opt.id || crypto.randomUUID(),
                value: opt.value,
              }))
            : undefined,
        },
      }));

      setNodes(newNodes);
      syncLinearEdges();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "Done! I've updated the form on your canvas. How does it look?",
        },
      ]);
    } else {
      // Done but no form fields — pure-text or unexpected response.
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "I've finished processing your request.",
        },
      ]);
    }

    // Tear down the subscription and clear the loading state.
    setActiveJobId(null);
    setIsGenerating(false);
  }, [latestStatusMsg, activeJobId]); 

  //handel send function
  const handleSend = async () => {
    if (!input.trim()) return;

    if (!formId) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "Please wait — the form is still loading. Try again in a moment.",
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Snapshot the current canvas state so the agent has ground-truth context.
    const currentFields = nodes.map((node) => ({
      label: node.data.label,
      type: node.data.type,
      placeholder: node.data.placeholder,
      helperText: node.data.helperText,
      isRequired: node.data.isRequired,
      isPrimary: node.data.isPrimary,
      options: node.data.options,
    }));

    try {
      const response = await generateFormMutation({
        prompt: userMessage.content,
        formId,
        currentFields: currentFields.length > 0 ? currentFields : undefined,
      });
      if (!response) throw new Error("Failed to generate form");

      // Mutation returns immediately with a jobId — useRealtime picks it up.
      setActiveJobId(response.jobId);
    } catch (error: any) {
      const displayMessage = error.message || "Sorry, I encountered an error while starting the agent.";

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "agent", content: displayMessage },
      ]);
      setIsGenerating(false);
    }
  };

  
  const handleClearHistory = async () => {
    if (!formId) return;
    try {
      await clearHistoryMutation({ formId });
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "agent",
          content: "Conversation history cleared. Start fresh — describe the form you want!",
        },
      ]);
    } catch {
      
    }
  };

  return {
    messages,
    input,
    setInput,
    handleSend,
    handleClearHistory,
    isGenerating,
    isReady: !!formId,
  };
};
