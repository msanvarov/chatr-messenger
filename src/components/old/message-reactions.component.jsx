import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../config/firebase';

function MessageReactions({ messageId, reactions }) {
  const [reactionCounts, setReactionCounts] = useState(reactions || {});
  const channelId = 'exampleChannelId'; // Replace with the selected channel ID

  const { currentUser } = auth;

  const handleReactionClick = async (reaction) => {
    const newReactions = { ...reactionCounts };
    const userId = currentUser.uid;

    if (!newReactions[reaction]) {
      newReactions[reaction] = [userId];
    } else if (!newReactions[reaction].includes(userId)) {
      newReactions[reaction].push(userId);
    } else {
      newReactions[reaction] = newReactions[reaction].filter(
        (id) => id !== userId
      );
    }

    setReactionCounts(newReactions);

    const messageDocRef = doc(db, `channels/${channelId}/messages`, messageId);
    await updateDoc(messageDocRef, { reactions: newReactions });
  };

  return (
    <div>
      <button onClick={() => handleReactionClick('👍')}>👍</button>
      <button onClick={() => handleReactionClick('👎')}>👎</button>
      <button onClick={() => handleReactionClick('❤️')}>❤️</button>
      {Object.entries(reactionCounts).map(([reaction, users]) => (
        <div key={reaction}>
          {reaction} {users.length}
        </div>
      ))}
    </div>
  );
}

export default MessageReactions;
