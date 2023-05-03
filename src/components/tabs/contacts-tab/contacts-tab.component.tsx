import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';

import { useNavigate } from 'react-router-dom';
import { useQueryOnGroupedContacts } from '../../../hooks';
import {
  createChannel,
  fetchUserMetadata,
  IUser,
  setLastOpenedChannel,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';

type ContactsTabProps = {
  uid: string;
  displayName: string | null;
};

export const ContactsTab = ({ uid, displayName }: ContactsTabProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {recentlyCreatedChannelId} = useAppSelector((state) => state.channel);
  const [inviteContactsModal, setInviteContactsModal] =
    useState<boolean>(false);
  const toggle = () => setInviteContactsModal(!inviteContactsModal);

  const [contactSearchQuery, setContactSearchQuery] = useState<string>();
  const groupedContacts = useQueryOnGroupedContacts(uid, contactSearchQuery);

  const createDirectMessageWithContact = async (userId: string) => {
    // Get contact's user metadata
    const contactsMetadata = await fetchUserMetadata(userId);

    dispatch(
      createChannel({
        name: `${displayName}-${contactsMetadata.displayName}`,
        members: [
          JSON.stringify({ uid, displayName }),
          JSON.stringify({
            uid: userId,
            displayName: contactsMetadata.displayName,
            email: contactsMetadata.email,
          }),
        ],
        photoURL:
          contactsMetadata.photoURL ?? 'https://via.placeholder.com/100',
        createdAt: new Date().toISOString(),
        isDirectMessage: true,
      })
    );
  };

  useEffect(() => {
    if (recentlyCreatedChannelId) {
      dispatch(
        setLastOpenedChannel({ channelId: recentlyCreatedChannelId, uid })
      );
      navigate(`/${recentlyCreatedChannelId}`);
    }
  }, [recentlyCreatedChannelId]);

  return (
    <>
      <div className="p-4">
        <div className="user-chat-nav float-end">
          <div id="add-contact">
            <Button
              type="button"
              color="link"
              onClick={toggle}
              className="text-decoration-none text-muted font-size-18 py-0"
            >
              <i className="ri-user-voice-line"></i>
            </Button>
          </div>
          <UncontrolledTooltip target="add-contact" placement="bottom">
            Invite Contacts
          </UncontrolledTooltip>
        </div>
        <h4 className="mb-4">Contacts</h4>

        <Modal isOpen={inviteContactsModal} centered toggle={toggle}>
          <ModalHeader tag="h5" className="font-size-16" toggle={toggle}>
            {t('Invite Contacts')}
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
                <Label htmlFor="addcontact-invitemessage-input">
                  {t('Invitation Message')}
                </Label>
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
            <Button
              color="link"
              className="text-decoration-none text-muted pr-1"
              type="button"
            >
              <i className="ri-search-line search-icon font-size-18"></i>
            </Button>
            <Input
              type="text"
              className="form-control bg-light "
              placeholder={t('Search users..') ?? 'Search users..'}
              onChange={(e) => setContactSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        id="chat-room"
        className="p-4 chat-message-list chat-group-list"
      >
        {groupedContacts.map(({ group, children }, key) => (
          <div {...{ key }} className={key + 1 === 1 ? '' : 'mt-3'}>
            <div className="p-3 fw-bold text-primary">{group}</div>
            <ul className="list-unstyled contact-list">
              {_.values(children as IUser[]).map(
                (child, contactChildrenKey) => (
                  <li key={contactChildrenKey}>
                    <Media className="d-flex align-items-center">
                      <Media body className="flex-grow-1">
                        <h5 className="font-size-14 m-0">
                          {child.displayName}
                        </h5>
                        <h5 className="font-size-12 m-0">{child.email}</h5>
                      </Media>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="text-muted">
                          <i className="ri-more-2-fill"></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem
                            onClick={() =>
                              createDirectMessageWithContact(child.uid)
                            }
                          >
                            {t('Message')}{' '}
                            <i className="ri-user-add-line float-end text-muted"></i>
                          </DropdownItem>
                          <DropdownItem>
                            {t('Block')}{' '}
                            <i className="ri-forbid-line float-end text-muted"></i>
                          </DropdownItem>
                          <DropdownItem>
                            {t('Hide')}{' '}
                            <i className="ri-delete-bin-line float-end text-muted"></i>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Media>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </SimpleBar>
    </>
  );
};

export default ContactsTab;
