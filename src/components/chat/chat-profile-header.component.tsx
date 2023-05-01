import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Media,
  Row,
} from 'reactstrap';
import {
  IChannel,
  deleteUserFromChannel,
  toggleUserSidebar,
  useAppDispatch,
} from '../../redux';

type ChatProfileHeaderProps = {
  uid: string;
  channel: IChannel | null;
};

const ChatProfileHeader: React.FC<ChatProfileHeaderProps> = ({
  uid,
  channel,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownOpen1, setDropdownOpen1] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

  const onClickToggleUserSidebar = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(toggleUserSidebar());
  };

  const closeUserChat = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const userChat = document.getElementsByClassName('user-chat');
    if (userChat) {
      userChat[0].classList.remove('user-chat-show');
    }
  };

  const deleteChat = () => {
    if (channel) {
      dispatch(deleteUserFromChannel({ userId: uid, channelId: channel.id }));
    }
  };

  return (
    <div className="p-3 p-lg-4 border-bottom">
      <Row className="align-items-center">
        <Col sm={4} xs={8}>
          <Media className="d-flex align-items-center">
            <div className="d-block d-lg-none me-2">
              <Link
                to="#"
                onClick={closeUserChat}
                className="user-chat-remove text-muted font-size-16 p-2"
              >
                <i className="ri-arrow-left-s-line"></i>
              </Link>
            </div>
            {channel?.photoURL ? (
              <div className="me-3 ms-0">
                <img
                  src={channel?.photoURL}
                  className="rounded-circle avatar-xs"
                  alt="profile"
                />
              </div>
            ) : (
              <div className="chat-user-img align-self-center me-3">
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                    {channel?.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}

            <Media body className="flex-grow-1 overflow-hidden">
              <h5 className="font-size-16 mb-0 text-truncate">
                <Link
                  to="#"
                  onClick={onClickToggleUserSidebar}
                  className="text-reset user-profile-show"
                >
                  {channel?.name}
                </Link>
                {/* TODO add presence */}
                {/* {(() => {
                  switch (lastViewedChannel.status) {
                    case 'online':
                      return (
                        <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                      );

                    case 'away':
                      return (
                        <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ms-1"></i>
                      );

                    case 'offline':
                      return (
                        <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                      );

                    default:
                      return;
                  }
                })()} */}
              </h5>
            </Media>
          </Media>
        </Col>
        <Col sm={8} xs={4}>
          <ul className="list-inline user-chat-nav text-end mb-0">
            <li className="list-inline-item">
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                  color="none"
                  className="btn nav-btn "
                  type="button"
                >
                  <i className="ri-search-line"></i>
                </DropdownToggle>
                <DropdownMenu end className="p-0  dropdown-menu-md">
                  <div className="search-box p-2">
                    <Input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="Search.."
                    />
                  </div>
                </DropdownMenu>
              </Dropdown>
            </li>

            <li className="list-inline-item d-none d-lg-inline-block">
              <Button
                type="button"
                color="none"
                onClick={onClickToggleUserSidebar}
                className="nav-btn user-profile-show"
              >
                <i className="ri-user-2-line"></i>
              </Button>
            </li>

            <li className="list-inline-item">
              <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                <DropdownToggle
                  className="btn nav-btn "
                  color="none"
                  type="button"
                >
                  <i className="ri-more-fill"></i>
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    className="d-block d-lg-none user-profile-show"
                    onClick={onClickToggleUserSidebar}
                  >
                    View profile{' '}
                    <i className="ri-user-2-line float-end text-muted"></i>
                  </DropdownItem>
                  <DropdownItem>
                    Archive{' '}
                    <i className="ri-archive-line float-end text-muted"></i>
                  </DropdownItem>
                  <DropdownItem>
                    Muted{' '}
                    <i className="ri-volume-mute-line float-end text-muted"></i>
                  </DropdownItem>
                  <DropdownItem onClick={deleteChat}>
                    Delete{' '}
                    <i className="ri-delete-bin-line float-end text-muted"></i>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default ChatProfileHeader;
