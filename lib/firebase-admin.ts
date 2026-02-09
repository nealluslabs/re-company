// Firebase Admin SDK initialization for server-side use
// This should only be used in API routes and Cloud Functions

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

if (getApps().length === 0) {
  // Check if we're in a Cloud Functions environment
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    // Cloud Functions automatically initializes Firebase Admin
    adminApp = initializeApp();
  } else {
    // For Next.js API routes, use service account
    if (
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL &&
      process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
    ) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      throw new Error('Firebase Admin credentials not configured');
    }
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export default adminApp;

