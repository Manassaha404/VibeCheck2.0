//perfectly fine
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings";
import { env } from "../../../env";

export const getVectorStore = async (conversationId: string) => {
  return await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: env.QDRANT_URL,
    collectionName: `quiz-agent-conversation-${conversationId}`,
  });
};
