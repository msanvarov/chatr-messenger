import React from 'react';
import { Helmet } from 'react-helmet';
import { Alert, Spinner } from 'reactstrap';

import { Chat, TabsMenu } from '@chatr/ui';
import { AppState, useAppSelector, useGetUsersQuery } from '@chatr/redux';

const DefaultChatPage: React.FC = () => {
  const profile = useAppSelector((state: AppState) => state.user);
  const {
    data: contacts,
    error: contactsError,
    isLoading: contactsIsLoading,
  } = useGetUsersQuery();
  const {
    channels,
    error: channelsError,
    loading: channelsIsLoading,
  } = useAppSelector((state: AppState) => state.channel);

  if (channelsIsLoading || contactsIsLoading) {
    return <Spinner className="spinner" color="dark" />;
  }

  if (contactsError || channelsError) {
    return (
      <Alert isOpen color="danger">
        {contactsError || channelsError}
      </Alert>
    );
  }

  return (
    <>
      <Helmet title="Chat Portal" />
      <TabsMenu {...{ profile, channels, contacts }} />
      <Chat {...{ profile, contacts }} />
    </>
  );
};

export default DefaultChatPage;
