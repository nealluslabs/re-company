# Real Estate SaaS MVP - Architecture Documentation

## Overview

This Real Estate SaaS MVP is built with Next.js 14, Firebase, and Google APIs. It provides real-time agent tracking, document management with Google Drive integration, and scheduling via Google Calendar.

## Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication (Google Provider)
- **Database**: 
  - Firestore (metadata, documents, showings)
  - Realtime Database (live GPS coordinates)
- **APIs**: Google Maps, Google Drive, Google Calendar
- **PDF Processing**: pdf-lib, react-signature-canvas
- **Backend**: Firebase Cloud Functions (Node.js)

## Data Architecture

### Firestore Collections

#### `users`
Stores agent profiles and authentication tokens.

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  googleDriveFolderId?: string;      // Root folder for agent's files
  googleDriveFolderLink?: string;
  googleAccessToken?: string;         // OAuth access token (short-lived)
  createdAt: Date;
  updatedAt: Date;
}
```

**Security**: Users can only read/write their own document.

#### `clients`
Stores client information and associated Google Drive folders.

```typescript
{
  id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  googleDriveFolderId?: string;      // Client-specific Drive folder
  googleDriveFolderLink?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Security**: Agents can only access clients they created.

#### `listings`
Property listings managed by agents.

```typescript
{
  id: string;
  agentId: string;
  clientId?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  status: 'active' | 'pending' | 'sold' | 'off-market';
  createdAt: Date;
  updatedAt: Date;
}
```

#### `showings`
Showing events synced from Google Calendar.

```typescript
{
  id: string;
  agentId: string;
  listingId?: string;
  clientId?: string;
  calendarEventId: string;            // Google Calendar event ID
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes Required**:
- `agentId` (Ascending) + `startTime` (Ascending)

#### `documents`
Document metadata and Google Drive file references.

```typescript
{
  id: string;
  agentId: string;
  clientId?: string;
  listingId?: string;
  showingId?: string;
  name: string;
  type: 'contract' | 'disclosure' | 'inspection' | 'other';
  status: 'draft' | 'sent' | 'signed';
  googleDriveFileId?: string;         // Original document
  googleDriveFileLink?: string;
  signedPdfDriveFileId?: string;       // Signed PDF version
  signedPdfDriveFileLink?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Realtime Database Structure

```
active_showings/
  {agentId}/
    agentId: string
    showingId: string
    latitude: number
    longitude: number
    timestamp: number
```

**Security**: Agents can only write to their own path, but can read all active showings.

## Authentication Flow

1. User clicks "Sign in with Google"
2. Firebase Auth handles OAuth popup with scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/calendar.events`
3. On successful sign-in:
   - User document created/updated in Firestore
   - Google OAuth access token stored in user document
   - Token used for subsequent API calls

**Note**: In production, implement token refresh logic as access tokens expire. Consider using Firebase Extensions or Cloud Functions to handle token refresh.

## Feature Implementation

### 1. Live Agent Tracker

**Technology**: Firebase Realtime Database + Google Maps JS SDK

**Flow**:
1. Agent selects a showing and clicks "Start Showing Mode"
2. Browser requests geolocation permission
3. `navigator.geolocation.watchPosition` starts tracking
4. Location updates pushed to `/active_showings/{agentId}` every few seconds
5. All agents subscribe to `active_showings` node
6. Google Maps displays markers for all active agents

**Key Functions**:
- `startShowingMode()`: Initialize location tracking
- `updateShowingLocation()`: Push GPS updates
- `stopShowingMode()`: Clean up tracking
- `subscribeToActiveShowings()`: Real-time listener for all agents

### 2. Document Management

**Technology**: Firestore + Google Drive API + pdf-lib + react-signature-canvas

**Flow**:
1. Agent creates a client → API route creates Google Drive folder
2. Agent creates a document → Stored in Firestore
3. Agent clicks "Sign Document":
   - Signature captured via canvas
   - PDF loaded (from Drive or generated)
   - Signature merged into PDF using pdf-lib
   - Signed PDF uploaded to Drive
   - Document status updated to "signed"

**API Routes**:
- `POST /api/drive/create-folder`: Creates Drive folder
- `POST /api/drive/upload-pdf`: Uploads signed PDF

**Key Functions**:
- `createDriveFolder()`: Creates folder in user's Drive
- `uploadFileToDrive()`: Uploads file to Drive
- `mergeSignatureIntoPdf()`: Merges signature image into PDF

### 3. Scheduling

**Technology**: Firestore + Google Calendar API + Cloud Functions

**Flow**:
1. Agent clicks "Sync Google Calendar"
2. API route (`/api/calendar/sync`) fetches events from Calendar API
3. Filters events containing "SHOWING" in title
4. Creates/updates showing documents in Firestore
5. Agent can check in/out of showings
6. Cloud Function runs hourly to auto-sync

**Cloud Function**: `syncCalendarShowings`
- Scheduled: Every hour
- Fetches calendar events for all users
- Syncs to Firestore

**API Routes**:
- `POST /api/calendar/sync`: Manual sync trigger

## Security Considerations

### Firestore Rules
- Users can only access their own data
- All queries filtered by `agentId`
- Write operations verify `agentId` matches authenticated user

### Realtime Database Rules
- Agents can write only to their own path
- All agents can read all active showings (for map display)

### API Routes
- All routes verify Firebase ID token
- Google access tokens stored in Firestore (encrypted in production)
- API routes use Firebase Admin SDK for server-side operations

### OAuth Scopes
- Minimal scopes requested:
  - `drive.file`: Access to files created by the app
  - `calendar.events`: Read calendar events

## Performance Optimizations

1. **Realtime Database for GPS**: Lower latency than Firestore for high-frequency updates
2. **Composite Indexes**: Pre-defined indexes for common queries
3. **Client-Side Filtering**: Calendar events filtered client-side after fetch
4. **Lazy Loading**: Components load data on-demand

## Scalability Considerations

1. **Realtime Database**: Consider sharding if >1000 concurrent agents
2. **Cloud Functions**: Auto-scales with usage
3. **Firestore**: Queries limited to single agent (scales horizontally)
4. **Google APIs**: Rate limits apply (implement retry logic)

## Future Enhancements

1. **Token Refresh**: Implement automatic OAuth token refresh
2. **Offline Support**: Add Firestore offline persistence
3. **Push Notifications**: Notify agents of new showings
4. **Analytics**: Track showing completion rates
5. **Multi-User Support**: Allow team collaboration
6. **Mobile App**: React Native version for field agents

## Deployment Checklist

- [ ] Set up Firebase project
- [ ] Configure Google Cloud APIs
- [ ] Set environment variables
- [ ] Deploy Firestore rules
- [ ] Deploy Realtime Database rules
- [ ] Create Firestore indexes
- [ ] Deploy Cloud Functions
- [ ] Configure OAuth redirect URIs
- [ ] Set up API key restrictions
- [ ] Test authentication flow
- [ ] Test calendar sync
- [ ] Test Drive integration
- [ ] Test live tracking

## Monitoring

Monitor the following metrics:
- Cloud Function execution time
- Firestore read/write operations
- Realtime Database connections
- Google API quota usage
- Error rates in API routes

Use Firebase Console and Google Cloud Console for monitoring.

