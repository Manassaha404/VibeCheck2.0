import { google } from "googleapis";
import { env } from "../env";
import { decrypt } from "../utils/encryption";
import { AppError } from "@repo/error";

export class GoogleDriveService {
  private getOAuth2Client(encryptedRefreshToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_CALLBACK_URL,
    );

    const refreshToken = decrypt(encryptedRefreshToken);

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    return oauth2Client;
  }

  public async getDriveClient(encryptedRefreshToken: string) {
    const auth = this.getOAuth2Client(encryptedRefreshToken);
    return google.drive({ version: "v3", auth });
  }

  public async createFormFolder(
    encryptedRefreshToken: string,
    slug: string,
  ): Promise<string> {
    const drive = await this.getDriveClient(encryptedRefreshToken);

    const fileMetadata = {
      name: slug,
      mimeType: "application/vnd.google-apps.folder",
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    if (!res.data.id) {
      throw new AppError("INTERNAL_SERVER_ERROR","Failed to create folder");
    }

    return res.data.id;
  }

  

  public async getResumableUploadUrl(
    encryptedRefreshToken: string,
    folderId: string,
    file: { name: string; mimeType: string; sizeInBytes: number },
  ): Promise<string> {
    
    const auth = this.getOAuth2Client(encryptedRefreshToken);
    const tokenResponse = await auth.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Could not obtain Google access token");
    }

    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Type": file.mimeType,
          "X-Upload-Content-Length": file.sizeInBytes.toString(),
          "Origin": process.env.FRONTEND_URL || "http://localhost:3000",
        },
        body: JSON.stringify(metadata),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        `Google Drive responded with ${response.status}: ${errorText}`,
      );
    }

    const uploadUrl = response.headers.get("location");

    if (!uploadUrl) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Google did not return a resumable upload URL");
    }

    return uploadUrl;
  }

  public async deleteFile(encryptedRefreshToken: string, fileId: string): Promise<boolean> {
    try {
      const drive = await this.getDriveClient(encryptedRefreshToken);
      await drive.files.delete({
        fileId,
      });
      return true;
    } catch (error: any) {
      if (error.code === 404 || error.status === 404) {
        // File already deleted or doesn't exist
        return true;
      }
      console.error("Google Drive deleteFile error:", error);
      throw new AppError("INTERNAL_SERVER_ERROR", "Failed to delete file from Google Drive");
    }
  }
}

export const googleDriveService = new GoogleDriveService();
