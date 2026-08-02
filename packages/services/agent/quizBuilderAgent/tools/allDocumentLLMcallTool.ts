import { tool, run } from "@openai/agents";
import { z } from "zod";
import { getVectorStore } from "../langchain/vectorStore";
import { quizBuilderAgent, reducerQuizBuilderAgent } from "../createAgent";
import { QuestionOutputSchema, type QuestionOutputType } from "../model";

const getAllChunksAndCallQuizBuilderAgentInBatches = tool({
  name: "get_all_chunks_and_call_quiz_builder_agent_in_batches",
  description:
    "Fetches every embedded document chunk for a specific conversation from the vector store, " +
    "groups them into manageable batches, and processes them through the quiz-builder agent. " +
    "It then automatically deduplicates and curates the results. " +
    "Use this tool ONLY when the user wants a comprehensive quiz covering the ENTIRE uploaded document or when they don't specify a narrow topic.",
  parameters: z.object({
    conversationId: z.string(),
    userRequest: z
      .string()
      .optional()
      .describe(
        "The user's original request or prompt, indicating the desired number of questions or specific constraints.",
      ),
  }),
  execute: async ({ conversationId, userRequest }) => {
    const vectorStore = await getVectorStore(conversationId);
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
          .map(
            (doc, i) =>
              `[Chunk ${batchIndex * BATCH_SIZE + i + 1}]\n${doc.pageContent}`,
          )
          .join("\n\n---\n\n");

        const userInstructions = userRequest
          ? `\n\nUSER REQUEST/CONSTRAINTS:\n"${userRequest}"\nPlease ensure you follow the user's request (e.g. if they asked for exactly 30 questions, you must provide exactly 30 questions).`
          : "";

        const prompt = `You are generating quiz questions from the following document excerpts (Part ${batchIndex + 1} of ${batches.length}):\n\n${context}${userInstructions}`;

        const result = await run(quizBuilderAgent, prompt);
        return result.finalOutput as QuestionOutputType;
      }),
    );

    const allQuestions = perBatchResults.flatMap((r) => r.questions);

    if (allQuestions.length === 0) {
      return {
        questions: [],
        agentMessage: "No questions could be generated.",
      };
    }

    const userInstructions = userRequest
      ? `\n\nUSER REQUEST/CONSTRAINTS:\n"${userRequest}"\nPlease ensure you follow the user's request (e.g. if they asked for exactly 30 questions, you must output exactly 30 questions, bypassing the default 20 question cap).`
      : "";
    const reducerPrompt = `Please deduplicate and curate these questions:\n\n${JSON.stringify({ questions: allQuestions })}${userInstructions}`;
    const reducedResult = await run(reducerQuizBuilderAgent, reducerPrompt);

    return reducedResult.finalOutput as QuestionOutputType;
  },
});

export default getAllChunksAndCallQuizBuilderAgentInBatches;
