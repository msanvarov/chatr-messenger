import React from 'react';
import { TabContent, TabPane } from 'reactstrap';

import {
  AppState,
  IChannel,
  IUser,
  IUserState,
  useAppSelector,
} from '@chatr/redux';

import ProfileTab from '../tabs/profile-tab/profile-tab.component';
import SettingsTab from '../tabs/settings-tab/settings-tab.component';
import ContactsTab from '../tabs/contacts-tab/contacts-tab.component';
import ChannelsTab from '../tabs/channels-tab/channels-tab.component';
import { ChatRoomsTab } from '../tabs/chat-rooms/chat-rooms-tab.component';

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
    <div className="chat-leftsidebar mr-lg-1">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile" id="pills-user">
          <ProfileTab {...{ profile }} />
        </TabPane>
        <TabPane tabId="chat" id="pills-chat">
          <ChatRoomsTab
            {...{
              uid: profile.uid,
              channels: channels,
              lastViewedChannel: profile.lastViewedChannel,
            }}
          />
        </TabPane>
        <TabPane tabId="channels" id="pills-channels">
          <ChannelsTab
            {...{
              uid: profile.uid,
              channels,
              contacts,
            }}
          />
        </TabPane>
        <TabPane tabId="contacts" id="pills-contacts">
          <ContactsTab
            {...{
              uid: profile.uid,
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
