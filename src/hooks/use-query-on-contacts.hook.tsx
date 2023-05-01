import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { fetchUsers, IUser } from '../redux';

export const useQueryOnContacts = (
  requestingUserId: string,
  userLimit = 100,
  searchQuery?: string
): IUser[] => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const usersMap = await fetchUsers(requestingUserId, userLimit);
      const users: IUser[] = Array.from(
        usersMap,
        ([uid, userData]) =>
          ({
            uid,
            ...userData,
          } as IUser)
      );

      setContacts(users);
    };

    fetchContacts();
  }, [requestingUserId, userLimit]);

  useEffect(() => {
    if (searchQuery && contacts.length > 0) {
      const fuse = new Fuse(contacts, {
        keys: ['name', 'email'],
        threshold: 0.3,
      });
      const searchResults = fuse.search(searchQuery);
      const resultContacts = searchResults.map((result) => result.item);
      setFilteredContacts(resultContacts);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchQuery]);

  return filteredContacts;
};
