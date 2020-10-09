import React from 'react';
import { useSelector } from 'react-redux';
import { IApplicationState } from 'store';
import { TabContent, TabPane } from 'reactstrap';
import { users } from 'pages/dashboard.page';
import ProfileTab from 'components/tabs/profile-tab.component';
import SettingsTab from 'components/tabs/settings-tab.component';
import { FirebaseReducer } from 'react-redux-firebase';
import { IProfile } from 'store';
import ContactsTab from 'components/tabs/contacts-tab.component';

type ChatLeftSidebarProps = {
  chat: typeof users;
  profile: FirebaseReducer.Profile<IProfile>;
};

const ChatLeftSidebar: React.FC<ChatLeftSidebarProps> = ({ profile }) => {
  const activeTab = useSelector((state: IApplicationState) => state.layout.activeTab);
  return (
    <div className="chat-leftsidebar mr-lg-1">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile" id="pills-user">
          <ProfileTab {...{ profile }} />
        </TabPane>
        {/* <TabPane tabId="chat" id="pills-chat">
          <Chats recentChatList={props.recentChatList} />
        </TabPane> */}
        <TabPane tabId="contacts" id="pills-contacts">
          <ContactsTab />
        </TabPane>
        <TabPane tabId="settings" id="pills-setting">
          <SettingsTab {...{ profile }} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ChatLeftSidebar;

// [{id: 0, name: "Patrick", photoURL }]
