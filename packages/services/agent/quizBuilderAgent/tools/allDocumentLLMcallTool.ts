import { tool, run } from "@openai/agents";
import { z } from "zod";
import { getVectorStore } from "../langchain/vectorStore";
import { quizBuilderAgent, reducerQuizBuilderAgent } from "../createAgent";
import { QuestionOutputSchema, type QuestionOutputType } from "../model";

const getAllChunksAndCallQuizBuilderAgentInBatches = tool({
  name: "get_all_chunks_and_call_quiz_builder_agent_in_batches",
  description:
    "Fetches every embedded chunk for a conversation from the vector store, " +
    "groups them into batches, and runs the quiz-builder agent " +
    "on each batch to generate questions without exceeding the context window limit.",
  parameters: z.object({
    conversationId: z.string(),
  }),
  execute: async ({ conversationId }) => {
    const vectorStore = await getVectorStore();
    const client = vectorStore.client;
    const collectionName = vectorStore.collectionName;

    const chunks: { pageContent: string; metadata: Record<string, any> }[] = [];
    let offset: string | number | Record<string, unknown> | null | undefined =
      undefined;

    do {
      const res = await client.scroll(collectionName, {
        filter: {
          must: [
            {
              key: "metadata.conversationId",
              match: { value: conversationId },
            },
          ],
        },
        limit: 100,
        offset,
        with_payload: true,
        with_vector: false,
      });
      for (const point of res.points) {
        chunks.push({
          pageContent: (point.payload?.content as string) ?? "",
          metadata: (point.payload?.metadata as Record<string, any>) ?? {},
        });
      }

      offset = res.next_page_offset;
    } while (offset);

    if (chunks.length === 0) {
      return {
        questions: [],
        agentMessage:
          "No document chunks were found for this conversation. " +
          "Please upload a document first.",
      };
    }

    const BATCH_SIZE = 20;
    const batches = [];
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      batches.push(chunks.slice(i, i + BATCH_SIZE));
    }

    const perBatchResults = await Promise.all(
      batches.map(async (batch, batchIndex) => {
        const context = batch
          .map((doc, i) => `[Chunk ${batchIndex * BATCH_SIZE + i + 1}]\n${doc.pageContent}`)
          .join("\n\n---\n\n");

        const prompt =
          `You are generating quiz questions from the following document excerpts (Part ${batchIndex + 1} of ${batches.length}):\n\n${context}`;

        const result = await run(quizBuilderAgent, prompt);
        return result.finalOutput as QuestionOutputType;
      })
    );

    const allQuestions = perBatchResults.flatMap(r => r.questions);

    if (allQuestions.length === 0) {
      return { questions: [], agentMessage: "No questions could be generated." };
    }

    const reducerPrompt = `Please deduplicate and curate these questions:\n\n${JSON.stringify({ questions: allQuestions })}`;
    const reducedResult = await run(reducerQuizBuilderAgent, reducerPrompt);

    return reducedResult.finalOutput as QuestionOutputType;
  },
});

export default getAllChunksAndCallQuizBuilderAgentInBatches;
