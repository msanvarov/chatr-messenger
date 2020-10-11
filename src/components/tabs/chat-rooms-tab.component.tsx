import React, { useEffect, useState } from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import ContactsCarousel from 'components/contacts/contacts-carousel/contacts-carousel.component';
import { IActiveUser, IChatState, IUser } from 'store/chat';
import * as chatActions from 'store/chat/actions';
import { useDispatch } from 'react-redux';

// TODO refactor with firebase data and update types
type ChatRoomsTabProps = Pick<IChatState, 'users'> & IActiveUser;
const ChatRoomsTab: React.FC<ChatRoomsTabProps> = ({ activeUser, users: recentChatList }) => {
  const dispatch = useDispatch();
  const [chatFilter, setChatFilter] = useState<string>('');
  const [chatList, setChatList] = useState<IUser[]>(recentChatList);
  useEffect(() => {
    const li = document.getElementById(`conversation${activeUser}`);
    if (li) li.classList.add('active');
    return () => {
      li?.classList.remove('active');
    };
  }, [activeUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatFilter(e.target.value);
    if (chatFilter !== '') {
      setChatList(
        chatList.filter(
          (chat) =>
            chat.name.toLowerCase().includes(chatFilter) ||
            chat.name.toUpperCase().includes(chatFilter),
        ),
      );
    } else {
      setChatList(recentChatList);
    }
  };

  const onOpenChat = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, chat: IUser) => {
    e.preventDefault();
    const clickedChat = e.target as Element;
    const chatIndex = chatList.indexOf(chat);
    // set active user
    dispatch(chatActions.activeUser(chatIndex));
    const chatListEl = document.getElementById('chat-list');
    let currentLi: HTMLLIElement | null = null;
    if (chatListEl) {
      // apologizing to fp gods for this code. But I couldn't do [...chatListEl.getElementsByTagName('li')] without ts saying no
      const li = chatListEl.getElementsByTagName('li');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < li.length; ++i) {
        if (li[i].classList.contains('active')) {
          li[i].classList.remove('active');
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < li.length; ++k) {
        if (li[k].contains(clickedChat)) {
          currentLi = li[k];
          break;
        }
      }
    }
    //activation of clicked coversation user
    if (currentLi) {
      currentLi.classList.add('active');
    }

    const userChat = document.getElementsByClassName('user-chat');
    if (userChat) {
      userChat[0].classList.add('user-chat-show');
    }

    //removes unread badge if user clicks
    const unread = document.getElementById('unRead' + chat.id);
    if (unread) {
      unread.style.display = 'none';
    }
  };

  return (
    <>
      <div className="px-4 pt-4">
        <h4 className="mb-4">Chats</h4>
        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="mb-3 bg-light rounded-lg">
            <InputGroupAddon addonType="prepend">
              <Button color="link" className="text-muted pr-1 text-decoration-none" type="button">
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
            </InputGroupAddon>
            <Input
              type="text"
              value={chatFilter}
              onChange={handleChange}
              className="form-control bg-light"
              placeholder="Search messages or users"
            />
          </InputGroup>
        </div>
      </div>

      <ContactsCarousel />

      <div className="px-2">
        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
        <SimpleBar style={{ maxHeight: '100%' }} className="chat-message-list">
          <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
            {chatList.map((chat, key) => (
              <li
                key={key}
                id={'conversation' + key}
                className={
                  chat.unRead
                    ? 'unread'
                    : chat.isTyping
                    ? 'typing'
                    : key === activeUser
                    ? 'active'
                    : ''
                }
              >
                <Link to="#" onClick={(e) => onOpenChat(e, chat)}>
                  <Media>
                    {chat.profilePicture === 'Null' ? (
                      <div className={'chat-user-img ' + chat.status + ' align-self-center mr-3'}>
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            {chat.name.charAt(0)}
                          </span>
                        </div>
                        {chat.status && <span className="user-status"></span>}
                      </div>
                    ) : (
                      <div className={'chat-user-img ' + chat.status + ' align-self-center mr-3'}>
                        <img
                          src={chat.profilePicture}
                          className="rounded-circle avatar-xs"
                          alt="chatvia"
                        />
                        {chat.status && <span className="user-status"></span>}
                      </div>
                    )}

                    <Media body className="overflow-hidden">
                      <h5 className="text-truncate font-size-15 mb-1">{chat.name}</h5>
                      <p className="chat-user-message text-truncate mb-0">
                        {chat.isTyping ? (
                          <>
                            typing
                            <span className="animate-typing">
                              <span className="dot ml-1"></span>
                              <span className="dot ml-1"></span>
                              <span className="dot ml-1"></span>
                            </span>
                          </>
                        ) : (
                          <>
                            {chat.messages &&
                            chat.messages.length > 0 &&
                            chat.messages[chat.messages.length - 1].isImageMessage === true ? (
                              <i className="ri-image-fill align-middle mr-1"></i>
                            ) : null}
                            {chat.messages &&
                            chat.messages.length > 0 &&
                            chat.messages[chat.messages.length - 1].isFileMessage === true ? (
                              <i className="ri-file-text-fill align-middle mr-1"></i>
                            ) : null}
                            {chat.messages && chat.messages.length > 0
                              ? chat.messages[chat.messages.length - 1].message
                              : null}
                          </>
                        )}
                      </p>
                    </Media>
                    <div className="font-size-11">
                      {chat.messages && chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].time
                        : null}
                    </div>
                    {chat.unRead === 0 ? null : (
                      <div className="unread-message" id={'unRead' + chat.id}>
                        <span className="badge badge-soft-danger badge-pill">
                          {chat.messages && chat.messages.length > 0
                            ? chat.unRead >= 20
                              ? chat.unRead + '+'
                              : chat.unRead
                            : ''}
                        </span>
                      </div>
                    )}
                  </Media>
                </Link>
              </li>
            ))}
          </ul>
        </SimpleBar>
      </div>
    </>
  );
};

export default ChatRoomsTab;
