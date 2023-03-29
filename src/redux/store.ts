import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createBrowserHistory } from 'history';
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from './redux-react-router';

import { usersApi } from './api/users';
import { authReducer } from './auth';
import { channelReducer } from './channel';
import { layoutReducer } from './layout';
import { messagesReducer } from './messages';
import { userReducer } from './user';

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

const reducer = {
  auth: authReducer,
  user: userReducer,
  channel: channelReducer,
  layout: layoutReducer,
  messages: messagesReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  ...createRouterReducerMapObject(history),
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(routerMiddleware)
      .concat(usersApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

// top-level state
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
