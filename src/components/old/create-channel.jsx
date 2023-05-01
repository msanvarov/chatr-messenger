import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useState } from 'react';

function CreateChannel({ isGroup }) {
  const [channelName, setChannelName] = useState('');
  const firestore = getFirestore();

  const createChannel = async (e) => {
    e.preventDefault();
    if (channelName.trim() !== '') {
      const newChannel = {
        name: channelName,
        createdAt: new Date(),
        isGroup: !!isGroup,
      };

      await addDoc(
        collection(firestore, 'channels', 'exampleChannelId'),
        newChannel
      );
      setChannelName('');
    }
  };

  return (
    <div>
      <h2>
        {isGroup ? 'Create Group Channel' : 'Create Direct Message Channel'}
      </h2>
      <form onSubmit={createChannel}>
        <input
          type="text"
          placeholder="Enter channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
}

export default CreateChannel;
