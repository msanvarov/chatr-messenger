import { collection, doc, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import {
  db, IChannel,
  IUserMetadata,
  setChannels,
  useAppDispatch,
  useAppSelector
} from '../redux';

export const useUserChannels = (userId: string) => {
  const dispatch = useAppDispatch();
  // const [channels, setChannels] = useState<IChannel[]>([]);
  const { channels, loading, error } = useAppSelector((state) => state.channel);

  useEffect(() => {
    const userDocRef = doc(db, 'users', userId);

    const unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
      if (userDoc.exists()) {
        const channelIds = (userDoc.data() as IUserMetadata)?.channels || [];

        const channelsRef = collection(db, 'channels');
        const channelsQuery = query(
          channelsRef,
          where(documentId(), 'in', channelIds)
        );

        const unsubscribeChannels = onSnapshot(
          channelsQuery,
          (querySnapshot) => {
            const channels: IChannel[] = [];
            querySnapshot.forEach((channelDoc) => {
              if (channelDoc.exists()) {
                channels.push({
                  ...(channelDoc.data() as IChannel),
                  id: channelDoc.id,
                });
              }
            });
            const filteredChannels = channels.filter(
              (channel) => !channel?.isDirectMessage
            );
            dispatch(setChannels(filteredChannels));
            
          }
        );

        return () => {
          unsubscribeChannels();
        };
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
