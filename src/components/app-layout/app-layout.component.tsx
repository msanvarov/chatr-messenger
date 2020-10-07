import React from 'react';
import { Helmet } from 'react-helmet';

import './AppLayout.scss';
import { helmet } from 'utils/helmet';

const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet {...helmet} />

      {children}
    </>
  );
};

export default AppLayout;
