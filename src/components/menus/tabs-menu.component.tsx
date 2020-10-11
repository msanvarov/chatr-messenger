import React from 'react';
import { useSelector } from 'react-redux';
import { IApplicationState } from 'store';
import { TabContent, TabPane } from 'reactstrap';
import ProfileTab from 'components/tabs/profile-tab.component';
import SettingsTab from 'components/tabs/settings-tab.component';
import { FirebaseReducer } from 'react-redux-firebase';
import { IProfile } from 'store';
import { IChatState } from 'store/chat';
import ContactsTab from 'components/tabs/contacts-tab.component';
import ChatRoomsTab from 'components/tabs/chat-rooms-tab.component';
import GroupsTab from 'components/tabs/groups-tab.component';

type ChatLeftSidebarProps = {
  profile: FirebaseReducer.Profile<IProfile>;
} & IChatState;

const TabsMenu: React.FC<ChatLeftSidebarProps> = ({
  profile,
  groups,
  users,
  activeUser,
  contacts,
}) => {
  const activeTab = useSelector((state: IApplicationState) => state.layout.activeTab);
  return (
    <div className="chat-leftsidebar mr-lg-1">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile" id="pills-user">
          <ProfileTab {...{ profile }} />
        </TabPane>
        <TabPane tabId="chat" id="pills-chat">
          <ChatRoomsTab {...{ users, activeUser }} />
        </TabPane>
        <TabPane tabId="group" id="pills-groups">
          <GroupsTab {...{ groups, contacts }} />
        </TabPane>
        <TabPane tabId="contacts" id="pills-contacts">
          <ContactsTab {...{ contacts }} />
        </TabPane>
        <TabPane tabId="settings" id="pills-setting">
          <SettingsTab {...{ profile }} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default TabsMenu;
