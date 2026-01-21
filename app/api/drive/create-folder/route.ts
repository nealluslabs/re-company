export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { createDriveFolder } from '@/lib/google/drive';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { folderName, clientId } = await request.json();

    if (!folderName) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
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

    // Create folder in Google Drive
    const folder = await createDriveFolder(
      userData.googleAccessToken,
      folderName,
      userData.googleDriveFolderId // Parent folder (optional)
    );

    // Update client document with folder info
    if (clientId) {
      await adminDb.collection('clients').doc(clientId).update({
        googleDriveFolderId: folder.id,
        googleDriveFolderLink: folder.webViewLink,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      folder: {
        id: folder.id,
        name: folder.name,
        webViewLink: folder.webViewLink,
      },
    });
  } catch (error: any) {
    console.error('Error creating Drive folder:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Drive folder' },
      { status: 500 }
    );
  }
}

