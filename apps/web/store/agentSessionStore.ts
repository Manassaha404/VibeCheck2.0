import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DocumentUploadStatus =
  "idle" | "uploading" | "indexing" | "ready" | "error";

export interface AgentSessionStore {
  /** The conversationId returned by Qdrant after a successful document upload.
   *  Null until at least one document has been indexed for this session. */
  conversationId: string | null;

  /** Whether at least one document has been successfully indexed (ready). */
  hasUploadedDocument: boolean;

  /** Names of all files successfully uploaded in this session. */
  uploadedFileNames: string[];

  /** Current upload pipeline status — mirrors useAgentFileUploadPipeline. */
  uploadStatus: DocumentUploadStatus;

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Called by the upload pipeline when a document has been indexed. */
  setDocumentReady: (conversationId: string, fileName: string) => void;

  /** Set the conversation id manually. */
  setConversationId: (conversationId: string) => void;

  /** Called when the pipeline starts uploading. */
  setUploadStatus: (status: DocumentUploadStatus) => void;

  /** Reset the entire session (e.g. when quiz changes). */
  resetSession: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAgentSessionStore = create<AgentSessionStore>()((set) => ({
  conversationId: null,
  hasUploadedDocument: false,
  uploadedFileNames: [],
  uploadStatus: "idle",

  setDocumentReady: (conversationId, fileName) =>
    set((s) => ({
      conversationId,
      hasUploadedDocument: true,
      uploadStatus: "ready",
      uploadedFileNames: s.uploadedFileNames.includes(fileName)
        ? s.uploadedFileNames
        : [...s.uploadedFileNames, fileName],
    })),

  setUploadStatus: (status) => set({ uploadStatus: status }),

  setConversationId: (id) => set({ conversationId: id }),

  resetSession: () =>
    set({
      conversationId: null,
      hasUploadedDocument: false,
      uploadedFileNames: [],
      uploadStatus: "idle",
    }),
}));
