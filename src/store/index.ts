import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter, RouterState } from 'connected-react-router';
import { firebaseReducer, FirebaseReducer, FirestoreReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import { ILayoutState, layoutReducer } from './layout';
import { chatReducer, IChatState } from './chat';

export interface IProfile {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  description?: string;
  status?: string;
  location?: string;
}

// Top-level state
export interface IApplicationState {
  firebase: FirebaseReducer.Reducer<IProfile>;
  firestore: FirestoreReducer.Reducer;
  layout: ILayoutState;
  chat: IChatState;
  router: RouterState;
}

export const createRootReducer = (history: History) => {
  return combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    layout: layoutReducer,
    chat: chatReducer,
    router: connectRouter(history),
  });
};
