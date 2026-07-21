import db, { eq, sql } from "@repo/database";
import { quizBuilderAgentConversation } from "@repo/database/models/quiz-builder-agent-conversation";
import { inngest } from "../../../inngest";

export interface StoreDocumentsEmbeddingsInput {
  documentId: string;
  fileUrl: string;
  userId: string;
  quizId: string;
  conversationId?: string;
}

class LangChainService {
  public async storeDocumentsEmbeddings({
    documentId,
    fileUrl,
    userId,
    quizId,
    conversationId,
  }: StoreDocumentsEmbeddingsInput): Promise<{ conversationId: string }> {
    let resolvedConversationId: string;

    if (conversationId) {
      const [updated] = await db
        .update(quizBuilderAgentConversation)
        .set({
          fileUrls: sql`${quizBuilderAgentConversation.fileUrls} || ${JSON.stringify([fileUrl])}::jsonb`,
          updatedAt: new Date(),
        })
        .where(eq(quizBuilderAgentConversation.id, conversationId))
        .returning({ id: quizBuilderAgentConversation.id });

      if (!updated) {
        throw new Error(
          `Quiz-builder conversation not found: ${conversationId}`,
        );
      }

      resolvedConversationId = updated.id;
    } else {
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
        .onConflictDoUpdate({
          target: [
            quizBuilderAgentConversation.userId,
            quizBuilderAgentConversation.quizId,
          ],
          set: {
            fileUrls: sql`${quizBuilderAgentConversation.fileUrls} || ${JSON.stringify([fileUrl])}::jsonb`,
            updatedAt: new Date(),
          },
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
        fileUrl, // plain public secure_url — no reconstruction needed
        conversationId: resolvedConversationId,
      },
    });

    return { conversationId: resolvedConversationId };
  }
}

export const langChainService = new LangChainService();
export default LangChainService;