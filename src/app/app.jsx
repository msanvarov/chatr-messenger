import Channel from 'src/components/old/channel.component';
import UserAuthentication from 'src/components/user-authentication.component';

export function App() {
  const channelId = 'exampleChannelId';
  const isGroup = true;
  return (
    <div className="App">
      <UserAuthentication />
      <Channel channelId={channelId} isGroup={isGroup} />
    </div>
  );
}

export default App;
