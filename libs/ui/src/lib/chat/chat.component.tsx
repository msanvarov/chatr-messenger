import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Button,
  ModalFooter,
} from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import ReactMoment from 'react-moment';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';
import { doc, onSnapshot } from '@firebase/firestore';

import {
  AppState,
  db,
  fetchChannels,
  IChannel,
  IMessage,
  IUser,
  IUserState,
  setOpenedChannel,
  useAppDispatch,
  useAppSelector,
} from '@chatr/redux';

import ChatInput from './chat-input.component';
import ChatProfileHeader from './chat-profile-header.component';
import ContactProfileSidebar from './contact-profile-sidebar.component';
import ContactFinder from '../tabs/channels-tab/contact-finder.component';

type ChatProps = {
  profile: IUserState;
  contacts?: IUser[];
};

export const Chat: React.FC<ChatProps> = ({
  profile: { uid, photoURL, displayName },
  contacts,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const simplebarRef = useRef<SimpleBar | null>(null);
  const { userSidebar } = useAppSelector((state: AppState) => state.layout);

  const [forwardToModal, setForwardToModal] = useState<boolean>(false);
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
  const channel = useAppSelector(
    (state: AppState) => state.channel.openedChannel
  );

  useEffect(() => {
    (simplebarRef.current as SimpleBar)?.recalculate();
    if ((simplebarRef.current as SimpleBar).el) {
      (simplebarRef.current as SimpleBar).getScrollElement().scrollTop = (
        simplebarRef.current as SimpleBar
      ).getScrollElement().scrollHeight;
    }
  }, [messages]);

  useMemo(() => {
    const categorizedMessagesByDate = _.reduce(
      channel?.messages,
      (groupedMessages, message) => {
        const day = moment(message.createdAt).format('MMM Do YYYY');
        if (!groupedMessages[day]) {
          groupedMessages[day] = [];
        }
        groupedMessages[day].push(message);
        return groupedMessages;
      },
      {}
    );
    setMessages(categorizedMessagesByDate);
  }, [channel]);

  useEffect(() => {
    if (channel?.id) {
      onSnapshot(doc(db, 'channels', channel.id), (docSnap) => {
        if (docSnap.exists()) {
          // compare the old channel with the new one
          const channelDoc = docSnap.data() as IChannel;
          if (channel.messages.length !== channelDoc.messages.length) {
            dispatch(
              setOpenedChannel({
                id: channel.id,
                ...docSnap.data(),
              } as IChannel)
            );
          }
        }
      });
    }
  }, [channel]);

  const toggleForwardToModal = () => setForwardToModal(!forwardToModal);

  const deleteMessage = (message: IMessage) => {
    console.log('Deleting', message);
  };

  return (
    <div className="user-chat w-100">
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
                    <li
                      key={j}
                      className={message.author.id === uid ? 'right' : ''}
                    >
                      <div className="conversation-list">
                        {messages[messageDate][j + 1] ? (
                          messages[messageDate][j].author ===
                          messages[messageDate][j + 1].author ? (
                            <div className="chat-avatar">
                              <div className="blank-div"></div>
                            </div>
                          ) : (
                            <div className="chat-avatar">
                              {message.author.id === uid ? (
                                <img src={photoURL} alt="profile" />
                              ) : (
                                <img
                                  src={message.author.photoURL}
                                  alt="channel"
                                />
                              )}
                            </div>
                          )
                        ) : (
                          <div className="chat-avatar">
                            {message.author.id === uid ? (
                              <img src={photoURL} alt="profile" />
                            ) : (
                              <img
                                src={message.author.photoURL}
                                alt="channel"
                              />
                            )}
                          </div>
                        )}

                        <div className="user-chat-content">
                          <div className="ctext-wrap">
                            <div className="ctext-wrap-content">
                              {message.content && (
                                <p className="mb-0">{message.content}</p>
                              )}
                              <p className="chat-time mb-0">
                                <i className="ri-time-line align-middle"></i>{' '}
                                <span className="align-middle">
                                  <ReactMoment format="hh:mm a">
                                    {message.createdAt}
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
                                  <i className="ri-file-copy-line float-right text-muted"></i>
                                </DropdownItem>
                                <DropdownItem onClick={toggleForwardToModal}>
                                  Forward{' '}
                                  <i className="ri-chat-forward-line float-right text-muted"></i>
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => deleteMessage(message)}
                                >
                                  Delete{' '}
                                  <i className="ri-delete-bin-line float-right text-muted"></i>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </div>
                          {messages[messageDate][j + 1] ? (
                            messages[messageDate][j].author ===
                            messages[messageDate][j + 1].author ? null : (
                              <div className="conversation-name">
                                {message.author.id === uid
                                  ? displayName
                                  : message.author.name}
                              </div>
                            )
                          ) : (
                            <div className="conversation-name">
                              {message.author.id === uid
                                ? displayName
                                : message.author.name}
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
            {...{ uid, displayName, photoURL }}
            channelId={channel?.id}
          />
        </div>

        <ContactProfileSidebar {...{ uid, userSidebar, channel }} />
      </div>
    </div>
  );
};
