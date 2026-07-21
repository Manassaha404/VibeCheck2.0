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
  ): Promise<{ jobId: string }> {
    const { jobId, userId, quizId, prompt, conversationId } =
      await runQuizBuilderAgentDto.parseAsync(payload);
    const [existing] = await db
      .select()
      .from(quizBuilderAgentConversation)
      .where(
        and(
          eq(quizBuilderAgentConversation.userId, userId),
          eq(quizBuilderAgentConversation.quizId, quizId),
        ),
      );

    const previousHistory = (existing?.history ?? []) as AgentInputItem[];

    const effectivePrompt = conversationId
      ? `conversationId: ${conversationId}\n\nUser request: ${prompt}`
      : prompt;

    const input: string | AgentInputItem[] =
      previousHistory.length > 0
        ? ([
            ...previousHistory,
            { role: "user", content: effectivePrompt },
          ] as AgentInputItem[])
        : effectivePrompt;

    await inngest.send({
      name: "quiz-builder-agent/run",
      data: { jobId, userId, quizId, input },
    });

    return { jobId };
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
