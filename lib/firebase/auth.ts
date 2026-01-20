import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  OAuthProvider
} from 'firebase/auth';
import { auth } from './config';

// Google OAuth Provider with additional scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

export const signInWithGoogle = async (): Promise<{ user: FirebaseUser; accessToken: string | null }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Get the OAuth credential to extract access token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    
    // Store access token in Firestore (via API route or directly)
    if (accessToken && result.user) {
      try {
        // Store token in user document
        const { createUser, updateUser, getUser } = await import('./firestore');
        const existingUser = await getUser(result.user.uid);
        
        const userData = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || undefined,
          googleAccessToken: accessToken, // Store token securely
        };
        
        if (existingUser) {
          await updateUser(result.user.uid, userData);
        } else {
          await createUser(userData);
        }
      } catch (error) {
        console.error('Error storing access token:', error);
        // Don't throw - auth succeeded even if token storage failed
      }
    }
    
    return { user: result.user, accessToken };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getGoogleAccessToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    // Get the OAuth credential from the sign-in result
    // Note: In a real app, you'd store this token securely (e.g., in Firestore via Cloud Function)
    // For now, we'll need to get it from the credential
    const credential = GoogleAuthProvider.credentialFromResult(
      await signInWithPopup(auth, googleProvider)
    );
    return credential?.accessToken || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

