import React from 'react';
import { Input, Label } from 'reactstrap';
import { IChatState } from 'store/chat';

type ContactFinderProps = {
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
} & Pick<IChatState, 'contacts'>;

const ContactFinder: React.FC<ContactFinderProps> = ({ contacts, handleCheck }) => {
  return (
    <>
      {[{ group: 'Everyone', children: contacts }].map((contact, key) => (
        <div key={key}>
          <div className="p-3 font-weight-bold text-primary">{contact.group}</div>

          <ul className="list-unstyled contact-list">
            {contact.children.map((child, keyChild) => (
              <li key={keyChild}>
                <div className="custom-control custom-checkbox">
                  <Input
                    type="checkbox"
                    className="custom-control-input"
                    onChange={(e) => handleCheck(e, child.id)}
                    id={'memberCheck' + child.id}
                    value={child.name}
                  />
                  <Label className="custom-control-label" htmlFor={'memberCheck' + child.id}>
                    {child.name}
                  </Label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default ContactFinder;
