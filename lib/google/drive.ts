import { google } from 'googleapis';

// This will be used in Cloud Functions
// For client-side, we'll use a different approach via API routes

export interface DriveFolder {
  id: string;
  name: string;
  webViewLink: string;
}

export interface DriveFile {
  id: string;
  name: string;
  webViewLink: string;
  mimeType: string;
}

/**
 * Create a folder in Google Drive
 * This should be called from a Cloud Function or API route with proper authentication
 */
export const createDriveFolder = async (
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFolder> => {
  const drive = google.drive({ version: 'v3', auth: new google.auth.OAuth2() });
  drive.setCredentials({ access_token: accessToken });

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentFolderId && { parents: [parentFolderId] }),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  return {
    id: response.data.id!,
    name: response.data.name!,
    webViewLink: response.data.webViewLink!,
  };
};

/**
 * Upload a file to Google Drive
 */
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  fileContent: Buffer | Uint8Array,
  mimeType: string,
  folderId?: string
): Promise<DriveFile> => {
  const drive = google.drive({ version: 'v3', auth: new google.auth.OAuth2() });
  drive.setCredentials({ access_token: accessToken });

  const fileMetadata = {
    name: fileName,
    ...(folderId && { parents: [folderId] }),
  };

  const media = {
    mimeType,
    body: fileContent,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink, mimeType',
  });

  return {
    id: response.data.id!,
    name: response.data.name!,
    webViewLink: response.data.webViewLink!,
    mimeType: response.data.mimeType!,
  };
};

/**
 * Get file download URL (for PDFs)
 */
export const getFileDownloadUrl = async (
  accessToken: string,
  fileId: string
): Promise<string> => {
  const drive = google.drive({ version: 'v3', auth: new google.auth.OAuth2() });
  drive.setCredentials({ access_token: accessToken });

  const response = await drive.files.get({
    fileId,
    alt: 'media',
  });

  // For direct download, use the export endpoint for Google Docs or get for regular files
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
};

