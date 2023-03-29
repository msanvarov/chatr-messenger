import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { IChannel } from '../redux';
import { useUserChannels } from './use-user-channels.hook';

export const useQueryOnUserChannels = (
  userId: string,
  searchQuery?: string
) => {
  const { channels, loading } = useUserChannels(userId);
  const [filteredChannels, setFilteredChannels] = useState<IChannel[]>([]);

  useEffect(() => {
    if (searchQuery && channels.length > 0) {
      const fuse = new Fuse(channels, {
        keys: ['name'],
        includeScore: true,
      });

      const searchResults = fuse.search(searchQuery);
      const resultChannels = searchResults.map((result) => result.item);
      setFilteredChannels(resultChannels);
    } else {
      setFilteredChannels(channels);
    }
  }, [channels, searchQuery]);

  return { channels: filteredChannels, loading };
};
