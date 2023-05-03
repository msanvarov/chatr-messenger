import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMoment from 'react-moment';
import { Button, Card, Media } from 'reactstrap';
import SimpleBar from 'simplebar-react';

import { IChannel, toggleUserSidebar, useAppDispatch } from '../../redux';
import { CustomCollapse } from '../tabs/custom-collapse.component';
import GroupCard from '../tabs/profile-tab/group-card.component';

type ContactProfileSidebarProps = {
  displayName: string | null;
  channel: IChannel | null;
  userSidebar: boolean;
};

const ContactProfileSidebar: React.FC<ContactProfileSidebarProps> = ({
  displayName,
  channel,
  userSidebar,
}) => {
  const { t } = useTranslation();
  const [isProfileDropdownOpen, setIsOpen1] = useState(true);
  const dispatch = useAppDispatch();
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [groups] = useState([
    { name: 'Admin-A.zip', size: '12.5 MB', thumbnail: 'ri-file-text-fill' },
    { name: 'Image-1.jpg', size: '4.2 MB', thumbnail: 'ri-image-fill' },
    { name: 'Image-2.jpg', size: '3.1 MB', thumbnail: 'ri-image-fill' },
    { name: 'Landing-A.zip', size: '6.7 MB', thumbnail: 'ri-file-text-fill' },
  ]);

  const toggleCollapse1 = () => {
    setIsOpen1(!isProfileDropdownOpen);
    setIsOpen2(false);
    setIsOpen3(false);
  };

  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen1(false);
    setIsOpen3(false);
  };

  const toggleCollapse3 = () => {
    setIsOpen3(!isOpen3);
    setIsOpen1(false);
    setIsOpen2(false);
  };

  const closeuserSidebar = () => {
    dispatch(toggleUserSidebar());
  };
  return (
    <div
      style={{ display: userSidebar ? 'block' : 'none' }}
      className="user-profile-sidebar"
    >
      <div className="px-3 px-lg-4 pt-3 pt-lg-4">
        <div className="user-chat-nav text-end">
          <Button
            color="none"
            type="button"
            onClick={closeuserSidebar}
            className="nav-btn"
            id="user-profile-hide"
          >
            <i className="ri-close-line"></i>
          </Button>
        </div>
      </div>

      <div className="text-center p-4 border-bottom">
        <div className="mb-4 d-flex justify-content-center">
          {channel?.photoURL ? (
            <img
              src={channel?.photoURL}
              className="rounded-circle avatar-lg img-thumbnail"
              alt="chatr"
            />
          ) : (
            <div className="avatar-lg">
              <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                {channel?.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">
          Channel: #{channel?.name}
        </h5>
        {/* <p className="text-muted text-truncate mb-1">
          {(() => {
            switch (activeUser.status) {
              case 'online':
                return (
                  <>
                    <i className="ri-record-circle-fill font-size-10 text-success me-1"></i>
                  </>
                );

              case 'away':
                return (
                  <>
                    <i className="ri-record-circle-fill font-size-10 text-warning me-1"></i>
                  </>
                );

              case 'offline':
                return (
                  <>
                    <i className="ri-record-circle-fill font-size-10 text-secondary me-1"></i>
                  </>
                );

              default:
                return;
            }
          })()}
          Active
        </p>*/}
      </div>
      {/* End profile user */}

      {/* Start user-profile-desc */}
      <SimpleBar
        style={{ maxHeight: '100%' }}
        className="p-4 user-profile-desc"
      >
        <div id="profile-user-accordion" className="custom-accordion">
          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Channel"
              iconClass="ri-group-2-line"
              isOpen={isProfileDropdownOpen}
              toggleCollapse={toggleCollapse1}
            >
              <div>
                <p className="text-muted mb-1">{t('Name')}</p>
                <h5 className="font-size-14">
                  {channel?.isDirectMessage
                    ? channel?.name
                    : `#${channel?.name}`}
                </h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Time')}</p>
                <h5 className="font-size-14">
                  <ReactMoment format="hh:mm a" />
                </h5>
              </div>
            </CustomCollapse>
          </Card>

          <Card className="mb-1 shadow-none border">
            <CustomCollapse
              title="Attached Files"
              iconClass="ri-attachment-line"
              isOpen={isOpen2}
              toggleCollapse={toggleCollapse2}
            >
              <GroupCard {...{ groups }} />
            </CustomCollapse>
          </Card>

          <Card className="mb-1 shadow-none border">
            <CustomCollapse
              title="Members"
              iconClass="ri-group-line"
              isOpen={isOpen3}
              toggleCollapse={toggleCollapse3}
            >
              {channel?.members?.map((member, i) => (
                <Card className="p-2 mb-2" key={i}>
                  <Media className="d-flex align-items-center">
                    <div className="chat-user-img me-3 ms-0">
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {member.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <Media body className="flex-grow-1 overflow-hidden">
                      <h5 className="text-truncate font-size-14 mb-0">
                        {member}
                      </h5>
                    </Media>
                  </Media>
                </Card>
              ))}
            </CustomCollapse>
          </Card>
        </div>
      </SimpleBar>
      {/* end user-profile-desc */}
    </div>
  );
};

export default ContactProfileSidebar;
