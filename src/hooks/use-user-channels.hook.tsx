import {
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect } from 'react';
import {
  IChannel,
  IUserMetadata,
  db,
  setChannels,
  useAppDispatch,
  useAppSelector,
} from '../redux';

export const useUserChannels = (userId: string) => {
  const dispatch = useAppDispatch();
  const { channels, loading, error } = useAppSelector((state) => state.channel);

  useEffect(() => {
    const userDocRef = doc(db, 'users', userId);

    const fetchChannelsInBatches = async (channelIds: string[]) => {
      const channelsRef = collection(db, 'channels');
      const batchSize = 10;
      const channels: IChannel[] = [];

      for (let i = 0; i < channelIds.length; i += batchSize) {
        const batchIds = channelIds.slice(i, i + batchSize);
        const channelsQuery = query(
          channelsRef,
          where(documentId(), 'in', batchIds)
        );
        const querySnapshot = await getDocs(channelsQuery);

        querySnapshot.forEach((channelDoc) => {
          if (channelDoc.exists()) {
            channels.push({
              ...(channelDoc.data() as IChannel),
              id: channelDoc.id,
            });
          }
        });
      }
      dispatch(setChannels(channels));
    };

    const unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
      if (userDoc.exists()) {
        const channelIds = (userDoc.data() as IUserMetadata)?.channels || [];
        await fetchChannelsInBatches(channelIds);
      } else {
        console.error(`User with ID ${userId} does not exist.`);
      }
    });

    return () => {
      unsubscribeUser();
    };
  }, [userId, dispatch]);

  return { channels, loading, error };
};
