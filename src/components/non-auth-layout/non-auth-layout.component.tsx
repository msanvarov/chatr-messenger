import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';

import './non-auth-layout.styles.scss';

const NonAuthLayout: React.FC = ({ children }) => {
  const location = useLocation();
  return (
    <>
      <Helmet
        title={`${
          location.pathname.charAt(1).toUpperCase + location.pathname.slice(2)
        } | Chatr - Messaging Platform`}
      />
      {children}
    </>
  );
};

export default NonAuthLayout;
