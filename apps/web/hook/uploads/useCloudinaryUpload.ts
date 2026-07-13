"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/trpc/client";
import type { CloudinaryUploadResult } from "@repo/services/upload/model";

export type UploadStatus = "idle" | "signing" | "uploading" | "done" | "error";

export interface UseCloudinaryUploadReturn {
  upload: (
    file: File,
    folder?: string,
  ) => Promise<CloudinaryUploadResult | null>;
  status: UploadStatus;
  progress: number;
  error: string | null;
  reset: () => void;
}

/**
 * useCloudinaryUpload — client-side hook for the direct upload flow.
 *
 * 1. Calls trpc.upload.getSignature to get a Cloudinary signature from our server.
 * 2. POSTs the file directly to Cloudinary using that signature (XHR for progress).
 * 3. Returns the resulting URL/publicId so the caller can store it in state/store.
 */
export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getSignature = trpc.upload.getSignature.useMutation();

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (
      file: File,
      folder = "quiz_media",
    ): Promise<CloudinaryUploadResult | null> => {
      try {
        setStatus("signing");
        setProgress(0);
        setError(null);

        // Step 1: get signature from our server
        const auth = await getSignature.mutateAsync({
          folder,
          resourceType: file.type.startsWith("video/") ? "video" : "image",
        });

        if (!auth) {
          throw new Error("Failed to get upload signature from server");
        }

        // Step 2: POST directly to Cloudinary using XHR so we can track progress
        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", auth.apiKey);
        formData.append("timestamp", String(auth.timestamp));
        formData.append("signature", auth.signature);
        formData.append("folder", auth.folder);
        if (auth.publicId) formData.append("public_id", auth.publicId);

        const result = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
              if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
              }
            });

            xhr.addEventListener("load", () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve({
                  publicId: data.public_id,
                  secureUrl: data.secure_url,
                  url: data.url,
                  format: data.format,
                  width: data.width,
                  height: data.height,
                  resourceType: data.resource_type,
                  bytes: data.bytes,
                  thumbnailUrl: data.thumbnail_url,
                });
              } else {
                reject(
                  new Error(`Cloudinary upload failed: ${xhr.statusText}`),
                );
              }
            });

            xhr.addEventListener("error", () =>
              reject(new Error("Network error during upload")),
            );
            xhr.addEventListener("abort", () =>
              reject(new Error("Upload aborted")),
            );

            xhr.open("POST", auth.uploadUrl);
            xhr.send(formData);
          },
        );

        setStatus("done");
        setProgress(100);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setStatus("error");
        setError(message);
        return null;
      }
    },
    [getSignature],
  );

  return { upload, status, progress, error, reset };
}
