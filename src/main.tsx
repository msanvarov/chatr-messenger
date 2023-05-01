import { onAuthStateChanged } from 'firebase/auth';
import { StrictMode, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { Spinner } from 'reactstrap';
import ChatLandingPage from './pages/chat-landing.page';
import ChatPage from './pages/chat.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import LoginPage from './pages/login.page';
import LogoutPage from './pages/logout.page';
import RegisterPage from './pages/register.page';
import {
  auth,
  fetchUserMetadata,
  setIsAuthenticated,
  setIsEmailConfirmed,
  setUserMetadata,
  store,
  useAppDispatch,
  useAppSelector,
} from './redux';

type PrivateRouteProps = {
  redirectPath?: string;
  children: React.ReactElement;
};

const PrivateRoute = ({
  redirectPath = '/auth/login',
  children,
}: PrivateRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // fetch user metadata from firestore
        const userMetadata = await fetchUserMetadata(user.uid);

        dispatch(setIsAuthenticated(true));
        dispatch(setIsEmailConfirmed(user.emailVerified));
        dispatch(setUserMetadata(userMetadata));
      } else {
        dispatch(setIsAuthenticated(false));
        dispatch(setIsEmailConfirmed(null));
        dispatch(
          setUserMetadata({
            uid: '',
            email: '',
            bio: null,
            photoURL: '',
            channels: [],
            location: null,
            lastLogin: null,
            displayName: '',
            registeredOn: null,
            lastOpenedChannel: null,
          })
        );
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated', !isAuthenticated);
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

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
};

// channelId is exampleChannelId
const router = createBrowserRouter([
  {
    path: '',
    element: (
      <>
        <Helmet {...helmet} />
        <Provider {...{ store }}>
          <Outlet />
        </Provider>
      </>
    ),
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <ChatLandingPage />
          </PrivateRoute>
        ),
        children: [{ path: ':channelId', element: <ChatPage /> }],
      },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'logout', element: <LogoutPage /> },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
