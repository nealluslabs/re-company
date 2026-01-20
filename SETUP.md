# Real Estate SaaS MVP - Setup Guide

This guide will walk you through setting up the Real Estate SaaS MVP application.

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is sufficient)
- Google Cloud Platform account (for Google Maps API, Drive API, Calendar API)
- npm or yarn package manager

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: Enable Google Sign-In provider
   - **Firestore Database**: Create in production mode (we'll set rules later)
   - **Realtime Database**: Create a new database (choose your region)
   - **Cloud Functions**: Enable (requires Blaze plan - pay as you go)

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (`</>`)
   - Copy the Firebase configuration values

## Step 2: Google Cloud Platform Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your Firebase project
3. Enable the following APIs:
   - **Google Maps JavaScript API**
   - **Google Drive API**
   - **Google Calendar API**

4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Create an **API Key** for Google Maps (restrict it to your domain in production)
   - Create an **OAuth 2.0 Client ID** for web application
     - Add authorized redirect URIs:
       - `http://localhost:3000` (for development)
       - Your production domain

5. Create a Service Account (for Cloud Functions):
   - Go to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Grant roles: "Firebase Admin SDK Administrator Service Agent"
   - Create a key (JSON) and download it

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Admin SDK (from Service Account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` should include the `\n` characters as shown
- Never commit `.env.local` to version control (it's already in `.gitignore`)

## Step 5: Firebase Security Rules

Deploy the security rules:

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy rules
firebase deploy --only firestore:rules,database:rules
```

Or manually set them in Firebase Console:

### Firestore Rules
Go to Firestore Database > Rules and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        (resource.data.agentId == request.auth.uid || 
         request.resource.data.agentId == request.auth.uid);
    }
    match /listings/{listingId} {
      allow read, write: if request.auth != null && 
        (resource.data.agentId == request.auth.uid || 
         request.resource.data.agentId == request.auth.uid);
    }
    match /showings/{showingId} {
      allow read, write: if request.auth != null && 
        (resource.data.agentId == request.auth.uid || 
         request.resource.data.agentId == request.auth.uid);
    }
    match /documents/{documentId} {
      allow read, write: if request.auth != null && 
        (resource.data.agentId == request.auth.uid || 
         request.resource.data.agentId == request.auth.uid);
    }
  }
}
```

### Realtime Database Rules
Go to Realtime Database > Rules and paste:
```json
{
  "rules": {
    "active_showings": {
      "$agentId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $agentId"
      }
    }
  }
}
```

## Step 6: Deploy Cloud Functions

```bash
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions
```

## Step 7: Firestore Indexes

The app requires composite indexes. Firebase will prompt you to create them when you first run queries, or you can create them manually:

1. Go to Firestore Database > Indexes
2. Create the following composite indexes:
   - Collection: `showings`
     - Fields: `agentId` (Ascending), `startTime` (Ascending)
   - Collection: `clients`
     - Fields: `agentId` (Ascending), `createdAt` (Descending)
   - Collection: `documents`
     - Fields: `agentId` (Ascending), `createdAt` (Descending)

Or deploy them using:
```bash
firebase deploy --only firestore:indexes
```

## Step 8: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 9: First-Time Setup

1. **Sign In**: Click "Sign in with Google" and grant permissions for:
   - Drive API access
   - Calendar API access

2. **Create a Client**: Go to the Documents tab and click "Add New Client"

3. **Create a Google Calendar Event**: 
   - In your Google Calendar, create an event with "SHOWING" in the title
   - Go to the Scheduling tab and click "Sync Google Calendar"

4. **Test Live Tracking**:
   - Go to Live Tracker tab
   - Select a showing
   - Click "Start Showing Mode"
   - Grant location permissions when prompted

## Troubleshooting

### "Google access token not found"
- Sign out and sign back in to refresh the OAuth token
- Make sure you granted all required permissions during sign-in

### "Firebase Admin credentials not configured"
- Check that `FIREBASE_PRIVATE_KEY` in `.env.local` includes the `\n` characters
- Verify the service account email matches your Firebase project

### Maps not loading
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Check that Google Maps JavaScript API is enabled in Google Cloud Console
- Verify API key restrictions allow your domain

### Calendar sync not working
- Ensure Google Calendar API is enabled
- Check that events contain "SHOWING" in the title
- Verify OAuth scopes include `calendar.events`

### Drive folder creation fails
- Ensure Google Drive API is enabled
- Verify OAuth scopes include `drive.file`
- Check that the user has granted Drive permissions

## Data Architecture

### Firestore Collections

- **users**: Agent profiles and Google access tokens
- **clients**: Client information and Drive folder links
- **listings**: Property listings
- **showings**: Showing events synced from Google Calendar
- **documents**: Document metadata and Drive file links

### Realtime Database Structure

```
active_showings/
  {agentId}/
    latitude: number
    longitude: number
    timestamp: number
    showingId: string
```

## Production Deployment

1. **Deploy to Vercel** (recommended for Next.js):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Update Environment Variables** in Vercel dashboard

3. **Update OAuth Redirect URIs** in Google Cloud Console to include your production domain

4. **Deploy Cloud Functions**:
   ```bash
   firebase deploy --only functions
   ```

5. **Update API Key Restrictions** in Google Cloud Console to include your production domain

## Support

For issues or questions, please refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google APIs Documentation](https://developers.google.com/apis)

