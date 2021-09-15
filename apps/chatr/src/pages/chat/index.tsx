import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

import ChatLayout from './chat-layout.component';

type MatchParams = {
  url: string;
};

type ChatRouterProps = RouteComponentProps<MatchParams>;

const DefaultChatPortalPage = React.lazy(() => import('./default.page'));

const ChatRouter: React.FC<ChatRouterProps> = ({ match }) => {
  return (
    <ChatLayout>
      <Switch>
        <Route
          path={`${match.url}/default`}
          component={DefaultChatPortalPage}
        />

        {/* default redirecting */}
        <Redirect from={`${match.url}/`} to={`${match.url}/default`} />
      </Switch>
    </ChatLayout>
  );
};

export default ChatRouter;
