import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { User, Client, Listing, Showing, Document } from './types';

// Helper to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Helper to convert Date to Firestore Timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Users Collection
export const usersCollection = collection(db, 'users');

export const createUser = async (userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> => {
  const userRef = doc(usersCollection, userData.uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(usersCollection, uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  
  const data = userSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as User;
};

export const updateUser = async (uid: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(usersCollection, uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Clients Collection
export const clientsCollection = collection(db, 'clients');

export const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const clientRef = doc(clientsCollection);
  const clientId = clientRef.id;
  await setDoc(clientRef, {
    ...clientData,
    id: clientId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return clientId;
};

export const getClient = async (clientId: string): Promise<Client | null> => {
  const clientRef = doc(clientsCollection, clientId);
  const clientSnap = await getDoc(clientRef);
  if (!clientSnap.exists()) return null;
  
  const data = clientSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Client;
};

export const getClientsByAgent = async (agentId: string): Promise<Client[]> => {
  const q = query(clientsCollection, where('agentId', '==', agentId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Client;
  });
};

export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<void> => {
  const clientRef = doc(clientsCollection, clientId);
  await updateDoc(clientRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Listings Collection
export const listingsCollection = collection(db, 'listings');

export const createListing = async (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const listingRef = doc(listingsCollection);
  const listingId = listingRef.id;
  await setDoc(listingRef, {
    ...listingData,
    id: listingId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return listingId;
};

export const getListing = async (listingId: string): Promise<Listing | null> => {
  const listingRef = doc(listingsCollection, listingId);
  const listingSnap = await getDoc(listingRef);
  if (!listingSnap.exists()) return null;
  
  const data = listingSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Listing;
};

export const getListingsByAgent = async (agentId: string): Promise<Listing[]> => {
  const q = query(listingsCollection, where('agentId', '==', agentId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Listing;
  });
};

// Showings Collection
export const showingsCollection = collection(db, 'showings');

export const createShowing = async (showingData: Omit<Showing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const showingRef = doc(showingsCollection);
  const showingId = showingRef.id;
  await setDoc(showingRef, {
    ...showingData,
    id: showingId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return showingId;
};

export const getShowing = async (showingId: string): Promise<Showing | null> => {
  const showingRef = doc(showingsCollection, showingId);
  const showingSnap = await getDoc(showingRef);
  if (!showingSnap.exists()) return null;
  
  const data = showingSnap.data();
  return {
    ...data,
    startTime: timestampToDate(data.startTime),
    endTime: timestampToDate(data.endTime),
    checkInTime: data.checkInTime ? timestampToDate(data.checkInTime) : undefined,
    checkOutTime: data.checkOutTime ? timestampToDate(data.checkOutTime) : undefined,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Showing;
};

export const getShowingsByAgent = async (agentId: string): Promise<Showing[]> => {
  const q = query(showingsCollection, where('agentId', '==', agentId), orderBy('startTime', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      startTime: timestampToDate(data.startTime),
      endTime: timestampToDate(data.endTime),
      checkInTime: data.checkInTime ? timestampToDate(data.checkInTime) : undefined,
      checkOutTime: data.checkOutTime ? timestampToDate(data.checkOutTime) : undefined,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Showing;
  });
};

export const updateShowing = async (showingId: string, updates: Partial<Showing>): Promise<void> => {
  const showingRef = doc(showingsCollection, showingId);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  // Convert Date objects to Timestamps
  if (updates.startTime) updateData.startTime = dateToTimestamp(updates.startTime);
  if (updates.endTime) updateData.endTime = dateToTimestamp(updates.endTime);
  if (updates.checkInTime) updateData.checkInTime = dateToTimestamp(updates.checkInTime);
  if (updates.checkOutTime) updateData.checkOutTime = dateToTimestamp(updates.checkOutTime);
  
  await updateDoc(showingRef, updateData);
};

// Documents Collection
export const documentsCollection = collection(db, 'documents');

export const createDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const documentRef = doc(documentsCollection);
  const documentId = documentRef.id;
  await setDoc(documentRef, {
    ...documentData,
    id: documentId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return documentId;
};

export const getDocument = async (documentId: string): Promise<Document | null> => {
  const documentRef = doc(documentsCollection, documentId);
  const documentSnap = await getDoc(documentRef);
  if (!documentSnap.exists()) return null;
  
  const data = documentSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Document;
};

export const getDocumentsByAgent = async (agentId: string): Promise<Document[]> => {
  const q = query(documentsCollection, where('agentId', '==', agentId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Document;
  });
};

export const updateDocument = async (documentId: string, updates: Partial<Document>): Promise<void> => {
  const documentRef = doc(documentsCollection, documentId);
  await updateDoc(documentRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

