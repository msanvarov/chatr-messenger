import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../../config/firebase';

function GroupMessageList() {
  const [messages, setMessages] = useState([]);
  const channelId = 'exampleGroupChannelId'; // Replace with the selected group channel ID

  useEffect(() => {
    const q = query(
      collection(db, `groupChannels/${channelId}/messages`),
      orderBy('timestamp', 'asc')
    );

    getDocs(q).then((querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageList);
    });
  }, [channelId]);

  return (
    <div>
      <h3>Group Messages</h3>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroupMessageList;
