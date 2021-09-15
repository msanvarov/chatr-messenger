import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ReactMoment from 'react-moment';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom';
import { Input, InputGroupAddon, InputGroup, Media, Button } from 'reactstrap';

import {
  AppState,
  fetchChannel,
  IChannel,
  setLastViewedChannel,
  setUserMetadata,
  useAppDispatch,
  useAppSelector,
} from '@chatr/redux';
import ContactsCarousel from './contacts-carousel.component';

type ChatRoomsTabProps = {
  uid: string;
  channels: IChannel[];
  lastViewedChannel: string | null;
};

export const ChatRoomsTab: React.FC<ChatRoomsTabProps> = ({
  uid,
  channels,
  lastViewedChannel,
}) => {
  const dispatch = useAppDispatch();
  const [chatFilter, setChatFilter] = useState<string>('');
  const [channelsList, setChatList] = useState<IChannel[]>(channels);
  const { openedChannel } = useAppSelector((state: AppState) => state.channel);

  useEffect(() => {
    if (openedChannel) {
      const ifMessageLengthsDontMatch =
        channels.find((channel) => channel.id === openedChannel.id)?.messages
          .length !== openedChannel.messages.length;

      console.log(channels, openedChannel);

      if (ifMessageLengthsDontMatch) {
        return setChatList([
          openedChannel,
          ...channels.filter((channel) => channel.id !== openedChannel.id),
        ]);
      }
    }
    setChatList(channels);
  }, [channels, openedChannel]);

  useEffect(() => {
    const li = document.getElementById(`conversation-${lastViewedChannel}`);
    if (li) li.classList.add('active');
    return () => {
      li?.classList.remove('active');
    };
  }, [lastViewedChannel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatFilter(e.target.value);
    console.log(e.target.value);
    if (e.target.value !== '') {
      setChatList(
        channels.filter(
          (chat) =>
            chat.name[uid].toLowerCase().includes(e.target.value) ||
            chat.name[uid].toUpperCase().includes(e.target.value)
        )
      );
    } else {
      setChatList(channels);
    }
  };

  const onOpenChat = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    chat: IChannel
  ) => {
    e.preventDefault();
    const clickedChat = e.target as Element;
    // set last viewed channel
    dispatch(setUserMetadata({ uid, lastViewedChannel: chat.id }));
    dispatch(setLastViewedChannel(chat.id));
    dispatch(fetchChannel(chat.id));
    const chatListEl = document.getElementById('chat-list');
    let currentLi: HTMLLIElement | null = null;
    if (chatListEl) {
      const li = chatListEl.getElementsByTagName('li');

      for (let i = 0; i < li.length; ++i) {
        if (li[i].classList.contains('active')) {
          li[i].classList.remove('active');
        }
      }

      for (let k = 0; k < li.length; ++k) {
        if (li[k].contains(clickedChat)) {
          currentLi = li[k];
          break;
        }
      }
    }
    // activation of clicked coversation user
    if (currentLi) {
      currentLi.classList.add('active');
    }

    const userChat = document.getElementsByClassName('user-chat');
    if (userChat) {
      userChat[0].classList.add('user-chat-show');
    }

    // removes unread badge if user clicks
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
              <Button
                color="link"
                className="text-muted pr-1 text-decoration-none"
                type="button"
              >
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

      <ContactsCarousel {...{ uid }} />

      <div className="px-2">
        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
        <SimpleBar style={{ maxHeight: '100%' }} className="chat-message-list">
          <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
            {channelsList.map((chat, key) => (
              <li
                key={key}
                id={`conversation-${chat.id}`}
                className={classnames({
                  active: chat.id === lastViewedChannel,
                })}
              >
                <Link to="#" onClick={(e) => onOpenChat(e, chat)}>
                  <Media>
                    {!chat.photoURL ? (
                      <div className="chat-user-img align-self-center mr-3">
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            {chat.name[uid].charAt(0)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="chat-user-img align-self-center mr-3">
                        <img
                          src={chat.photoURL}
                          className="rounded-circle avatar-xs"
                          alt="chatr"
                        />
                      </div>
                    )}

                    <Media body className="overflow-hidden">
                      <h5 className="text-truncate font-size-15 mb-1">
                        {chat.name[uid]}
                      </h5>
                      <p className="chat-user-message text-truncate mb-0">
                        {chat.messages && chat.messages.length > 0
                          ? chat.messages[chat.messages.length - 1].content
                          : null}
                      </p>
                    </Media>
                    <div className="font-size-11">
                      {chat.messages && chat.messages.length > 0 ? (
                        <ReactMoment format="hh:mm a">
                          {chat.messages[chat.messages.length - 1].createdAt}
                        </ReactMoment>
                      ) : null}
                    </div>
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
