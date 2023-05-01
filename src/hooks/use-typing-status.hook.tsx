import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, ITypingUser } from '../redux'; // Make sure to import the TypingUser type

export const useTypingStatus = (channelId: string) => {
  const [typingUsers, setTypingUsers] = useState<ITypingUser[]>([]);

  useEffect(() => {
    const channelRef = doc(db, 'channels', channelId);

    const unsubscribe = onSnapshot(channelRef, (channelSnapshot) => {
      const channelData = channelSnapshot.data();
      if (channelData && channelData.typingUsers) {
        setTypingUsers(channelData.typingUsers);
      } else {
        setTypingUsers([]);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [channelId]);

  return typingUsers;
};
