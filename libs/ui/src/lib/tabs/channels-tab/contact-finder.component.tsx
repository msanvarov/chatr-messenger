import React from 'react';
import * as _ from 'lodash';
import { Input, Label } from 'reactstrap';

import { IUser } from '@chatr/redux';

type ContactFinderProps = {
  uid: string;
  handleCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    uid: string
  ) => void;
  contacts?: IUser[];
};

const ContactFinder: React.FC<ContactFinderProps> = ({
  uid,
  contacts = [],
  handleCheck,
}) => {
  return (
    <ul className="list-unstyled contact-list">
      {_.map(
        _.filter(contacts, (contact) => contact.uid !== uid),
        (contact, i) => (
          <li key={i}>
            <div className="custom-control custom-checkbox">
              <Input
                type="checkbox"
                className="custom-control-input"
                onChange={(e) => handleCheck(e, contact.uid)}
                id={'memberCheck' + i}
                value={contact.displayName}
              />
              <Label
                className="custom-control-label"
                htmlFor={'memberCheck' + i}
              >
                {contact.displayName}
              </Label>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default ContactFinder;
