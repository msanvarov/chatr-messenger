import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import MessageList from '../components/chat/message-list.component';
import SendMessage from '../components/chat/send-message.component';
import GroupMessageList from './group-chat/group-message-list.component';
import GroupSendMessage from './group-chat/send-message.component';

import { useParams } from 'react-router-dom';
import { auth } from '../../config/firebase';

function Channel({ isGroup }) {
  const { channelId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Channel: {channelId}</h1>
      {isGroup ? (
        <GroupMessageList channelId={channelId} />
      ) : (
        <MessageList channelId={channelId} />
      )}
      {isGroup ? (
        <GroupSendMessage channelId={channelId} />
      ) : (
        <SendMessage channelId={channelId} />
      )}
      {/* <FileUpload /> */}
      {/* <EmojiPicker /> */}
      {/* <MessageReactions messageId="exampleMessageId" /> */}
      {/* <GifPicker /> */}
      {/* <MessageReplies messageId="exampleMessageId" /> */}
    </div>
  );
}

export default Channel;
