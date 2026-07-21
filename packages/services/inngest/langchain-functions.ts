import { realtime } from "inngest";
import { z } from "zod";
import { inngest } from "./client";
import loadAnyDocument from "../agent/quizBuilderAgent/langchain/docloader";
import { chunkAndTagDocuments } from "../agent/quizBuilderAgent/langchain/splitter";
import { getVectorStore } from "../agent/quizBuilderAgent/langchain/vectorStore";
import fs from "fs";
import path from "path";
import os from "os";

export const documentChannel = realtime.channel({
  name: ({ documentId }: { documentId: string }) => `document:${documentId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.enum(["uploaded", "processing", "ready", "failed"]),
        stage: z
          .enum(["downloading", "chunking", "embedding", "storing", "done"])
          .optional(),
        progress: z
          .object({
            totalChunks: z.number(),
            embeddedChunks: z.number(),
          })
          .optional(),
        error: z.string().optional(),
        timestamp: z.string().default(() => new Date().toISOString()),
      }),
    },
  },
});

interface ingestDocumentEventData {
  documentId: string;
  fileUrl: string;
  conversationId: string;
}

const ingestDocument = inngest.createFunction(
  {
    id: "ingest-document",
    triggers: {
      event: "document/uploaded",
    },
  },
  async ({ event, step }) => {
    const { documentId, fileUrl, conversationId } =
      event.data as ingestDocumentEventData;

    const ch = documentChannel({ documentId });

    await step.realtime.publish("document-processing", ch.status, {
      status: "processing",
      stage: "downloading",
    });

    try {
      
      const localSource = await step.run("download-file", async () => {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to download file (HTTP ${response.status}): ${fileUrl}`,
          );
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        // Detect extension from the URL path (strips query-string params)
        const ext =
          path.extname(new URL(fileUrl).pathname).toLowerCase() || ".bin";
        const tmpPath = path.join(os.tmpdir(), `ingest-${documentId}${ext}`);

        fs.writeFileSync(tmpPath, buffer);
        return tmpPath;
      });

      await step.realtime.publish("document-chunking", ch.status, {
        status: "processing",
        stage: "chunking",
      });

      
      const rawDocs = await step.run("load-document", async () => {
        try {
          return await loadAnyDocument(localSource);
        } finally {
          // Best-effort cleanup — temp file is no longer needed after loading
          try {
            fs.unlinkSync(localSource);
          } catch {
            // ignore — OS will clean it up eventually
          }
        }
      });

      
      const taggedChunks = await step.run("chunk-and-tag", async () => {
        return chunkAndTagDocuments(rawDocs, { conversationId });
      });

      await step.realtime.publish("document-embedding", ch.status, {
        status: "processing",
        stage: "embedding",
        progress: { totalChunks: taggedChunks.length, embeddedChunks: 0 },
      });

      
      const result = await step.run("store-embeddings", async () => {
        const vectorStore = await getVectorStore();
        const ids = await vectorStore.addDocuments(taggedChunks);
        return { chunkCount: taggedChunks.length, ids };
      });

      await step.realtime.publish("document-ready", ch.status, {
        status: "ready",
        stage: "done",
        progress: {
          totalChunks: result.chunkCount,
          embeddedChunks: result.chunkCount,
        },
      });

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      await step.realtime.publish("document-failed", ch.status, {
        status: "failed",
        error: message,
      });

      throw error;
    }
  },
);
const langchainFunctions = [ingestDocument];
export default langchainFunctions;
