import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from 'store';
import { ActiveTab } from 'store/layout';
import classnames from 'classnames';
import * as layoutActions from 'store/layout/actions';
import i18n from 'i18n';
import { Link } from 'react-router-dom';
import LogoPNG from 'assets/logo-light.png';
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
import { isLoaded } from 'react-redux-firebase';
import USFlagJPG from 'assets/photos/flags/us.jpg';
import GermanyFlagJPG from 'assets/photos/flags/germany.jpg';
import ItalyFlagJPG from 'assets/photos/flags/italy.jpg';
import RussiaFlagJPG from 'assets/photos/flags/russia.jpg';

type SupportedLanguages = {
  eng: 'English';
  gr: 'German';
  rs: 'Russian';
  it: 'Italian';
};

const LeftPaneMenu = () => {
  const profile = useSelector((state: IApplicationState) => state.firebase.profile);
  const activeTab = useSelector((state: IApplicationState) => state.layout.activeTab);
  const dispatch = useDispatch();
  const [language, setLanguage] = useState<SupportedLanguages[keyof SupportedLanguages]>('English');
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState<boolean>(false);

  const toggleMobile = () => setShowMobileDropdown(!showMobileDropdown);
  const toggleLanguage = () => setShowLanguageDropdown(!showLanguageDropdown);
  const toggleProfile = () => setShowProfileDropdown(!showProfileDropdown);
  const toggleTab = (tab: ActiveTab) => dispatch(layoutActions.setActiveTab(tab));

  const changeLanguageAction = (lng: keyof SupportedLanguages) => {
    i18n.changeLanguage(lng);

    if (lng === 'gr') setLanguage('German');
    else if (lng === 'rs') setLanguage('Russian');
    else if (lng === 'it') setLanguage('Italian');
    else if (lng === 'eng') setLanguage('English');
  };

  return (
    <>
      <div className="side-menu flex-lg-column mr-lg-1">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={LogoPNG} alt="logo" height="30" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={LogoPNG} alt="logo" height="30" />
            </span>
          </Link>
        </div>

        <div className="flex-lg-column my-auto">
          <Nav pills className="side-menu-nav justify-content-center" role="tablist">
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
            <NavItem id="Groups">
              <NavLink
                id="pills-groups-tab"
                className={classnames({ active: activeTab === 'group' })}
                onClick={() => {
                  toggleTab('group');
                }}
              >
                <i className="ri-group-line"></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target="Groups" placement="top">
              Groups
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
                {isLoaded(profile) ? (
                  <img
                    src={profile.photoURL}
                    alt="chatvia"
                    className="profile-user rounded-circle"
                  />
                ) : (
                  <Spinner type="grow" color="dark" />
                )}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    toggleTab('profile');
                  }}
                >
                  Profile <i className="ri-profile-line float-right text-muted"></i>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toggleTab('settings');
                  }}
                >
                  Settings <i className="ri-settings-3-line float-right text-muted"></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="/logout">
                  Log out <i className="ri-logout-circle-r-line float-right text-muted"></i>
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
                  onClick={() => changeLanguageAction('eng')}
                  active={language === 'English'}
                >
                  <img src={USFlagJPG} alt="user" className="mr-1" height="12" />{' '}
                  <span className="align-middle">English</span>
                </DropdownItem>

                <DropdownItem
                  onClick={() => changeLanguageAction('gr')}
                  active={language === 'German'}
                >
                  <img src={GermanyFlagJPG} alt="user" className="mr-1" height="12" />{' '}
                  <span className="align-middle">German</span>
                </DropdownItem>

                <DropdownItem
                  onClick={() => changeLanguageAction('it')}
                  active={language === 'Italian'}
                >
                  <img src={ItalyFlagJPG} alt="user" className="mr-1" height="12" />{' '}
                  <span className="align-middle">Italian</span>
                </DropdownItem>

                <DropdownItem
                  onClick={() => changeLanguageAction('rs')}
                  active={language === 'Russian'}
                >
                  <img src={RussiaFlagJPG} alt="user" className="mr-1" height="12" />{' '}
                  <span className="align-middle">Russian</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown
              nav
              isOpen={showProfileDropdown}
              className="btn-group dropup profile-user-dropdown"
              toggle={toggleProfile}
            >
              <DropdownToggle nav>
                {isLoaded(profile) ? (
                  <img
                    src={profile.photoURL}
                    alt="profile"
                    className="profile-user rounded-circle"
                  />
                ) : (
                  <Spinner type="grow" color="dark" />
                )}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    toggleTab('profile');
                  }}
                >
                  Profile <i className="ri-profile-line float-right text-muted"></i>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toggleTab('settings');
                  }}
                >
                  Preferences <i className="ri-settings-3-line float-right text-muted"></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="/logout">
                  Logout <i className="ri-logout-circle-r-line float-right text-muted"></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default LeftPaneMenu;
