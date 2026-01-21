export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { uploadFileToDrive } from '@/lib/google/drive';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folderId = formData.get('folderId') as string | null;
    const documentId = formData.get('documentId') as string | null;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'File and file name are required' },
        { status: 400 }
      );
    }

    // Get Google access token
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.googleAccessToken) {
      return NextResponse.json(
        { error: 'Google access token not found. Please re-authenticate.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Google Drive
    const driveFile = await uploadFileToDrive(
      userData.googleAccessToken,
      fileName,
      buffer,
      'application/pdf',
      folderId || undefined
    );

    // Update document if documentId provided
    if (documentId) {
      await adminDb.collection('documents').doc(documentId).update({
        signedPdfDriveFileId: driveFile.id,
        signedPdfDriveFileLink: driveFile.webViewLink,
        status: 'signed',
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      file: {
        id: driveFile.id,
        name: driveFile.name,
        webViewLink: driveFile.webViewLink,
      },
    });
  } catch (error: any) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload PDF' },
      { status: 500 }
    );
  }
}

