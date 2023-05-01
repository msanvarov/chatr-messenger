import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMoment from 'react-moment';
import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';

import { useGeolocation } from 'react-use';
import { IUserState, setActiveTab, useAppDispatch } from '../../../redux';
import { CustomCollapse } from '../custom-collapse.component';
import GroupCard from './group-card.component';

// TODO fix typing for profile tab
type ProfileTabProps = {
  profile: IUserState;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // TODO: Change faviourite channels state to redux
  const [favouriteChannels] = useState([
    { name: 'Design', thumbnail: 'ri-image-fill' },
    { name: 'TikTok', thumbnail: 'ri-image-fill' },
    { name: 'Firebase', thumbnail: 'ri-image-fill' },
  ]);

  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
  const [showCollapsibleProfile, setShowCollaposibleProfile] =
    useState<boolean>(true);
  const [showCollapsibleFiles, setShowCollaposibleFiles] =
    useState<boolean>(false);
  const position = useGeolocation();

  const toggleProfileCollapsible = () => {
    setShowCollaposibleProfile(!showCollapsibleProfile);
    setShowCollaposibleFiles(false);
  };

  const toggleFilesCollapsible = () => {
    setShowCollaposibleFiles(!showCollapsibleFiles);
    setShowCollaposibleProfile(false);
  };

  const toggleProfileOptions = () => setShowProfileOptions(!showProfileOptions);

  return (
    <>
      <div className="px-4 pt-4">
        <div className="user-chat-nav float-end">
          <Dropdown isOpen={showProfileOptions} toggle={toggleProfileOptions}>
            <DropdownToggle
              tag="a"
              className="font-size-18 text-muted dropdown-toggle"
            >
              <i className="ri-more-2-fill"></i>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem onClick={() => dispatch(setActiveTab('settings'))}>
                {t('Edit')}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>{t('Help')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <h4 className="mb-0">{t('Profile')}</h4>
      </div>

      <div className="text-center p-4 border-bottom">
        <div className="mb-4">
          <img
            src={profile?.photoURL || 'https://via.placeholder.com/200'}
            alt="profile"
            className="rounded-circle avatar-lg img-thumbnail"
          />
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">
          {profile?.displayName}
        </h5>
        {/* <p className="text-muted text-truncate mb-1">
          {profile?.status ? (
            <>
              <i
                className={classnames(
                  {
                    'text-success': profile.status === 'Online',
                    'text-warning': profile.status === 'Busy',
                  },
                  'ri-record-circle-fill font-size-10  me-1 d-inline-block'
                )}
              ></i>{' '}
              {t(profile.status)}
            </>
          ) : (
            t('Status not set')
          )}
        </p> */}
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        className="p-4 user-profile-desc"
      >
        <div className="text-muted">
          <p className="mb-4">
            {t('Description')}:{' '}
            {profile?.bio ? profile.bio : t('No profile description set.')}
          </p>
        </div>

        <div id="profile-user-accordion-1" className="custom-accordion">
          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="My Profile"
              iconClass="ri-user-2-line"
              isOpen={showCollapsibleProfile}
              toggleCollapse={toggleProfileCollapsible}
            >
              <div>
                <p className="text-muted mb-1">{t('Name')}</p>
                <h5 className="font-size-14">{profile?.displayName}</h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Email')}</p>
                <h5 className="font-size-14">{profile?.email}</h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Time')}</p>
                <h5 className="font-size-14">
                  <ReactMoment format="hh:mm a" />
                </h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Location')}</p>
                <h5 className="font-size-14 mb-0">
                  {profile?.location
                    ? profile?.location
                    : !position
                    ? t('Failed to fetch coordinates')
                    : `(${position.latitude?.toFixed(4) ?? 'No Lat'},${
                        position.longitude?.toFixed(4) ?? 'No Long'
                      })`}
                </h5>
              </div>
            </CustomCollapse>
          </Card>

          <Card className="mb-1 shadow-none border">
            <CustomCollapse
              title={t('Favourite Channels')}
              iconClass="ri-star-line"
              isOpen={showCollapsibleFiles}
              toggleCollapse={toggleFilesCollapsible}
            >
              <GroupCard groups={favouriteChannels} />
            </CustomCollapse>
          </Card>
        </div>
      </SimpleBar>
    </>
  );
};

export default ProfileTab;
