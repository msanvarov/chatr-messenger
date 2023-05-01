import { updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';

import { IUserMetadata } from './user/types';

export const fetchUserMetadata = async (userId: string) => {
  const userMetaDoc = await getDoc(doc(db, 'users', userId));
  if (userMetaDoc.exists()) {
    return userMetaDoc.data() as Partial<IUserMetadata>;
  } else {
    throw new Error(`${userId} doesn't exist in firestore.`);
  }
};

export const channelExists = async (memberIds: string[]) => {
  const channelsRef = collection(db, 'channels');
  const channelsDataQuery = query(
    channelsRef,
    where('members', '==', memberIds)
  );
  const channelsQuerySnapshot = await getDocs(channelsDataQuery);
  return channelsQuerySnapshot.docs.length >= 1;
};

export const patchUserMetadata = async (
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

export const patchUserProfile = async (
  metadata: Partial<Pick<IUserMetadata, 'displayName' | 'photoURL'>>
) => {
  const user = auth.currentUser;
  if (user) {
    const { displayName, photoURL } = metadata;

    if (displayName || photoURL) {
      return await updateProfile(user, { displayName, photoURL });
    }
  }
  throw new Error('No user is logged in.');
};

// TODO: This is not safe, and should be refactored
export const fetchUsers = async (requestingUserId: string, userLimit = 100) => {
  const usersRef = collection(db, 'users');
  const usersQuery = query(usersRef, orderBy('displayName'), limit(userLimit));
  const querySnapshot = await getDocs(usersQuery);
  const usersMap = new Map<string, Record<string, string>>();

  querySnapshot.forEach((doc) => {
    if (doc.id !== requestingUserId && doc.id !== 'message-bot') {
      const uid = doc.id;
      const { displayName, email } = doc.data();
      usersMap.set(uid, { displayName, email });
    }
  });

  return usersMap;
};
