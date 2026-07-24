import { tool, run } from "@openai/agents";
import { z } from "zod";
import { getVectorStore } from "../langchain/vectorStore";
import { quizBuilderAgent } from "../createAgent";
import { type QuestionOutputType } from "../model";

// get relative chunk and then call quiz builder agent once
const retrieveChunksAndCallQuizBuilderAgentOnce = tool({
  name: "retrieve_chunks_and_call_quiz_builder_agent_once",
  description:
    "Performs a highly targeted semantic similarity search to retrieve the most relevant document " +
    "chunks for a specific topic or query within a conversation. It then passes these chunks to the quiz-builder " +
    "agent to generate focused questions. " +
    "Use this tool ONLY when the user asks for a quiz on a specific subject, concept, or section of their uploaded documents.",
  parameters: z.object({
    conversationId: z.string().describe("The conversation/session ID used to scope the search to the user's uploaded documents."),
    query: z.string().describe("The topic or subject to search for within the documents (e.g. 'photosynthesis', 'World War II causes')."),
    topK: z.number().int().min(1).max(20).default(5).describe("Number of top relevant chunks to retrieve. Defaults to 5."),
    userRequest: z.string().optional().describe("The user's original request or prompt, indicating the desired number of questions or specific constraints."),
  }),
  execute: async ({ conversationId, query, topK, userRequest }): Promise<QuestionOutputType> => {
    // ── 1. Semantic similarity search scoped to this conversation ─────────
    const vectorStore = await getVectorStore(conversationId);

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

    const userInstructions = userRequest ? `\n\nUSER REQUEST/CONSTRAINTS:\n"${userRequest}"\nPlease ensure you follow the user's request (e.g. if they asked for exactly 30 questions, you must provide exactly 30 questions).` : "";

    const prompt =
      `You are generating quiz questions from the following relevant document excerpts ` +
      `(retrieved for the topic: "${query}"):\n\n${context}${userInstructions}`;

    // ── 3. Call quizBuilderAgent exactly once with the combined context ────
    const result = await run(quizBuilderAgent, prompt);

    return result.finalOutput as QuestionOutputType;
  },
});

export default retrieveChunksAndCallQuizBuilderAgentOnce;
