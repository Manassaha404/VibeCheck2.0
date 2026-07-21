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
    for (let i = input.length - 1; i >= 0; i--) {
      const item = input[i] as AgentInputItem;
      if (item && (item as any).role === "user") {
        const content = (item as any).content;
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
          const textPart = content.find(
            (p: any) => p.type === "input_text" || p.type === "text",
          );
          if (textPart) return textPart.text ?? textPart.content ?? "";
        }
      }
    }
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
You are a strict output guardrail for a quiz-generation assistant.

You receive a JSON object that is the agent's final output. Validate it against
these EXACT rules (DO NOT invent any other rules):
  1. It must have a "questions" array with at least 0 items (empty is allowed).
  2. Every question must have a non-empty "text" field and a valid "type"
     ("multiple_choice" or "text_entry").
  3. If type is "multiple_choice", it must have at least 2 "options", each with
     a "text" string and an "isCorrect" boolean. Multiple options can be correct
     if allowMultipleCorrect is true. Do not fail it for having multiple correct options.
     If type is "text_entry", "options" can be empty.
  4. "timeLimit" must be a positive integer; "points" must be a non-negative integer.
  5. The object must have an "agentMessage" string (may be empty).

If ALL 5 rules pass → { isValid: true, reason: null }
If ANY rule fails → { isValid: false, reason: "<concise description of what failed>" }
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
