import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import favicon from './favicon.png';
import { ProtectedRoute } from './router';

const helmet = {
  title: 'Chatr',
  titleTemplate: '%s | Chatr Messaging Platform',
  htmlAttributes: { lang: 'en' },
  meta: [
    {
      name: 'description',
      content:
        'The easiest and fastest way to communite with others and make friends.',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, user-scalable=no',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: favicon }],
};

const ChatRouter = lazy(() => import('./pages/chat'));
const AuthRouter = lazy(() => import('./pages/auth'));

export const App: React.FC = () => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Helmet {...helmet} />
      <Router>
        <Route>
          <Switch>
            <ProtectedRoute path="/chat" component={ChatRouter} />
            <Route path="/auth" component={AuthRouter} />
            <Redirect from="/" to="/chat" />
          </Switch>
        </Route>
      </Router>
    </Suspense>
  );
};

export default App;
