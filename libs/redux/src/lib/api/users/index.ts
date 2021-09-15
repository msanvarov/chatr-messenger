import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IFirebaseUsersAPIResponse, IUser } from './types';

// API to fetch the users in firebase
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://us-central1-react-chatr.cloudfunctions.net/',
  }),
  endpoints: (build) => ({
    getUsers: build.query<IUser[], void>({
      query: () => ({ url: '/fetchUsers' }),
      transformResponse: (response: IFirebaseUsersAPIResponse) => {
        return response.users;
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
