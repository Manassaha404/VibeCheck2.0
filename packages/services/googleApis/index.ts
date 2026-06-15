import { google } from "googleapis";
import { env } from "../env";
import { decrypt } from "../utils/encryption";
import stream from "node:stream";

export class GoogleDriveService {
  private getOAuth2Client(encryptedRefreshToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_CALLBACK_URL 
    );

    const refreshToken = decrypt(encryptedRefreshToken);
    
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    return oauth2Client;
  }

  public async getDriveClient(encryptedRefreshToken: string) {
    const auth = this.getOAuth2Client(encryptedRefreshToken);
    return google.drive({ version: "v3", auth });
  }

  public async createFormFolder(encryptedRefreshToken: string, slug: string): Promise<string> {
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
      throw new Error("Failed to create folder");
    }

    return res.data.id;
  }


  //review needed, optimization needed
  public async uploadFileToFolder(
    encryptedRefreshToken: string, 
    folderId: string, 
    file: { name: string, mimeType: string, buffer: Buffer }
  ): Promise<string> {
    const drive = await this.getDriveClient(encryptedRefreshToken);
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimeType,
        body: bufferStream,
      },
      fields: "id",
    });

    if (!res.data.id) {
      throw new Error("Failed to upload file");
    }

    return res.data.id;
  }
}

export const googleDriveService = new GoogleDriveService();
