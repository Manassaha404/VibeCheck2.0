import { useState } from "react";
import { trpc } from "@/trpc/client";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const uploadUrlMutation = trpc.form.getResumableUploadUrl.useMutation();
  const deleteFileMutation = trpc.form.deleteFile.useMutation();
  const utils = trpc.useUtils();

  const uploadFile = async (
    formId: string,
    file: File,
    primaryFieldValue?: string,
  ): Promise<string> => {
    setIsUploading(true);
    try {
      console.log(primaryFieldValue);
      
      const uploadName = primaryFieldValue ? `${primaryFieldValue}` : file.name;

      const res = await uploadUrlMutation.mutateAsync({
        formId,
        file: {
          name: uploadName,
          mimeType: file.type || "application/octet-stream",
          sizeInBytes: file.size,
        },
      });

      const uploadUrl = res?.uploadUrl;

      if (!uploadUrl) throw new Error("No upload URL returned");

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload to Google Drive");
      }

      const data = await response.json().catch(() => null);
      if (data && data.id) {
        return data.id;
      }
      
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPrimaryFieldValue = async (
    formId: string,
    primaryFieldId?: string,
  ): Promise<string | undefined> => {
    if (!primaryFieldId) return undefined;

    try {
      // First try to get it synchronously from cache (updated by useAgentChat)
      let session = utils.agent.respondentAgentGetSession.getData({ formId });
      if (!session) {
        session = await utils.agent.respondentAgentGetSession.fetch({ formId });
      }
      
      console.log(session);
      const answer = session?.collectedAnswers?.find(
        (a: any) => a.fieldId === primaryFieldId,
      );

      if (answer) {
        console.log(answer);
        return String(answer.value);
      }
    } catch (error) {
      console.error("Failed to fetch primary field value:", error);
    }

    return undefined;
  };

  const fetchRespondentSession = async (formId: string) => {
    let session = utils.agent.respondentAgentGetSession.getData({ formId });
    if (!session) {
      session = await utils.agent.respondentAgentGetSession.fetch({ formId });
    }
    return session;
  };

  const deleteExistingFile = async (formId: string, fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync({ formId, fileId });
      return true;
    } catch (error) {
      console.error("Failed to delete existing file:", error);
      return false;
    }
  };

  return { uploadFile, isUploading, fetchPrimaryFieldValue, fetchRespondentSession, deleteExistingFile };
}
