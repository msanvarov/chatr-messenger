import React from 'react';
import { Helmet } from 'react-helmet';
import { helmet } from 'utils/helmet';
import './auth-layout.styles.scss';

const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet {...helmet} />

      {children}
    </>
  );
};

export default AppLayout;
