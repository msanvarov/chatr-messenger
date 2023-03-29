import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { logout, useAppDispatch } from '../redux';

const LogoutPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(logout());
    })();
  }, []);

  return <Navigate to="/auth/login" replace />;
};

export default LogoutPage;
