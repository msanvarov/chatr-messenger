import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
// import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { IApplicationState } from 'store';
import { isLoaded } from 'react-redux-firebase';
import TabsMenu from 'components/menus/tabs-menu.component';
import Chat from 'components/chat/chat.component';

const Dashboard = () => {
  const profile = useSelector((state: IApplicationState) => state.firebase.profile);
  const users = useSelector((state: IApplicationState) => state.chat.users);
  const activeUser = useSelector((state: IApplicationState) => state.chat.activeUser);
  const contacts = useSelector((state: IApplicationState) => state.chat.contacts);
  const groups = useSelector((state: IApplicationState) => state.chat.groups);

  // const firebase = useFirebase();
  // fetch users data
  return (
    <>
      <Helmet title="Dashboard | Chatr - Messaging Platform" />
      {isLoaded(profile) && (
        <>
          <TabsMenu {...{ activeUser, profile, users, contacts, groups }} />
          <Chat {...{ users, activeUser, contacts }} />
        </>
      )}
    </>
  );
};

export default memo(Dashboard);
