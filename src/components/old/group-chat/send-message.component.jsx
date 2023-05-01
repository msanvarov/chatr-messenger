import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../../../config/firebase';

function SendMessage() {
  const [messageText, setMessageText] = useState('');
  const channelId = 'exampleGroupChannelId'; // Replace with the selected group channel ID

  const { currentUser } = auth;

  const sendMessage = async () => {
    if (messageText.trim() !== '') {
      await addDoc(collection(db, `groupChannels/${channelId}/messages`), {
        text: messageText,
        timestamp: new Date(),
        user: currentUser.uid,
      });
      setMessageText('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default SendMessage;
