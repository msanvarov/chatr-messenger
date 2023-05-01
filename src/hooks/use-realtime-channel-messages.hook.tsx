import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import _ from 'lodash';
import { useEffect } from 'react';
import { db } from '../config/firebase';
import {
  AppState,
  editMessage,
  removeMessage,
  useAppDispatch,
  useAppSelector,
  writeMessage,
} from '../redux';

export const useRealtimeMessages = (channelId?: string) => {
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

      const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            dispatch(writeMessage({ id: change.doc.id, ...change.doc.data() }));
          } else if (change.type === 'modified') {
            dispatch(
              editMessage({
                id: change.doc.id,
                ...change.doc.data(),
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
  }, [channelId, dispatch]);

  const groupedMessages = _.groupBy(messages, (message) => {
    const date = new Date(message.timestamp);
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  });

  return {
    messages: groupedMessages,
    loading,
    error,
  };
};
