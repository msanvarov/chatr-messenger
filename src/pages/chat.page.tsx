import { useAppSelector } from 'src/redux';
import { Chat } from '../components/chat';

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
