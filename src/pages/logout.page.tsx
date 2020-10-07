import React, { useEffect } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { Redirect } from 'react-router';

const Logout = () => {
  const firebase = useFirebase();
  useEffect(() => {
    (async () => {
      await firebase.logout();
    })();
  }, [firebase]);
  return <Redirect to="/" />;
};

export default Logout;
