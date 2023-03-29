import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../../config/firebase';

function GroupChannelList() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const getChannels = async () => {
      const querySnapshot = await getDocs(collection(db, 'groupChannels'));
      const channelList = [];
      querySnapshot.forEach((doc) => {
        channelList.push({ id: doc.id, ...doc.data() });
      });
      setChannels(channelList);
    };
    getChannels();
  }, []);

  return (
    <div>
      <h3>Group Channels</h3>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroupChannelList;
