import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

import { IUserMetadata } from './types';

const db = getFirestore();
const auth = getAuth();

export const getUserMetadataFromFirebase = async (userId: string) => {
  const userMetaDoc = await getDoc(doc(db, 'users', userId));
  if (userMetaDoc.exists()) {
    return userMetaDoc.data() as IUserMetadata;
  } else {
    throw new Error(`${userId} doesn't exist in firestore.`);
  }
};

export const updateFirestoreUserMetadata = async (
  userId: string,
  metadata: Partial<IUserMetadata>
) => {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    return await updateDoc(userDoc, metadata);
  }
  return await setDoc(userDoc, metadata);
};

export const updateFirebaseUserProfile = async (
  metadata: Partial<Pick<IUserMetadata, 'displayName' | 'photoURL'>>
) => {
  const user = auth.currentUser;
  if (user) {
    if ('displayName' in metadata) {
      return await updateProfile(user, { displayName: metadata.displayName });
    } else if ('photoURL' in metadata) {
      return await updateProfile(user, { photoURL: metadata.photoURL });
    }
  }
  throw new Error('No user is logged in.');
};
