import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMoment from 'react-moment';
import { useParams } from 'react-router-dom';
import {
  Button,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledDropdown,
} from 'reactstrap';
import SimpleBarCore from 'simplebar-core';
import SimpleBar from 'simplebar-react';
import { useContacts, useRealtimeMessages } from '../../hooks';

import {
  AppState,
  IMessage,
  useAppDispatch,
  useAppSelector,
} from '../../redux';

import ContactFinder from '../tabs/channels-tab/contact-finder.component';
import ChatInput from './chat-input.component';
import ChatProfileHeader from './chat-profile-header.component';
import ContactProfileSidebar from './contact-profile-sidebar.component';

type ChatProps = {
  uid: string;
  photoURL: string | null;
  displayName: string | null;
};

export const Chat = ({ uid, photoURL, displayName }: ChatProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { channelId } = useParams();
  const simplebarRef = useRef<SimpleBarCore | null>(null);
  const { userSidebar } = useAppSelector((state: AppState) => state.layout);
  const channel = useAppSelector(
    (state: AppState) => state.channel.lastOpenedChannel
  );
  const { messages } = useRealtimeMessages(channelId);
  const [forwardToModal, setForwardToModal] = useState<boolean>(false);
  const contacts = useContacts(uid);

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

  // useEffect(() => {
  //   if (channel?.id) {
  //     onSnapshot(doc(db, 'channels', channel.id), (docSnap) => {
  //       if (docSnap.exists()) {
  //         // compare the old channel with the new one
  //         const channelDoc = docSnap.data() as IChannel;
  //         if (channel.messages.length !== channelDoc.messages.length) {
  //           dispatch(
  //             setLastOpenedChannel({
  //               id: channel.id,
  //               ...docSnap.data(),
  //             } as IChannel)
  //           );
  //         }
  //       }
  //     });
  //   }
  // }, [channel]);

  const toggleForwardToModal = () => setForwardToModal(!forwardToModal);

  const deleteMessage = (message: IMessage) => {
    console.log('Deleting', message);
  };

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
                <>
                  <li key={i}>
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
                                <img
                                  // src={message.author.photoURL}
                                  // TODO: Change this to use the users photoURL
                                  src="https://via.placeholder.com/100"
                                  alt="channel"
                                />
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
                              <img
                                // src={message.author.photoURL}
                                // TODO: Change this to use the users photoURL
                                src="https://via.placeholder.com/100"
                                alt="channel"
                              />
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
                                  : message.user}
                              </div>
                            )
                          ) : (
                            <div className="conversation-name">
                              {message.user === uid
                                ? displayName
                                : message.user}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </>
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

          <ChatInput
            {...{ uid, displayName, photoURL, channelId }}
            // channelId={channel?.id}
            // channelId={channelId}
          />
        </div>

        <ContactProfileSidebar {...{ uid, userSidebar, channel }} />
      </div>
    </div>
  );
};
