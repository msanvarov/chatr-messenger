import { Spinner } from 'reactstrap';
import { Chat } from '../components/chat';
import { useAppSelector } from '../redux';

const ChatPage = () => {
  const user = useAppSelector((state) => state.user);

  if (!user.uid)
    return <Spinner className="spinner" color="dark" type="grow" />;

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
