import _ from 'lodash';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMoment from 'react-moment';
import {
  Alert,
  Button,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import SimpleBarCore from 'simplebar-core';
import SimpleBar from 'simplebar-react';
import {
  AppState,
  IMessage,
  fetchChannel,
  useAppDispatch,
  useAppSelector,
} from '../../redux';

import { useParams } from 'react-router-dom';
import { useContacts, useRealtimeMessages } from '../../hooks';
import ContactFinder from '../tabs/channels-tab/contact-finder.component';
import ChatInput from './chat-input.component';
import ChatProfileHeader from './chat-profile-header.component';
import ContactProfileSidebar from './contact-profile-sidebar.component';

type ChatProps = {
  uid: string;
  photoURL?: string | null;
  displayName?: string | null;
};

export const Chat = ({ uid, photoURL, displayName }: ChatProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { channelId } = useParams();
  const simplebarRef = useRef<SimpleBarCore | null>(null);
  const { userSidebar } = useAppSelector((state: AppState) => state.layout);
  const channel = useAppSelector(
    (state: AppState) => state.channel.openedChannel
  );
  const { messages, loading, error } = useRealtimeMessages(channelId);
  const [forwardToModal, setForwardToModal] = useState<boolean>(false);
  const contacts = useContacts(uid);

  useEffect(() => {
    if (channelId) {
      // TODO: Refactor refetching for the channel when the use-user-channels hooks is already doing that
      dispatch(fetchChannel(channelId));
    }
  }, [channelId]);

  useEffect(() => {
    const simpleBarInstance = simplebarRef.current;

    if (simpleBarInstance) {
      simpleBarInstance.recalculate();
      const scrollElement = simpleBarInstance.getScrollElement();
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const toggleForwardToModal = () => setForwardToModal(!forwardToModal);

  const deleteMessage = (message: IMessage) => {
    console.log('Deleting', message);
  };

  if (loading) {
    return <Spinner className="spinner" color="dark" type="grow" />;
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <div className="user-chat w-100 user-chat-show">
      <div className="d-lg-flex">
        <div className={userSidebar ? 'w-70' : 'w-100'}>
          <ChatProfileHeader {...{ uid, channel }} />

          <SimpleBar
            style={{ maxHeight: '100%' }}
            ref={simplebarRef}
            className="chat-conversation p-3 p-lg-4"
            id="messages"
          >
            <ul className="list-unstyled mb-0">
              {_.map(_.keys(messages), (messageDate, i) => (
                <Fragment key={i}>
                  <li>
                    <div className="chat-day-title">
                      <span className="title">{messageDate}</span>
                    </div>
                  </li>
                  {_.map(messages[messageDate], (message, j) => (
                    <li key={j} className={message.user === uid ? 'right' : ''}>
                      <div className="conversation-list">
                        {messages[messageDate][j + 1] ? (
                          messages[messageDate][j].user ===
                          messages[messageDate][j + 1].user ? (
                            <div className="chat-avatar">
                              <div className="blank-div"></div>
                            </div>
                          ) : (
                            <div className="chat-avatar">
                              {message.user === uid ? (
                                <img
                                  src={
                                    photoURL ??
                                    'https://via.placeholder.com/100'
                                  }
                                  alt="profile"
                                />
                              ) : (
                                <img src={message.photoURL} alt="channel" />
                              )}
                            </div>
                          )
                        ) : (
                          <div className="chat-avatar">
                            {message.user === uid ? (
                              <img
                                src={
                                  photoURL ?? 'https://via.placeholder.com/100'
                                }
                                alt="profile"
                              />
                            ) : (
                              <img src={message.photoURL} alt="channel" />
                            )}
                          </div>
                        )}

                        <div className="user-chat-content">
                          <div className="ctext-wrap">
                            <div className="ctext-wrap-content">
                              {message.text && (
                                <p className="mb-0">{message.text}</p>
                              )}
                              <p className="chat-time mb-0">
                                <i className="ri-time-line align-middle"></i>{' '}
                                <span className="align-middle">
                                  <ReactMoment format="L hh:mm a">
                                    {message.timestamp}
                                  </ReactMoment>
                                </span>
                              </p>
                            </div>

                            <UncontrolledDropdown className="align-self-start">
                              <DropdownToggle tag="a">
                                <i className="ri-more-2-fill"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  {t('Copy')}{' '}
                                  <i className="ri-file-copy-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem onClick={toggleForwardToModal}>
                                  Forward{' '}
                                  <i className="ri-chat-forward-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => deleteMessage(message)}
                                >
                                  Delete{' '}
                                  <i className="ri-delete-bin-line float-end text-muted"></i>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </div>
                          {messages[messageDate][j + 1] ? (
                            messages[messageDate][j].user ===
                            messages[messageDate][j + 1].user ? null : (
                              <div className="conversation-name">
                                {message.user === uid
                                  ? displayName
                                  : message.displayName}
                              </div>
                            )
                          ) : (
                            <div className="conversation-name">
                              {message.user === uid
                                ? displayName
                                : message.displayName}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </SimpleBar>

          <Modal
            backdrop="static"
            isOpen={forwardToModal}
            centered
            toggle={toggleForwardToModal}
          >
            <ModalHeader toggle={toggleForwardToModal}>
              Forward to...
            </ModalHeader>
            <ModalBody>
              <CardBody className="p-2">
                <SimpleBar style={{ maxHeight: '200px' }}>
                  <ContactFinder
                    {...{ uid, contacts }}
                    handleCheck={(el) => {
                      console.log(el.target);
                    }}
                  />
                </SimpleBar>
                <ModalFooter className="border-0">
                  <Button color="primary">Forward</Button>
                </ModalFooter>
              </CardBody>
            </ModalBody>
          </Modal>

          <ChatInput {...{ uid, channelId }} />
        </div>

        <ContactProfileSidebar {...{ uid, userSidebar, channel }} />
      </div>
    </div>
  );
};
