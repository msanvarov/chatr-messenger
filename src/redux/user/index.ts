import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { IUserMetadata, IUserState } from './types';

const initialState: IUserState = {
  uid: '',
  email: '',
  bio: null,
  error: null,
  photoURL: '',
  channels: [],
  location: null,
  loading: false,
  lastLogin: null,
  displayName: '',
  registeredOn: null,
  lastOpenedChannel: null,
};

const userSlice = createSlice({
  name: '@@user',
  initialState,
  reducers: {
    setLastViewedChannel: (state, action: PayloadAction<string>) => {
      state.lastOpenedChannel = action.payload;
    },
    setUserMetadata: (state, action: PayloadAction<Partial<IUserMetadata>>) => {
      // TODO: This is an anti-pattern. I should be mutating state directly.
      Object.assign(state, action.payload);
    },
  },
});

export const { setLastViewedChannel, setUserMetadata } = userSlice.actions;

export const userReducer = userSlice.reducer;
