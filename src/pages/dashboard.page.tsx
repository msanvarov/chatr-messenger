import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { useFirebase } from 'react-redux-firebase';

const Dashboard = () => {
  const firebase = useFirebase();
  return (
    <>
      <Helmet title="Dashboard | Chatr - Messaging Platform" />
      <button onClick={() => firebase.logout()}>Logout</button>
    </>
  );
};

export default memo(Dashboard);
