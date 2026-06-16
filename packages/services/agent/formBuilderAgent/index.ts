import { run } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import { GeneratedForm } from "./model";
import { formMakerAgent } from "./createAgent";
import db, { eq, and } from "@repo/database";
import { formBuilderAgentConversation } from "@repo/database/models/agent-conversations";

class FormBuilderAgentServices {
  /**
   * Run the form-maker agent with full conversation history for (userId, formId).
   * History is loaded from DB before the run and persisted after.
   */
  public async runFormMakerAgent(
    userId: string,
    formId: string,
    prompt: string,
    currentFields?: Array<{
      label: string;
      type: string;
      placeholder?: string;
      helperText?: string;
      isRequired: boolean;
      isPrimary: boolean;
      options?: { id: string; value: string }[];
    }>,
  ): Promise<GeneratedForm> {
    // 1. Load existing history from DB
    const [existing] = await db
      .select()
      .from(formBuilderAgentConversation)
      .where(
        and(
          eq(formBuilderAgentConversation.userId, userId),
          eq(formBuilderAgentConversation.formId, formId),
        ),
      );

    const previousHistory = (existing?.history ?? []) as AgentInputItem[];

    // Build the effective prompt — include current canvas state so the agent
    // can make accurate edits (delete, modify, reorder) rather than guessing.
    const effectivePrompt =
      currentFields && currentFields.length > 0
        ? `Current form fields (JSON):\n${JSON.stringify(currentFields, null, 2)}\n\nUser instruction: ${prompt}`
        : prompt;

    // 2. Build input: resume history + new user turn, or start fresh
    const input: string | AgentInputItem[] =
      previousHistory.length > 0
        ? ([...previousHistory, { role: "user", content: effectivePrompt }] as AgentInputItem[])
        : effectivePrompt;

    // 3. Run the agent
    const result = await run(formMakerAgent, input);

    if (!result.finalOutput) {
      throw new Error("Agent returned no output");
    }
    await db
      .insert(formBuilderAgentConversation)
      .values({
        userId,
        formId,
        history: result.history as any,
      })
      .onConflictDoUpdate({
        target: [
          formBuilderAgentConversation.userId,
          formBuilderAgentConversation.formId,
        ],
        set: {
          history: result.history as any,
          updatedAt: new Date(),
        },
      });

    return result.finalOutput;
  }

  public async clearHistory(userId: string, formId: string): Promise<void> {
    await db
      .delete(formBuilderAgentConversation)
      .where(
        and(
          eq(formBuilderAgentConversation.userId, userId),
          eq(formBuilderAgentConversation.formId, formId),
        ),
      );
  }
}

export default FormBuilderAgentServices;
