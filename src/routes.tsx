import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { IApplicationState } from 'store';

// lazy loading pages
const LoginPage = React.lazy(() => import('pages/login.page'));
const RegisterPage = React.lazy(() => import('pages/register.page'));
const LockScreenPage = React.lazy(() => import('pages/lock-screen.page'));
const LogoutPage = React.lazy(() => import('pages/logout.page'));

// handle auth and authorization
type AppRouteProps = {
  isAuthProtected: boolean;
  layout: React.ElementType;
  component: React.ElementType;
} & RouteProps;
export const AppRoute: React.FC<AppRouteProps> = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  const auth = useSelector((state: IApplicationState) => state.firebase.auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && isLoaded(auth) && isEmpty(auth)) {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};

const privateRoutes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/lock-screen', component: LockScreenPage },
  { path: '/logout', component: LogoutPage },
];

export { privateRoutes, publicRoutes };
