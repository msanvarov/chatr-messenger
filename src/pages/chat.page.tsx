import { Chat } from '../components/chat';
import { useAppSelector } from '../redux';

const ChatPage = () => {
  const user = useAppSelector((state) => state.user);
  return (
    <Chat
      {...{
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      }}
    />
  );
};

export default ChatPage;
