import React, { useEffect } from 'react';
import { Redirect, Route, RouteProps, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import {
  AppState,
  fetchChannel,
  fetchChannels,
  fetchLastOpenedChannelForUser,
  getUserMetadata,
  onLogin,
  useAppDispatch,
  useAppSelector,
} from '@chatr/redux';

const auth = getAuth();

type ProtectedRouteProps = {
  component: React.ElementType;
} & RouteProps;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = useAppSelector(
    (state: AppState) => state.auth.isAuthenticated
  );
  const history = useHistory();
  const dispatch = useAppDispatch();
  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(getUserMetadata(user.uid));
          dispatch(fetchChannels(user.uid));
          dispatch(fetchLastOpenedChannelForUser(user.uid));
          dispatch(onLogin());
        } else {
          history.push('/auth/login');
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{ pathname: '/auth/login', state: { from: props.location } }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};
