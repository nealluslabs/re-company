import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

admin.initializeApp();

/**
 * Scheduled function to sync Google Calendar events to Firestore
 * Runs every hour
 */
export const syncCalendarShowings = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    
    // Get all users with Google access tokens
    const usersSnapshot = await db.collection('users')
      .where('googleAccessToken', '!=', null)
      .get();

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      const accessToken = userData.googleAccessToken;

      if (!accessToken) continue;

      try {
        // Fetch showing events from Google Calendar
        const calendar = google.calendar({ version: 'v3', auth: new google.auth.OAuth2() });
        calendar.setCredentials({ access_token: accessToken });

        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const response = await calendar.events.list({
          calendarId: 'primary',
          timeMin: now.toISOString(),
          timeMax: oneWeekFromNow.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          q: 'SHOWING',
        });

        const events = response.data.items || [];

        // Sync each event to Firestore
        for (const event of events) {
          if (!event.summary?.toUpperCase().includes('SHOWING')) continue;

          const calendarEventId = event.id!;
          
          // Check if showing already exists
          const existingQuery = await db.collection('showings')
            .where('agentId', '==', userId)
            .where('calendarEventId', '==', calendarEventId)
            .get();

          const showingData = {
            agentId: userId,
            calendarEventId,
            title: event.summary || '',
            description: event.description || '',
            startTime: admin.firestore.Timestamp.fromDate(
              new Date(event.start?.dateTime || event.start?.date || '')
            ),
            endTime: admin.firestore.Timestamp.fromDate(
              new Date(event.end?.dateTime || event.end?.date || '')
            ),
            location: event.location || '',
            status: 'scheduled' as const,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          if (existingQuery.empty) {
            // Create new showing
            await db.collection('showings').add({
              ...showingData,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            // Update existing showing
            await existingQuery.docs[0].ref.update(showingData);
          }
        }

        console.log(`Synced ${events.length} events for user ${userId}`);
      } catch (error) {
        console.error(`Error syncing calendar for user ${userId}:`, error);
      }
    }

    return null;
  });

/**
 * HTTP function to create a Google Drive folder
 */
export const createDriveFolder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { folderName, parentFolderId } = data;
  const userId = context.auth.uid;

  if (!folderName) {
    throw new functions.https.HttpsError('invalid-argument', 'Folder name is required');
  }

  // Get user's Google access token
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData?.googleAccessToken) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Google access token not found. Please re-authenticate.'
    );
  }

  // Create folder in Google Drive
  const drive = google.drive({ version: 'v3', auth: new google.auth.OAuth2() });
  drive.setCredentials({ access_token: userData.googleAccessToken });

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
    id: response.data.id,
    name: response.data.name,
    webViewLink: response.data.webViewLink,
  };
});

