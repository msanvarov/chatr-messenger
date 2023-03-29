import { useEffect, useState } from 'react';
import { fetchUsers, IUser } from '../redux';

export const useContacts = (
  requestingUserId: string,
  userLimit = 100
): IUser[] => {
  const [contacts, setContacts] = useState<IUser[]>([]);

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

  return contacts;
};
