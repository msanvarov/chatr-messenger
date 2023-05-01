import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createBrowserHistory } from 'history';
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from './redux-react-router';

import { combineReducers } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { usersApi } from './api/users';
import { authReducer } from './auth';
import { channelReducer } from './channel';
import { layoutReducer } from './layout';
import { messagesReducer } from './messages';
import { userReducer } from './user';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['channel', 'messages', 'usersApi'],
};

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  channel: channelReducer,
  layout: layoutReducer,
  messages: messagesReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  ...createRouterReducerMapObject(history),
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(routerMiddleware)
      .concat(usersApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
// top-level state
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
