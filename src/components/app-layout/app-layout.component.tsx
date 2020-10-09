import LeftSidebarMenu from 'components/menus/left-sidebar-menu.component';
import React from 'react';
import { Helmet } from 'react-helmet';
import { helmet } from 'utils/helmet';

const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet {...helmet} />

      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu />
        {children}
      </div>
    </>
  );
};

export default AppLayout;
