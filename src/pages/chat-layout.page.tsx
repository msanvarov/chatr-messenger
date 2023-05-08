import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import { LeftPaneMenu } from '../components/menu';
import { ChannelsTab } from '../components/tabs/channels-tab/channels-tab.component';
import { ChatRoomsTab } from '../components/tabs/chat-rooms/chat-rooms-tab.component';
import { ContactsTab } from '../components/tabs/contacts-tab/contacts-tab.component';
import ProfileTab from '../components/tabs/profile-tab/profile-tab.component';
import SettingsTab from '../components/tabs/settings-tab/settings-tab.component';
import { useAppSelector } from '../redux';

const ChatLandingPage = () => {
  const user = useAppSelector((state) => state.user);
  const { activeTab } = useAppSelector((state) => state.layout);
  return (
    <>
      <Helmet title="Chat Portal" />
      <div className="layout-wrapper d-lg-flex">
        <LeftPaneMenu />
        <div className="chat-leftsidebar me-lg-1">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="profile" id="pills-user">
              <ProfileTab {...{ profile: user }} />
            </TabPane>
            <TabPane tabId="chat" id="pills-chat">
              <ChatRoomsTab
                {...{
                  uid: user.uid,
                  lastOpenedChannel: user.lastOpenedChannel,
                }}
              />
            </TabPane>
            <TabPane tabId="channels" id="pills-channels">
              <ChannelsTab
                {...{
                  uid: user.uid,
                  displayName: user.displayName,
                }}
              />
            </TabPane>
            <TabPane tabId="contacts" id="pills-contacts">
              <ContactsTab
                {...{
                  uid: user.uid,
                  displayName: user.displayName,
                }}
              />
            </TabPane>
            <TabPane tabId="settings" id="pills-setting">
              <SettingsTab {...{ profile: user }} />
            </TabPane>
          </TabContent>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default ChatLandingPage;
