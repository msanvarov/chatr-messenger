import React from 'react';

import { LeftPaneMenu } from '@chatr/ui';

const ChatLayout: React.FC = ({ children }) => {
  return (
    <div className="layout-wrapper d-lg-flex">
      <LeftPaneMenu />
      {children}
    </div>
  );
};

export default ChatLayout;
