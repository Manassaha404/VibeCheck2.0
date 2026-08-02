//perfectly fine
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { Document } from "@langchain/core/documents";

interface IngestOptions {
  conversationId: string;
}

export async function chunkAndTagDocuments(
  rawDocs: Document[],
  opts: IngestOptions,
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(rawDocs);

  return chunks.map(
    (chunk, i) =>
      new Document({
        pageContent: chunk.pageContent,
        metadata: {
          ...chunk.metadata,
          conversationId: opts.conversationId,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      }),
  );
}
