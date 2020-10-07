import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

import AppLayout from 'components/app-layout/app-layout.component';
import configureStore from 'configure-store';
import LandingPage from 'pages';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBzV-wyw8lxNO1I_ygVtV7oK1IGeY6PZ4g',
  authDomain: 'react-chatr.firebaseapp.com',
  databaseURL: 'https://react-chatr.firebaseio.com',
  projectId: 'react-chatr',
  storageBucket: 'react-chatr.appspot.com',
  messagingSenderId: '777566481626',
  appId: '1:777566481626:web:4354ed83681250a27c89e3',
  measurementId: 'G-MQYCLMV64F',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const history = createBrowserHistory();
const store = configureStore(history, window.INITIAL_REDUX_STATE);

const reactReduxFirebaseProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
  },
  createFirestoreInstance,
};

const App: React.FC = () => (
  <Provider {...{ store }}>
    <ConnectedRouter history={history}>
      <ReactReduxFirebaseProvider {...reactReduxFirebaseProps} dispatch={store.dispatch}>
        <Router>
          <Route
            render={() => (
              <AppLayout>
                <Switch>
                  <Route exact path="/" component={LandingPage} />
                </Switch>
              </AppLayout>
            )}
          />
        </Router>
      </ReactReduxFirebaseProvider>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
