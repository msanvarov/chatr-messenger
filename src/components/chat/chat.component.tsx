import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IChatState, IMessage, UserType } from 'store/chat';
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
import SimpleBar from 'simplebar-react';
import * as chatActions from 'store/chat/actions';
import ChatFileList from './chat-file-list.component';
import ChatPhotoList from './chat-photo-list.component';
import ChatProfileHeader from './chat-profile-header.component';
import ContactFinder from 'components/contacts/contact-finder/contact-finder.component';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from 'store';
import ChatInput from './chat-input.component';
import ContactProfileSidebar from 'components/contacts/contact-profile-sidebar/contact-profile-sidebar.component';

type ChatProps = Pick<IChatState, 'users' | 'activeUser' | 'contacts'>;
const Chat: React.FC<ChatProps> = ({ users, activeUser, contacts }) => {
  const ref = useRef<SimpleBar | null>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userSidebar = useSelector((state: IApplicationState) => state.layout.userSidebar);
  const [modal, setModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>(users[activeUser].messages);

  useEffect(() => {
    setChatMessages(users[activeUser].messages);
    (ref.current as any)?.recalculate();
    if ((ref.current as any).el) {
      (ref.current as any).getScrollElement().scrollTop = (ref.current as any).getScrollElement().scrollHeight;
    }
  }, [activeUser, users]);

  const toggle = () => setModal(!modal);

  const addMessage = (message: string, type: 'textMessage' | 'fileMessage' | 'mediaMessage') => {
    let messageObj: IMessage | null = null;
    const n = moment().seconds();

    switch (type) {
      case 'textMessage':
        messageObj = {
          id: chatMessages.length + 1,
          message,
          time: '00:' + n,
          userType: UserType.Sender,
          isFileMessage: false,
          isImageMessage: false,
        };
        break;

      default:
        break;
    }

    if (messageObj) {
      setChatMessages([...chatMessages, messageObj]);
      const copyOfUsers = [...users];
      copyOfUsers[activeUser].messages = [...chatMessages, messageObj];
      copyOfUsers[activeUser].isTyping = false;
      dispatch(chatActions.setFullUser(copyOfUsers));
    }

    scrolltoBottom();
  };

  function scrolltoBottom() {
    if ((ref.current as any).el) {
      (ref.current as any).getScrollElement().scrollTop = (ref.current as any).getScrollElement().scrollHeight;
    }
  }

  const deleteMessage = (id: number) => {
    setChatMessages(chatMessages.filter((item) => item.id !== id));
  };

  return (
    <React.Fragment>
      <div className="user-chat w-100">
        <div className="d-lg-flex">
          <div className={userSidebar ? 'w-70' : 'w-100'}>
            <ChatProfileHeader {...{ users, activeUser }} />

            <SimpleBar
              style={{ maxHeight: '100%' }}
              {...{ ref }}
              className="chat-conversation p-3 p-lg-4"
              id="messages"
            >
              <ul className="list-unstyled mb-0">
                {chatMessages.map((chat, key) =>
                  chat.isToday ? (
                    <li key={'dayTitle' + key}>
                      <div className="chat-day-title">
                        <span className="title">Today</span>
                      </div>
                    </li>
                  ) : users[activeUser].isGroup ? (
                    <li key={key} className={chat.userType === 'sender' ? 'right' : ''}>
                      <div className="conversation-list">
                        <div className="chat-avatar">
                          {chat.userType === 'sender' ? (
                            <img src={'https://via.placeholder.com/100'} alt="chatvia" />
                          ) : users[activeUser].profilePicture === 'Null' ? (
                            <div className="chat-user-img align-self-center mr-3">
                              <div className="avatar-xs">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                  {chat.userName && chat.userName.charAt(0)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <img src={users[activeUser].profilePicture} alt="profile" />
                          )}
                        </div>

                        <div className="user-chat-content">
                          <div className="ctext-wrap">
                            <div className="ctext-wrap-content">
                              {chat.message && <p className="mb-0">{chat.message}</p>}
                              {chat.imageMessage && <ChatPhotoList photos={chat.imageMessage} />}
                              {chat.fileMessage && (
                                <ChatFileList fileName={chat.fileMessage} fileSize={chat.size} />
                              )}
                              {chat.isTyping && (
                                <p className="mb-0">
                                  typing
                                  <span className="animate-typing">
                                    <span className="dot ml-1"></span>
                                    <span className="dot ml-1"></span>
                                    <span className="dot ml-1"></span>
                                  </span>
                                </p>
                              )}
                              {!chat.isTyping && (
                                <p className="chat-time mb-0">
                                  <i className="ri-time-line align-middle"></i>{' '}
                                  <span className="align-middle">{chat.time}</span>
                                </p>
                              )}
                            </div>
                            {!chat.isTyping && (
                              <UncontrolledDropdown className="align-self-start">
                                <DropdownToggle tag="a">
                                  <i className="ri-more-2-fill"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem>
                                    {t('Copy')}{' '}
                                    <i className="ri-file-copy-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem>
                                    {t('Save')}{' '}
                                    <i className="ri-save-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem onClick={toggle}>
                                    Forward{' '}
                                    <i className="ri-chat-forward-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem onClick={() => deleteMessage(chat.id)}>
                                    Delete{' '}
                                    <i className="ri-delete-bin-line float-right text-muted"></i>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            )}
                          </div>
                          {
                            <div className="conversation-name">
                              {chat.userType === 'sender' ? 'Patricia Smith' : chat.userName}
                            </div>
                          }
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li key={key} className={chat.userType === 'sender' ? 'right' : ''}>
                      <div className="conversation-list">
                        {chatMessages[key + 1] ? (
                          chatMessages[key].userType === chatMessages[key + 1].userType ? (
                            <div className="chat-avatar">
                              <div className="blank-div"></div>
                            </div>
                          ) : (
                            <div className="chat-avatar">
                              {chat.userType === 'sender' ? (
                                <img src={'https://via.placeholder.com/100'} alt="chatvia" />
                              ) : users[activeUser].profilePicture === 'Null' ? (
                                <div className="chat-user-img align-self-center mr-3">
                                  <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                      {users[activeUser].name.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <img src={users[activeUser].profilePicture} alt="chatvia" />
                              )}
                            </div>
                          )
                        ) : (
                          <div className="chat-avatar">
                            {chat.userType === 'sender' ? (
                              <img src={'https://via.placeholder.com/100'} alt="chatvia" />
                            ) : users[activeUser].profilePicture === 'Null' ? (
                              <div className="chat-user-img align-self-center mr-3">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    {users[activeUser].name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <img src={users[activeUser].profilePicture} alt="chatvia" />
                            )}
                          </div>
                        )}

                        <div className="user-chat-content">
                          <div className="ctext-wrap">
                            <div className="ctext-wrap-content">
                              {chat.message && <p className="mb-0">{chat.message}</p>}
                              {chat.imageMessage && <ChatPhotoList photos={chat.imageMessage} />}
                              {chat.fileMessage && (
                                <ChatFileList fileName={chat.fileMessage} fileSize={chat.size} />
                              )}
                              {chat.isTyping && (
                                <p className="mb-0">
                                  typing
                                  <span className="animate-typing">
                                    <span className="dot ml-1"></span>
                                    <span className="dot ml-1"></span>
                                    <span className="dot ml-1"></span>
                                  </span>
                                </p>
                              )}
                              {!chat.isTyping && (
                                <p className="chat-time mb-0">
                                  <i className="ri-time-line align-middle"></i>{' '}
                                  <span className="align-middle">{chat.time}</span>
                                </p>
                              )}
                            </div>
                            {!chat.isTyping && (
                              <UncontrolledDropdown className="align-self-start">
                                <DropdownToggle tag="a">
                                  <i className="ri-more-2-fill"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem>
                                    {t('Copy')}{' '}
                                    <i className="ri-file-copy-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem>
                                    {t('Save')}{' '}
                                    <i className="ri-save-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem onClick={toggle}>
                                    Forward{' '}
                                    <i className="ri-chat-forward-line float-right text-muted"></i>
                                  </DropdownItem>
                                  <DropdownItem onClick={() => deleteMessage(chat.id)}>
                                    Delete{' '}
                                    <i className="ri-delete-bin-line float-right text-muted"></i>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            )}
                          </div>
                          {chatMessages[key + 1] ? (
                            chatMessages[key].userType === chatMessages[key + 1].userType ? null : (
                              <div className="conversation-name">
                                {chat.userType === 'sender'
                                  ? 'Patricia Smith'
                                  : users[activeUser].name}
                              </div>
                            )
                          ) : (
                            <div className="conversation-name">
                              {chat.userType === 'sender' ? 'Admin' : users[activeUser].name}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </SimpleBar>

            <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
              <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
              <ModalBody>
                <CardBody className="p-2">
                  <SimpleBar style={{ maxHeight: '200px' }}>
                    <ContactFinder {...{ contacts }} handleCheck={() => {}} />
                  </SimpleBar>
                  <ModalFooter className="border-0">
                    <Button color="primary">Forward</Button>
                  </ModalFooter>
                </CardBody>
              </ModalBody>
            </Modal>

            <ChatInput onCreateMessage={addMessage} />
          </div>

          <ContactProfileSidebar {...{ userSidebar }} activeUser={users[activeUser]} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Chat;
