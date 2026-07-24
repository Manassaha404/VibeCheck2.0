import { Agent, InputGuardrail, OutputGuardrail, run } from "@openai/agents";
import { GuardrailResultSchema, QuestionOutputSchema } from "./model";
import type { AgentInputItem } from "@openai/agents";
export const inputGuardrailAgent = new Agent({
  name: "input_guardrail_agent",
  instructions: `
You are a strict input guardrail for a quiz-generation assistant.

Your ONLY job is to decide whether the incoming user message is allowed to proceed.

RULE — Document queries require a conversationId:
  A "document query" is ANY message that implies reading, analysing, or generating
  questions FROM uploaded documents (e.g. "make questions from my document",
  "quiz me on the file I uploaded", "generate questions from this conversation",
  "use my notes", "from the PDF", "based on what I uploaded", etc.).

  If the message is a document query AND it does NOT contain a conversationId
  (a UUID-like string, e.g. "550e8400-e29b-41d4-a716-446655440000", or an
  explicit field such as conversationId=<value>), you MUST return:
    { isValid: false, reason: "A conversationId is required to query documents. Please provide one." }

  If the message is a document query AND a conversationId IS present, return:
    { isValid: true, reason: null }

For any other message (general knowledge quiz, plain topic request with no
document intent), return:
    { isValid: true, reason: null }

Never explain yourself beyond the JSON output. Never ask for clarification.
`.trim(),
  model: "gpt-4o-mini",
  outputType: GuardrailResultSchema,
});

function extractUserText(input: string | AgentInputItem[] | unknown): string {
  if (typeof input === "string") return input;

  if (Array.isArray(input)) {
    const texts: string[] = [];
    for (let i = input.length - 1; i >= 0; i--) {
      const item = input[i] as AgentInputItem;
      if (item && (item as any).role === "user") {
        const content = (item as any).content;
        if (typeof content === "string") texts.push(content);
        if (Array.isArray(content)) {
          const textPart = content.find(
            (p: any) => p.type === "input_text" || p.type === "text",
          );
          if (textPart) texts.push(textPart.text ?? textPart.content ?? "");
        }
      }
    }
    if (texts.length > 0) return texts.join("\n\n");
  }
  return JSON.stringify(input);
}

export const inputGuardrail: InputGuardrail = {
  name: "quiz_builder_input_guardrail",
  runInParallel: false,
  execute: async ({ input }) => {
    const textToCheck = extractUserText(input as string | AgentInputItem[]);
    const result = await run(inputGuardrailAgent, textToCheck);
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isValid !== true,
    };
  },
};

export const outputGuardrailAgent = new Agent({
  name: "output_guardrail_agent",
  instructions: `
You are a quality-control output guardrail for a quiz-generation assistant.
You receive a JSON object representing the agent's final output. The structure and types are already validated by the system.
Your ONLY job is to verify semantic correctness:
  1. For "multiple_choice" questions, ensure there are at least 2 options.
  2. For "text_entry" questions, ensure the "options" array is empty.
If both semantic rules pass -> { isValid: true, reason: null }
If ANY rule fails -> { isValid: false, reason: "<Concise description of the EXACT rule that failed>" }
`.trim(),
  model: "gpt-4o-mini",
  outputType: GuardrailResultSchema,
});

export const outputGuardrail: OutputGuardrail<typeof QuestionOutputSchema> = {
  name: "quiz_builder_output_guardrail",
  execute: async ({ agentOutput }) => {
    const result = await run(outputGuardrailAgent, JSON.stringify(agentOutput));
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isValid !== true,
    };
  },
};
