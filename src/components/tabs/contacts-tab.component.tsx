import React, { useState } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';

type ContactsTabProps = {
  contacts?: {
    id: number;
    name: string;
  };
};

const contacts = [
  {
    group: 'A',
    children: [
      { id: 1, name: 'Aaron Rodgers' },
      { id: 2, name: 'Anya Marina' },
    ],
  },
];

const ContactsTab: React.FC<ContactsTabProps> = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const toggle = () => setModal(!modal);
  return (
    <>
      <div className="p-4">
        <div className="user-chat-nav float-right">
          <div id="add-contact">
            <Button
              type="button"
              color="link"
              onClick={toggle}
              className="text-decoration-none text-muted font-size-18 py-0"
            >
              <i className="ri-user-add-line"></i>
            </Button>
          </div>
          <UncontrolledTooltip target="add-contact" placement="bottom">
            Add Contacts
          </UncontrolledTooltip>
        </div>
        <h4 className="mb-4">Contacts</h4>

        <Modal isOpen={modal} centered toggle={toggle}>
          <ModalHeader tag="h5" className="font-size-16" toggle={toggle}>
            {t('Add Contacts')}
          </ModalHeader>
          <ModalBody className="p-4">
            <Form>
              <FormGroup className="mb-4">
                <Label htmlFor="addcontactemail-input">{t('Email')}</Label>
                <Input
                  type="email"
                  className="form-control"
                  id="addcontactemail-input"
                  placeholder="Enter Email"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="addcontact-invitemessage-input">{t('Invatation Message')}</Label>
                <textarea
                  className="form-control"
                  id="addcontact-invitemessage-input"
                  rows={3}
                  placeholder="Enter Message"
                ></textarea>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="link" onClick={toggle}>
              Close
            </Button>
            <Button type="button" color="primary">
              Invite Contact
            </Button>
          </ModalFooter>
        </Modal>

        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="bg-light rounded-lg">
            <InputGroupAddon addonType="prepend">
              <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
            </InputGroupAddon>
            <Input
              type="text"
              className="form-control bg-light "
              placeholder={t('Search users..')}
            />
          </InputGroup>
        </div>
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        id="chat-room"
        className="p-4 chat-message-list chat-group-list"
      >
        {contacts.map(({ group, children }, key) => (
          <div {...{ key }} className={key + 1 === 1 ? '' : 'mt-3'}>
            <div className="p-3 font-weight-bold text-primary">{group}</div>

            <ul className="list-unstyled contact-list">
              {children.map((child, contactChildrenKey) => (
                <li key={contactChildrenKey}>
                  <Media className="align-items-center">
                    <Media body>
                      <h5 className="font-size-14 m-0">{child.name}</h5>
                    </Media>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="a" className="text-muted">
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          {t('Block')} <i className="ri-forbid-line float-right text-muted"></i>
                        </DropdownItem>
                        <DropdownItem>
                          {t('Remove')}{' '}
                          <i className="ri-delete-bin-line float-right text-muted"></i>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Media>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SimpleBar>
    </>
  );
};

export default ContactsTab;
