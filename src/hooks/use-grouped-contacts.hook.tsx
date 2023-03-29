import _ from 'lodash';
import { useEffect, useState } from 'react';
import { fetchUsers, IUser } from '../redux';

export type IGroupedContact = {
  group: string;
  children: IUser[];
};

export const useGroupedContacts = (
  requestingUserId: string,
  userLimit = 100
): IGroupedContact[] => {
  const [groupedContacts, setGroupedContacts] = useState<IGroupedContact[]>([]);

  useEffect(() => {
    const fetchAndGroupUsers = async () => {
      const usersMap = await fetchUsers(requestingUserId, userLimit);
      const users: IUser[] = Array.from(
        usersMap,
        ([uid, userData]) =>
          ({
            uid,
            ...userData,
          } as IUser)
      );

      const grouped = _(users)
        .groupBy((user) => user.displayName[0].toUpperCase())
        .map((children, group) => ({ group, children }))
        .value();

      setGroupedContacts(grouped);
    };

    fetchAndGroupUsers();
  }, [requestingUserId, userLimit]);

  return groupedContacts;
};
