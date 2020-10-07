import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter, RouterState } from 'connected-react-router';
import { firebaseReducer, FirebaseReducer, FirestoreReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

interface Profile {
  email: string;
  company: string;
  photoURL: string;
  displayName: string;
}

// Top-level state
export interface IApplicationState {
  firebase: FirebaseReducer.Reducer<Profile>;
  firestore: FirestoreReducer.Reducer;
  router: RouterState;
}

export const createRootReducer = (history: History) => {
  return combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    router: connectRouter(history),
  });
};
