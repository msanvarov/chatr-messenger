import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import ReactMoment from 'react-moment';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, InputGroup, Media, Spinner } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { useQueryOnUserChannels } from '../../../hooks';

import { IChannel, setLastOpenedChannel, useAppDispatch } from '../../../redux';
import { getDirectMessagingChannelMetadata } from '../../../utils';
import ContactsCarousel from './contacts-carousel.component';

type ChatRoomsTabProps = {
  uid: string;
  lastOpenedChannel?: string | null;
};

export const ChatRoomsTab: React.FC<ChatRoomsTabProps> = ({
  uid,
  lastOpenedChannel,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userChannelsSearchQuery, setUserChannelsSearchQuery] =
    useState<string>();
  const { channels: channelsList, loading } = useQueryOnUserChannels(
    uid,
    userChannelsSearchQuery
  );

  useEffect(() => {
    const li = document.getElementById(`conversation-${lastOpenedChannel}`);
    if (li) li.classList.add('active');
    return () => {
      li?.classList.remove('active');
    };
  }, [lastOpenedChannel]);

  const onOpenChat = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    chat: IChannel
  ) => {
    e.preventDefault();

    // set last viewed channel
    dispatch(setLastOpenedChannel({ channelId: chat.id, uid }));

    navigate(`/${chat.id}`);

    // TODO: Implement unread messages
    // const unread = document.querySelector(`#unRead${chat.id}`);
    // if (unread) {
    //   unread.style.display = 'none';
    // }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner className="spinner" color="dark" type="grow" />
      </div>
    );
  }
  return (
    <>
      <div className="px-4 pt-4">
        <h4 className="mb-4">Chats</h4>
        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="mb-3 bg-light rounded-lg">
            <Button
              color="link"
              className="text-muted pr-1 text-decoration-none"
              type="button"
            >
              <i className="ri-search-line search-icon font-size-18"></i>
            </Button>
            <Input
              type="text"
              value={userChannelsSearchQuery}
              onChange={(e) => setUserChannelsSearchQuery(e.target.value)}
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
                  active: chat.id === lastOpenedChannel,
                })}
              >
                <Link to={`/${chat.id}`} onClick={(e) => onOpenChat(e, chat)}>
                  <Media className="d-flex">
                    {chat.photoURL ? (
                      <div className="chat-user-img align-self-center me-3 ms-0">
                        <img
                          src={chat.photoURL}
                          className="rounded-circle avatar-xs"
                          alt="chatr"
                        />
                        {/* TODO: Implement the online status */}
                        <span className="user-status"></span>
                      </div>
                    ) : (
                      <div className="chat-user-img align-self-center me-3 ms-0">
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            {chat.name.charAt(0)}
                          </span>
                        </div>
                        {/* TODO: Implement the online status */}
                        <span className="user-status"></span>
                      </div>
                    )}

                    <Media body className="flex-grow-1 overflow-hidden">
                      <h5 className="text-truncate font-size-15 mb-1">
                        {chat.isDirectMessage
                          ? getDirectMessagingChannelMetadata(
                              uid,
                              chat.directMessageMetadata
                            )?.name
                          : `#${chat.name}`}
                      </h5>
                      <p className="chat-user-message text-truncate mb-0">
                        {chat.lastMessage?.text.slice(0, 30) + '...'}
                      </p>
                    </Media>
                    <div className="font-size-10">
                      <ReactMoment fromNow>
                        {chat.lastMessage?.timestamp}
                      </ReactMoment>
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
