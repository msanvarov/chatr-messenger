import { onAuthStateChanged } from 'firebase/auth';
import { StrictMode, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { PersistGate } from 'redux-persist/integration/react';

import ChatLandingPage from './pages/chat-landing.page';
import ChatPage from './pages/chat.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import LoginPage from './pages/login.page';
import LogoutPage from './pages/logout.page';
import RegisterPage from './pages/register.page';
import {
  auth,
  getUserMetadata,
  persistor,
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
        dispatch(getUserMetadata(user.uid));
        dispatch(setIsAuthenticated(true));
        dispatch(setIsEmailConfirmed(user.emailVerified));
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
  }, [dispatch]);

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

const GlobalLayout = () => {
  const { layoutColorMode } = useAppSelector((state) => state.layout);
  const { lastOpenedChannel } = useAppSelector((state) => state.user);

  useEffect(() => {
    document.body.setAttribute('data-layout-mode', layoutColorMode);
  }, [layoutColorMode]);

  useEffect(() => {
    const chatEls = document.querySelectorAll('#chat-list li');
    const channelEls = document.querySelectorAll('#channel-list li');
    const activeClass = 'active';

    // Remove the active class from all list items
    chatEls.forEach((chatEl) => chatEl.classList.remove(activeClass));
    channelEls.forEach((channelEl) => channelEl.classList.remove(activeClass));

    // Add the active class to the selected conversation
    const chatEl = document.querySelector(
      `#chat-list #conversation-${lastOpenedChannel}`
    );
    const channelEl = document.querySelector(
      `#channel-list #channel-${lastOpenedChannel}`
    );

    chatEl?.classList.add(activeClass);
    channelEl?.classList.add(activeClass);

    const userChat = document.querySelector('.user-chat');
    userChat?.classList.add('user-chat-show');
  }, [lastOpenedChannel]);

  return (
    <>
      <Helmet {...helmet} />
      <Outlet />
    </>
  );
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
    element: <GlobalLayout />,
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
    <PersistGate
      loading={<Spinner className="spinner" color="dark" type="grow" />}
      {...{ persistor }}
    >
      <Provider {...{ store }}>
        <RouterProvider router={router} />
      </Provider>
    </PersistGate>
  </StrictMode>
);
