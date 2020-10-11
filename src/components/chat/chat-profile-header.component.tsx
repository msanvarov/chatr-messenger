import React, { useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
  Button,
  Input,
  Row,
  Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { IChatState } from 'store/chat';
import * as layoutActions from 'store/layout/actions';
import * as chatActions from 'store/chat/actions';
import { useDispatch } from 'react-redux';

type ChatProfileHeaderProps = Pick<IChatState, 'activeUser' | 'users'>;

// TODO better dropdown useState hook names

const ChatProfileHeader: React.FC<ChatProfileHeaderProps> = ({ users, activeUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownOpen1, setDropdownOpen1] = useState<boolean>(false);
  const dispatch = useDispatch();

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

  const openUserSidebar = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(layoutActions.openUserSidebar());
  };

  const closeUserChat = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const userChat = document.getElementsByClassName('user-chat');
    if (userChat) {
      userChat[0].classList.remove('user-chat-show');
    }
  };

  const deleteMessage = () => {
    const copiedUsers = users;
    copiedUsers[activeUser].messages = [];
    dispatch(chatActions.setFullUser(copiedUsers));
  };

  return (
    <>
      <div className="p-3 p-lg-4 border-bottom">
        <Row className="align-items-center">
          <Col sm={4} xs={8}>
            <Media className="align-items-center">
              <div className="d-block d-lg-none mr-2">
                <Link
                  to="#"
                  onClick={closeUserChat}
                  className="user-chat-remove text-muted font-size-16 p-2"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </Link>
              </div>
              {users[activeUser].profilePicture !== 'Null' ? (
                <div className="mr-3">
                  <img
                    src={users[activeUser].profilePicture}
                    className="rounded-circle avatar-xs"
                    alt="profile"
                  />
                </div>
              ) : (
                <div className="chat-user-img align-self-center mr-3">
                  <div className="avatar-xs">
                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                      {users[activeUser].name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}

              <Media body className="overflow-hidden">
                <h5 className="font-size-16 mb-0 text-truncate">
                  <Link to="#" onClick={openUserSidebar} className="text-reset user-profile-show">
                    {users[activeUser].name}
                  </Link>
                  {(() => {
                    switch (users[activeUser].status) {
                      case 'online':
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ml-1"></i>
                          </>
                        );

                      case 'away':
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ml-1"></i>
                          </>
                        );

                      case 'offline':
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ml-1"></i>
                          </>
                        );

                      default:
                        return;
                    }
                  })()}
                </h5>
              </Media>
            </Media>
          </Col>
          <Col sm={8} xs={4}>
            <ul className="list-inline user-chat-nav text-right mb-0">
              <li className="list-inline-item">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle color="none" className="btn nav-btn " type="button">
                    <i className="ri-search-line"></i>
                  </DropdownToggle>
                  <DropdownMenu right className="p-0  dropdown-menu-md">
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
                  onClick={openUserSidebar}
                  className="nav-btn user-profile-show"
                >
                  <i className="ri-user-2-line"></i>
                </Button>
              </li>

              <li className="list-inline-item">
                <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                  <DropdownToggle className="btn nav-btn " color="none" type="button">
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      className="d-block d-lg-none user-profile-show"
                      onClick={openUserSidebar}
                    >
                      View profile <i className="ri-user-2-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      Archive <i className="ri-archive-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      Muted <i className="ri-volume-mute-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem onClick={deleteMessage}>
                      Delete <i className="ri-delete-bin-line float-right text-muted"></i>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatProfileHeader;