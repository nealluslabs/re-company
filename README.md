# Real Estate SaaS MVP

A comprehensive Real Estate SaaS application built with Next.js 14, Firebase, and Google APIs.

## Features

- **Live Agent Tracker**: Real-time GPS tracking using Firebase Realtime Database and Google Maps
- **Document Management**: Google Drive integration with signature capture and PDF merging
- **Scheduling**: Google Calendar integration for showing management
- **Authentication**: Firebase Auth with Google Provider

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

3. Run the development server:
```bash
npm run dev
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Google Provider
3. Create a Firestore database
4. Create a Realtime Database
5. Set up Cloud Functions (see `functions/` directory)

## Data Architecture

### Firestore Collections

- `users`: Agent profiles and Google Drive folder IDs
- `clients`: Client information and associated Drive folders
- `listings`: Property listings
- `showings`: Showing events synced from Google Calendar
- `documents`: Document metadata and Drive file IDs

### Realtime Database Structure

```
active_showings/
  {agentId}/
    latitude: number
    longitude: number
    timestamp: number
    showingId: string
```

