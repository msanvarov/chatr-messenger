import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../config/firebase';

function MessageReplies({ messageId }) {
  const [replyText, setReplyText] = useState('');
  const channelId = 'exampleChannelId'; // Replace with the selected channel ID

  const { currentUser } = auth;

  const sendReply = async () => {
    if (replyText.trim() !== '') {
      await addDoc(
        collection(db, `channels/${channelId}/messages/${messageId}/replies`),
        {
          text: replyText,
          timestamp: new Date(),
          user: currentUser.uid,
        }
      );
      setReplyText('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Reply to message"
      />
      <button onClick={sendReply}>Send Reply</button>
    </div>
  );
}

export default MessageReplies;
