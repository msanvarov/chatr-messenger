import Fuse from 'fuse.js';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { IUser } from '../redux';
import {
  IGroupedContact,
  useGroupedContacts,
} from './use-grouped-contacts.hook';

export const useQueryOnGroupedContacts = (
  requestingUserId: string,
  searchTerm?: string,
  userLimit = 100
): IGroupedContact[] => {
  const groupedContacts = useGroupedContacts(requestingUserId, userLimit);
  const [groupedFilteredContacts, setGroupedFilteredContacts] = useState<
    IGroupedContact[]
  >([]);

  useEffect(() => {
    if (!searchTerm) {
      setGroupedFilteredContacts(groupedContacts);
      return;
    }

    const fuse = new Fuse(
      groupedContacts.flatMap((g) => g.children),
      {
        keys: ['displayName', 'email'],
        threshold: 0.3,
      }
    );

    const results = fuse.search(searchTerm);
    const filteredUsers: IUser[] = results.map((result) => result.item);

    const grouped = _(filteredUsers)
      .groupBy((user) => user.displayName[0].toUpperCase())
      .map((children, group) => ({ group, children }))
      .value();

    setGroupedFilteredContacts(grouped);
  }, [searchTerm, groupedContacts]);

  return groupedFilteredContacts;
};
