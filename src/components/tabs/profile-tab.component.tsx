import CustomCollapse from 'components/collapse/custom-collapse.component';
import Files from 'components/files/files.component';
import { usePosition } from 'hooks/use-position';
import moment from 'moment';
import classnames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseReducer } from 'react-redux-firebase';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card } from 'reactstrap';
import { IProfile } from 'store';

type ProfileTabProps = {
  profile: FirebaseReducer.Profile<IProfile>;
};
const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  const { t } = useTranslation();

  // TODO refactor files
  const [files] = useState([
    { name: 'file-1.zip', size: '12.5 MB', thumbnail: 'ri-file-text-fill' },
    { name: 'file-2.png', size: '4.2 MB', thumbnail: 'ri-image-fill' },
    { name: 'file-3.png', size: '3.1 MB', thumbnail: 'ri-image-fill' },
    { name: 'file-3.zip', size: '6.7 MB', thumbnail: 'ri-file-text-fill' },
  ]);
  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
  const [showCollapsibleProfile, setShowCollaposibleProfile] = useState<boolean>(true);
  const [showCollapsibleFiles, setShowCollaposibleFiles] = useState<boolean>(false);
  const [position, positionError] = usePosition();

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
        <div className="user-chat-nav float-right">
          <Dropdown isOpen={showProfileOptions} toggle={toggleProfileOptions}>
            <DropdownToggle tag="a" className="font-size-18 text-muted dropdown-toggle">
              <i className="ri-more-2-fill"></i>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>{t('Edit')}</DropdownItem>
              <DropdownItem>{t('Settings')}</DropdownItem>
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
            src={profile.photoURL}
            alt="profile"
            className="rounded-circle avatar-lg img-thumbnail"
          />
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">{profile.displayName}</h5>
        <p className="text-muted text-truncate mb-1">
          {profile.status ? (
            <>
              <i
                className={classnames(
                  {
                    'text-success': profile.status === 'Online',
                    'text-warning': profile.status === 'Busy',
                  },
                  'ri-record-circle-fill font-size-10  mr-1 d-inline-block',
                )}
              ></i>{' '}
              {t(profile.status)}
            </>
          ) : (
            t('Status not set')
          )}
        </p>
      </div>

      <div className="p-4 user-profile-desc">
        <div className="text-muted">
          <p className="mb-4">
            {profile.description ? profile.description : t('No profile description set.')}
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
                <h5 className="font-size-14">{profile.displayName}</h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Email')}</p>
                <h5 className="font-size-14">{profile.email}</h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Time')}</p>
                <h5 className="font-size-14">{moment().format('hh:mm a')}</h5>
              </div>

              <div className="mt-4">
                <p className="text-muted mb-1">{t('Location')}</p>
                <h5 className="font-size-14 mb-0">
                  {profile.location
                    ? profile.location
                    : positionError || !position
                    ? t('Failed to fetch coordinates')
                    : `(${position.latitude.toFixed(4)},${position.longitude.toFixed(4)})`}
                </h5>
              </div>
            </CustomCollapse>
          </Card>

          <Card className="mb-1 shadow-none border">
            <CustomCollapse
              title="Uploaded Files"
              iconClass="ri-attachment-line"
              isOpen={showCollapsibleFiles}
              toggleCollapse={toggleFilesCollapsible}
            >
              <Files files={files} />
            </CustomCollapse>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
