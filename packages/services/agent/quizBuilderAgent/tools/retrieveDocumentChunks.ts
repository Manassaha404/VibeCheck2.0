import { tool, run } from "@openai/agents";
import { z } from "zod";
import { getVectorStore } from "../langchain/vectorStore";
import { quizBuilderAgent } from "../createAgent";
import { type QuestionOutputType } from "../model";

// get relative chunk and then call quiz builder agent once
const retrieveChunksAndCallQuizBuilderAgentOnce = tool({
  name: "retrieve_chunks_and_call_quiz_builder_agent_once",
  description:
    "Performs a semantic similarity search to retrieve the most relevant document " +
    "chunks for a given query within a conversation, then calls the quiz-builder " +
    "agent exactly once with all retrieved chunks concatenated as context.",
  parameters: z.object({
    conversationId: z.string().describe("The conversation/session ID used to scope the search to the user's uploaded documents."),
    query: z.string().describe("The topic or subject to search for within the documents (e.g. 'photosynthesis', 'World War II causes')."),
    topK: z.number().int().min(1).max(20).default(5).describe("Number of top relevant chunks to retrieve. Defaults to 5."),
  }),
  execute: async ({ conversationId, query, topK }): Promise<QuestionOutputType> => {
    // ── 1. Semantic similarity search scoped to this conversation ─────────
    const vectorStore = await getVectorStore();

    const results = await vectorStore.similaritySearch(query, topK, {
      must: [
        {
          key: "metadata.conversationId",
          match: { value: conversationId },
        },
      ],
    });

    if (results.length === 0) {
      return {
        questions: [],
        agentMessage:
          "No relevant document chunks were found for the given query. " +
          "Please upload a document first or try a different search topic.",
      };
    }

    // ── 2. Concatenate retrieved chunks into a single context block ───────
    const context = results
      .map((doc, i) => `[Chunk ${i + 1}]\n${doc.pageContent}`)
      .join("\n\n---\n\n");

    const prompt =
      `You are generating quiz questions from the following relevant document excerpts ` +
      `(retrieved for the topic: "${query}"):\n\n${context}`;

    // ── 3. Call quizBuilderAgent exactly once with the combined context ────
    const result = await run(quizBuilderAgent, prompt);

    return result.finalOutput as QuestionOutputType;
  },
});

export default retrieveChunksAndCallQuizBuilderAgentOnce;
