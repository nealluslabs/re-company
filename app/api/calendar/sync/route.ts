export const runtime = 'nodejs'; // Forces Vercel to use the full Node.js environment
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { fetchShowingEvents, calendarEventToShowing } from '@/lib/google/calendar';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the Firebase token
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get Google access token from Firestore (stored during OAuth)
    // In production, you'd store this securely after OAuth flow
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData?.googleAccessToken) {
      return NextResponse.json(
        { error: 'Google access token not found. Please re-authenticate.' },
        { status: 400 }
      );
    }

    // Fetch events from Google Calendar
    const events = await fetchShowingEvents(userData.googleAccessToken);

    // Sync events to Firestore
    const showingsRef = adminDb.collection('showings');
    const syncedShowings = [];

    for (const event of events) {
      // Check if showing already exists
      const existingQuery = await showingsRef
        .where('agentId', '==', userId)
        .where('calendarEventId', '==', event.id)
        .get();

      if (existingQuery.empty) {
        // Create new showing
        const showingData = calendarEventToShowing(event, userId);
        const showingRef = showingsRef.doc();
        await showingRef.set({
          ...showingData,
          id: showingRef.id,
          startTime: new Date(showingData.startTime),
          endTime: new Date(showingData.endTime),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        syncedShowings.push(showingRef.id);
      } else {
        // Update existing showing
        const existingDoc = existingQuery.docs[0];
        await existingDoc.ref.update({
          title: event.summary,
          description: event.description,
          startTime: new Date(event.start.dateTime),
          endTime: new Date(event.end.dateTime),
          location: event.location || '',
          updatedAt: new Date(),
        });
        syncedShowings.push(existingDoc.id);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedShowings.length,
      showings: syncedShowings,
    });
  } catch (error: any) {
    console.error('Error syncing calendar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync calendar' },
      { status: 500 }
    );
  }
}

