import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../config/firebase';

function MessageList() {
  const [messages, setMessages] = useState([]);
  const channelId = 'exampleChannelId';
  useEffect(() => {
    const messageQuery = query(
      collection(db, `channels/${channelId}/messages`),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [db, channelId]);

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
