//perfectly fine
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});

export interface EmbeddedDocument {
  pageContent: string;
  metadata: Record<string, any>;
  embedding: number[];
}


async function embedDocuments(
  docs: Document[]
): Promise<EmbeddedDocument[]> {
  const texts = docs.map((doc) => doc.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  return docs.map((doc, i) => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata,
    embedding: vectors[i]!,
  }));
}

async function embedQuery(query: string): Promise<number[]> {
  return embeddings.embedQuery(query);
}

export { embedDocuments, embedQuery, embeddings };