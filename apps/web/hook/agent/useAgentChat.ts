import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useFormBuilderStore, FieldNode } from "@/store/formBuilderStore";

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export const useAgentChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "agent",
      content: "Hello! Describe the form you want to build, and I'll generate the fields for you.",
    },
  ]);
  const [input, setInput] = useState("");

  const { nodes, setNodes, syncLinearEdges, formId } = useFormBuilderStore();
  const { mutateAsync: generateFormMutation, isPending: isGenerating } =
    trpc.agent.generateForm.useMutation();
  const { mutateAsync: clearHistoryMutation } = trpc.agent.clearHistory.useMutation();

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

    // Snapshot the current canvas state so the agent has ground-truth context
    // for edit operations (delete, modify, reorder, etc.)
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

      if (response?.form?.fields) {
        const newNodes: FieldNode[] = response.form.fields.map((field, index) => ({
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
              ? field.options.map((opt) => ({
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
      }
    } catch (error: any) {
      let displayMessage = "Sorry, I encountered an error while generating the form.";

      if (error.message) {
        if (
          error.message.startsWith("Input guardrail triggered: ") ||
          error.message.startsWith("Output guardrail triggered: ")
        ) {
          try {
            const jsonStr = error.message.replace(/^.*?guardrail triggered: /, "");
            const parsed = JSON.parse(jsonStr);
            displayMessage = parsed.reason ?? error.message;
          } catch {
            displayMessage = error.message;
          }
        } else {
          displayMessage = error.message;
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "agent", content: displayMessage },
      ]);
    }
  };

  /** Reset conversation history in DB and clear local message list */
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
      // Silently ignore clear errors
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
