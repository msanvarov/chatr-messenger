import React from 'react';
import { TabContent, TabPane } from 'reactstrap';

import {
  AppState,
  IChannel,
  IUser,
  IUserState,
  useAppSelector,
} from '../../redux';

import ChannelsTab from '../tabs/channels-tab/channels-tab.component';
import { ChatRoomsTab } from '../tabs/chat-rooms/chat-rooms-tab.component';
import ContactsTab from '../tabs/contacts-tab/contacts-tab.component';
import ProfileTab from '../tabs/profile-tab/profile-tab.component';
import SettingsTab from '../tabs/settings-tab/settings-tab.component';

type TabsMenuProps = {
  profile: IUserState;
  channels: IChannel[];
  contacts?: IUser[];
};

export const TabsMenu: React.FC<TabsMenuProps> = ({
  profile,
  channels,
  contacts,
}) => {
  const activeTab = useAppSelector((state: AppState) => state.layout.activeTab);
  return (
    <div className="chat-leftsidebar me-lg-1">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile" id="pills-user">
          <ProfileTab {...{ profile }} />
        </TabPane>
        <TabPane tabId="chat" id="pills-chat">
          <ChatRoomsTab
            {...{
              uid: profile.uid,
              channels: channels,
              lastOpenedChannel: profile.lastOpenedChannel,
            }}
          />
        </TabPane>
        <TabPane tabId="channels" id="pills-channels">
          <ChannelsTab
            {...{
              uid: profile.uid,
              displayName: profile.displayName,
              channels,
              contacts,
            }}
          />
        </TabPane>
        <TabPane tabId="contacts" id="pills-contacts">
          <ContactsTab
            {...{
              uid: profile.uid,
              displayName: profile.displayName,
              contacts,
            }}
          />
        </TabPane>
        <TabPane tabId="settings" id="pills-setting">
          <SettingsTab {...{ profile }} />
        </TabPane>
      </TabContent>
    </div>
  );
};
