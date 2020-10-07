import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';

import AppLayout from 'components/app-layout/app-layout.component';
import LandingPage from 'pages';

import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

type AppProps = {
  history: History;
};

const App: React.FC<AppProps> = () => (
  <ConnectedRouter history={history}>
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
  </ConnectedRouter>
);

ReactDOM.render(<App history={history} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
