import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import _ from 'lodash';
import { useEffect } from 'react';
import {
  AppState,
  IChannel,
  IMessage,
  editMessage,
  removeMessage,
  setMessage,
  useAppDispatch,
  useAppSelector,
} from '../redux';
import { db } from '../redux/firebase';

export const useRealtimeMessages = (channelId?: string | null) => {
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector(
    (state: AppState) => state.messages
  );

  useEffect(() => {
    if (channelId) {
      const messageQuery = query(
        collection(db, `channels/${channelId}/messages`),
        orderBy('timestamp')
      );

      (async () => {
        const channelDoc = await getDoc(doc(db, 'channels', channelId));
        if (channelDoc.exists()) {
          const members = (channelDoc.data() as IChannel)?.members || [];
          const userDocsPromises = members.map((memberId) =>
            getDoc(doc(db, 'users', memberId))
          );
          const userDocs = await Promise.all(userDocsPromises);
          const usersMetadata = userDocs.map((userDoc) => ({
            uid: userDoc.id,
            displayName: userDoc.data()?.displayName,
            photoURL: userDoc.data()?.photoURL,
          }));

          const findUserMetadata = (uid: string) =>
            uid === 'message-bot'
              ? {
                  uid: 'message-bot',
                  displayName: 'Message Bot',
                  photoURL: '/message-bot.png',
                }
              : usersMetadata.find((user) => user.uid === uid);

          const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              const messageData = change.doc.data() as IMessage;
              const userMetadata = findUserMetadata(messageData.user);

              if (change.type === 'added') {
                dispatch(
                  setMessage({
                    ...messageData,
                    ...userMetadata,
                    id: change.doc.id,
                    channelId: channelId,
                  })
                );
              } else if (change.type === 'modified') {
                dispatch(
                  editMessage({
                    ...messageData,
                    ...userMetadata,
                    id: change.doc.id,
                    channelId: channelId,
                    edited: true,
                  })
                );
              } else if (change.type === 'removed') {
                dispatch(removeMessage(change.doc.id));
              }
            });
          });

          return () => {
            unsubscribe();
          };
        }
      })();
    }
  }, [channelId, dispatch]);

  const groupedMessages = _.groupBy(
    channelId ? messages[channelId] : [],
    (message) => {
      const date = new Date(message.timestamp);
      const formattedDate = date.toLocaleDateString();
      return formattedDate;
    }
  );

  return {
    messages: groupedMessages,
    loading,
    error,
  };
};
