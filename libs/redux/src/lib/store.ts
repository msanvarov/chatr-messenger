import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import './firebase';
import { authReducer } from './auth';
import { channelReducer } from './channel';
import { layoutReducer } from './layout';
import { userReducer } from './user';
import { usersApi } from './api/users';
import { getApp } from 'firebase/app';

const history = createBrowserHistory();

const reducer = {
  auth: authReducer,
  user: userReducer,
  channel: channelReducer,
  layout: layoutReducer,
  router: connectRouter(history),
  [usersApi.reducerPath]: usersApi.reducer,
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(routerMiddleware(history))
      .concat(usersApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

// top-level state
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;

// to be used in the main chatr app
export const firebaseApp = getApp();
