import type { AgentInputItem } from "@openai/agents";
import {
  clearHistoryDto,
  ClearHistoryType,
  runQuizBuilderAgentDto,
  RunQuizBuilderAgentType,
} from "./model";
import db, { eq, and } from "@repo/database";
import { quizBuilderAgentConversation } from "@repo/database/models/quiz-builder-agent-conversation";
import { inngest } from "../../inngest";

class QuizBuilderAgentService {
  public async runQuizBuilderAgent(
    payload: RunQuizBuilderAgentType,
  ): Promise<{ quizId: string; conversationId: string }> {
    const { userId, quizId, prompt, conversationId } =
      await runQuizBuilderAgentDto.parseAsync(payload);

    let resolvedConversationId = conversationId ?? undefined;
    let previousHistory: AgentInputItem[] = [];

    if (resolvedConversationId) {
      const [existing] = await db
        .select()
        .from(quizBuilderAgentConversation)
        .where(eq(quizBuilderAgentConversation.id, resolvedConversationId));

      if (existing) {
        previousHistory = (existing.history ?? []) as AgentInputItem[];
      } else {
        resolvedConversationId = undefined;
      }
    }

    if (!resolvedConversationId) {
      const [inserted] = await db
        .insert(quizBuilderAgentConversation)
        .values({
          userId,
          quizId,
          history: [],
          fileUrls: [],
        })
        .returning({ id: quizBuilderAgentConversation.id });

      if (!inserted) {
        throw new Error("Failed to create new conversation");
      }
      resolvedConversationId = inserted.id;
    }

    const effectivePrompt = `conversationId: ${resolvedConversationId}\n\n${prompt}`;

    const input: string | AgentInputItem[] =
      previousHistory.length > 0
        ? ([
            ...previousHistory,
            { role: "user", content: effectivePrompt },
          ] as AgentInputItem[])
        : effectivePrompt;

    await inngest.send({
      name: "quiz-builder-agent/run",
      data: { userId, quizId, input, conversationId: resolvedConversationId },
    });

    return { quizId, conversationId: resolvedConversationId };
  }

  public async clearHistory(payload: ClearHistoryType): Promise<void> {
    const { userId, quizId } = await clearHistoryDto.parseAsync(payload);

    await db
      .delete(quizBuilderAgentConversation)
      .where(
        and(
          eq(quizBuilderAgentConversation.userId, userId),
          eq(quizBuilderAgentConversation.quizId, quizId),
        ),
      );
  }
}

export default QuizBuilderAgentService;
