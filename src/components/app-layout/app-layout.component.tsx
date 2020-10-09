import LeftPaneMenu from 'components/menus/left-pane-menu.component';
import React from 'react';
import { Helmet } from 'react-helmet';
import { helmet } from 'utils/helmet';

const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet {...helmet} />

      <div className="layout-wrapper d-lg-flex">
        <LeftPaneMenu />
        {children}
      </div>
    </>
  );
};

export default AppLayout;
