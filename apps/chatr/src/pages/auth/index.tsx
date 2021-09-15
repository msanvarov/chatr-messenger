import React, { Suspense } from 'react';
import { RouteComponentProps, Switch } from 'react-router';
import { Route, Redirect } from 'react-router-dom';

const LoginPage = React.lazy(() => import('./login.page'));
const RegisterPage = React.lazy(() => import('./register.page'));
const ForgotPasswordPage = React.lazy(() => import('./forgot-password.page'));
const LogoutPage = React.lazy(() => import('./logout.page'));

//  match.url is the url prefix (/auth)
interface MatchParams {
  url: string;
}

type AuthRouterProps = RouteComponentProps<MatchParams>;

const AuthRouter: React.FC<AuthRouterProps> = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/login`} component={LoginPage} />
      <Route path={`${match.url}/register`} component={RegisterPage} />
      <Route
        path={`${match.url}/forgot-password`}
        component={ForgotPasswordPage}
      />
      <Route path={`${match.url}/logout`} component={LogoutPage} />
      {/* default redirecting */}
      <Redirect from={`${match.url}/`} to={`${match.url}/login`} exact />
    </Switch>
  );
};

export default AuthRouter;
