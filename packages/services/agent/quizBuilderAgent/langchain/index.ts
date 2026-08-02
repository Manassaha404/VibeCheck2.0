//perfectly fine
import db, { eq, sql } from "@repo/database";
import { quizBuilderAgentConversation } from "@repo/database/models/quiz-builder-agent-conversation";
import { inngest } from "../../../inngest";

export interface StoreDocumentsEmbeddingsInput {
  documentId: string;
  fileUrl: string;
  userId: string;
  quizId: string;
  conversationId?: string | null;
}

class LangChainService {
  public async storeDocumentsEmbeddings({
    documentId,
    fileUrl,
    userId,
    quizId,
    conversationId,
  }: StoreDocumentsEmbeddingsInput): Promise<{ conversationId: string }> {
    let resolvedConversationId: string | undefined;

    if (conversationId) {
      const [updated] = await db
        .update(quizBuilderAgentConversation)
        .set({
          fileUrls: sql`${quizBuilderAgentConversation.fileUrls} || ${JSON.stringify([fileUrl])}::jsonb`,
          updatedAt: new Date(),
        })
        .where(eq(quizBuilderAgentConversation.id, conversationId))
        .returning({ id: quizBuilderAgentConversation.id });

      if (updated) {
        resolvedConversationId = updated.id;
      }
    }

    if (!resolvedConversationId) {
      if (!userId || !quizId) {
        throw new Error(
          "userId and quizId are required when creating a new conversation",
        );
      }

      const [inserted] = await db
        .insert(quizBuilderAgentConversation)
        .values({
          userId,
          quizId,
          fileUrls: [fileUrl],
          history: [],
        })
        .returning({ id: quizBuilderAgentConversation.id });

      if (!inserted) {
        throw new Error("Failed to create quiz-builder conversation record");
      }

      resolvedConversationId = inserted.id;
    }

    await inngest.send({
      name: "document/uploaded",
      data: {
        documentId,
        fileUrl,
        conversationId: resolvedConversationId,
        quizId,
      },
    });

    return { conversationId: resolvedConversationId };
  }
}

export const langChainService = new LangChainService();
export default LangChainService;
