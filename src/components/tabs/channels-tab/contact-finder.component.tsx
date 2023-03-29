import _ from 'lodash';
import React from 'react';
import { Input, Label } from 'reactstrap';

import { IUser } from '../../../redux';

type ContactFinderProps = {
  uid: string;
  handleCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    contact: IUser
  ) => void;
  contacts: IUser[];
};

const ContactFinder: React.FC<ContactFinderProps> = ({
  uid,
  contacts,
  handleCheck,
}) => {
  return (
    <ul className="list-unstyled contact-list">
      {_.map(
        _.filter(contacts, (contact) => contact.uid !== uid),
        (contact, i) => (
          <li key={i}>
            <div className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                onChange={(e) => handleCheck(e, contact)}
                id={'memberCheck' + i}
              />
              <Label className="form-check-label" htmlFor={'memberCheck' + i}>
                {contact.email} ({contact.displayName})
              </Label>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default ContactFinder;
