import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { auth, db } from '../../config/firebase';

function ChannelList() {
  const [channels, setChannels] = useState([]);

  const { currentUser } = auth;

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, 'channels'),
        where('users', 'array-contains', currentUser.uid)
      );
      getDocs(q).then((querySnapshot) => {
        const channelList = [];
        querySnapshot.forEach((doc) => {
          channelList.push({ id: doc.id, ...doc.data() });
        });
        setChannels(channelList);
      });
    }
  }, [currentUser]);

  return (
    <div>
      <h3>Channels</h3>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelList;
