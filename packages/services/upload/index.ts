import { v2 as cloudinary } from "cloudinary";
import { GetUploadSignatureInput, UploadSignatureResult } from "./model";
import { env } from "../env";
/**
 * UploadService — Cloudinary signed-upload helper.
 *
 * Flow:
 *   1. Client calls `getSignature` tRPC mutation with file metadata.
 *   2. Server returns signature + upload URL (this class).
 *   3. Client uploads the file directly to Cloudinary — no bytes hit our server.
 *   4. Client saves the returned `secure_url` / `public_id` in the quiz store.
 */
export default class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Generate a short-lived Cloudinary signature.
   * The timestamp + params are exactly what Cloudinary validates on upload.
   */
  getUploadSignature(input: GetUploadSignatureInput): UploadSignatureResult {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Only params that are signed must be in this object
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder: input.folder,
    };

    if (input.publicId) {
      paramsToSign.public_id = input.publicId;
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return {
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder: input.folder,
      publicId: input.publicId,
      // e.g. https://api.cloudinary.com/v1_1/<cloud>/image/upload
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${input.resourceType}/upload`,
    };
  }
}
