import React, { useEffect } from 'react';
import { Redirect } from 'react-router';

import { logout, useAppDispatch } from '@chatr/redux';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(logout());
    })();
  }, []);

  return <Redirect to="/" />;
};

export default Logout;
