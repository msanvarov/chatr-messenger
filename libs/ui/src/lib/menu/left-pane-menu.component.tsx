import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Spinner,
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { i18n } from '@chatr/i18n';
import {
  useAppSelector,
  useAppDispatch,
  setActiveTab,
  ActiveTab,
  AppState,
} from '@chatr/redux';
import LogoLightPng from '../../assets/logo-light.png';
import LogoDarkPng from '../../assets/logo-dark.png';
import UsFlagJpg from '../../assets/photos/flags/us.jpg';
import GermanyFlagJpg from '../../assets/photos/flags/germany.jpg';
import ItalyFlagJpg from '../../assets/photos/flags/italy.jpg';
import RussiaFlagJpg from '../../assets/photos/flags/russia.jpg';

type Languages = {
  en: 'English';
  de: 'German';
  ru: 'Russian';
  it: 'Italian';
};

export const LeftPaneMenu: React.FC = () => {
  const activeTab = useAppSelector((state: AppState) => state.layout.activeTab);
  const profile = useAppSelector((state: AppState) => state.user);
  const [language, setLanguage] =
    useState<Languages[keyof Languages]>('English');
  const dispatch = useAppDispatch();
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const [showLanguageDropdown, setShowLanguageDropdown] =
    useState<boolean>(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState<boolean>(false);

  const toggleMobile = () => setShowMobileDropdown(!showMobileDropdown);
  const toggleLanguage = () => setShowLanguageDropdown(!showLanguageDropdown);
  const toggleProfile = () => setShowProfileDropdown(!showProfileDropdown);
  const toggleTab = (tab: ActiveTab) => dispatch(setActiveTab(tab));

  const changeLanguageAction = (lng: keyof Languages) => {
    i18n.changeLanguage(lng);

    if (lng === 'de') setLanguage('German');
    else if (lng === 'ru') setLanguage('Russian');
    else if (lng === 'it') setLanguage('Italian');
    else if (lng === 'en') setLanguage('English');
  };
  return (
    <div className="side-menu flex-lg-column mr-lg-1">
      <div className="navbar-brand-box">
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src={LogoDarkPng} alt="logo" height="30" />
          </span>
        </Link>

        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src={LogoLightPng} alt="logo" height="30" />
          </span>
        </Link>
      </div>

      <div className="flex-lg-column my-auto">
        <Nav
          pills
          className="side-menu-nav justify-content-center"
          role="tablist"
        >
          <NavItem id="profile">
            <NavLink
              id="pills-user-tab"
              className={classnames({ active: activeTab === 'profile' })}
              onClick={() => {
                toggleTab('profile');
              }}
            >
              <i className="ri-user-2-line"></i>
            </NavLink>
          </NavItem>
          <UncontrolledTooltip target="profile" placement="top">
            Profile
          </UncontrolledTooltip>
          <NavItem id="Chats">
            <NavLink
              id="pills-chat-tab"
              className={classnames({ active: activeTab === 'chat' })}
              onClick={() => {
                toggleTab('chat');
              }}
            >
              <i className="ri-message-3-line"></i>
            </NavLink>
          </NavItem>
          <UncontrolledTooltip target="Chats" placement="top">
            Chats
          </UncontrolledTooltip>
          <NavItem id="Channels">
            <NavLink
              id="pills-groups-tab"
              className={classnames({ active: activeTab === 'channels' })}
              onClick={() => {
                toggleTab('channels');
              }}
            >
              <i className="ri-group-line"></i>
            </NavLink>
          </NavItem>
          <UncontrolledTooltip target="Channels" placement="top">
            Channels
          </UncontrolledTooltip>
          <NavItem id="Contacts">
            <NavLink
              id="pills-contacts-tab"
              className={classnames({ active: activeTab === 'contacts' })}
              onClick={() => {
                toggleTab('contacts');
              }}
            >
              <i className="ri-contacts-line"></i>
            </NavLink>
          </NavItem>
          <UncontrolledTooltip target="Contacts" placement="top">
            Contacts
          </UncontrolledTooltip>
          <NavItem id="Settings">
            <NavLink
              id="pills-setting-tab"
              className={classnames({ active: activeTab === 'settings' })}
              onClick={() => {
                toggleTab('settings');
              }}
            >
              <i className="ri-settings-2-line"></i>
            </NavLink>
          </NavItem>
          <UncontrolledTooltip target="Settings" placement="top">
            Settings
          </UncontrolledTooltip>
          <Dropdown
            nav
            isOpen={showMobileDropdown}
            toggle={toggleMobile}
            className="profile-user-dropdown d-inline-block d-lg-none"
          >
            <DropdownToggle nav>
              {profile ? (
                <img
                  src={profile.photoURL || 'https://via.placeholder.com/200'}
                  alt="chatr"
                  className="profile-user rounded-circle"
                />
              ) : (
                <Spinner className="spinner" color="dark" type="grow" />
              )}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  toggleTab('profile');
                }}
              >
                Profile{' '}
                <i className="ri-profile-line float-right text-muted"></i>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  toggleTab('settings');
                }}
              >
                Settings{' '}
                <i className="ri-settings-3-line float-right text-muted"></i>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="/auth/logout">
                Logout{' '}
                <i className="ri-logout-circle-r-line float-right text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>

      <div className="flex-lg-column d-none d-lg-block">
        <Nav className="side-menu-nav justify-content-center">
          <Dropdown
            nav
            direction="right"
            isOpen={showLanguageDropdown}
            className="btn-group dropup profile-user-dropdown"
            toggle={toggleLanguage}
          >
            <DropdownToggle nav>
              <i className="ri-global-line"></i>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => changeLanguageAction('en')}
                active={language === 'English'}
              >
                <img src={UsFlagJpg} alt="user" className="mr-1" height="12" />{' '}
                <span className="align-middle">English</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => changeLanguageAction('de')}
                active={language === 'German'}
              >
                <img
                  src={GermanyFlagJpg}
                  alt="user"
                  className="mr-1"
                  height="12"
                />{' '}
                <span className="align-middle">German</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => changeLanguageAction('it')}
                active={language === 'Italian'}
              >
                <img
                  src={ItalyFlagJpg}
                  alt="user"
                  className="mr-1"
                  height="12"
                />{' '}
                <span className="align-middle">Italian</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => changeLanguageAction('ru')}
                active={language === 'Russian'}
              >
                <img
                  src={RussiaFlagJpg}
                  alt="user"
                  className="mr-1"
                  height="12"
                />{' '}
                <span className="align-middle">Russian</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem>
            <NavLink
              id="light-dark"
              target="_blank"
              href="https://github.com/msanvarov/chatr-messaging"
            >
              <i className="ri-github-fill"></i>
            </NavLink>
            <UncontrolledTooltip target="light-dark" placement="right">
              Github
            </UncontrolledTooltip>
          </NavItem>
          <Dropdown
            nav
            isOpen={showProfileDropdown}
            className="btn-group dropup profile-user-dropdown"
            toggle={toggleProfile}
          >
            <DropdownToggle nav>
              {profile ? (
                <img
                  src={profile.photoURL || 'https://via.placeholder.com/200'}
                  alt="profile"
                  className="profile-user rounded-circle"
                />
              ) : (
                <Spinner className="spinner" color="dark" type="grow" />
              )}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  toggleTab('profile');
                }}
              >
                Profile{' '}
                <i className="ri-profile-line float-right text-muted"></i>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  toggleTab('settings');
                }}
              >
                Settings{' '}
                <i className="ri-settings-3-line float-right text-muted"></i>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="/auth/logout">
                Logout{' '}
                <i className="ri-logout-circle-r-line float-right text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>
    </div>
  );
};
