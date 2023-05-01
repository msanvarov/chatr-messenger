import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserMetadata, patchUserMetadata } from '../firestore-helpers';

import type {
  ILastOpenedChannelPayload,
  IUserMetadata,
  IUserState,
} from './types';

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

export const getUserMetadata = createAsyncThunk(
  '@@user/getUserMetadata',
  async (uid: string, { rejectWithValue }) => {
    try {
      return await fetchUserMetadata(uid);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const setLastOpenedChannel = createAsyncThunk(
  '@@user/setLastOpenedChannel',
  async (
    { uid, channelId }: ILastOpenedChannelPayload,
    { rejectWithValue }
  ) => {
    try {
      await patchUserMetadata(uid, { lastOpenedChannel: channelId });
      return channelId;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: '@@user',
  initialState,
  reducers: {
    setUserMetadata: (state, action: PayloadAction<Partial<IUserMetadata>>) => {
      // TODO: This is an anti-pattern. I should be mutating state directly.
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserMetadata.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserMetadata.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(getUserMetadata.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
      state.loading = false;
    });
    builder.addCase(setLastOpenedChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setLastOpenedChannel.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(setLastOpenedChannel.fulfilled, (state, action) => {
      state.lastOpenedChannel = action.payload;
      state.loading = false;
    });
  },
});

export const { setUserMetadata } = userSlice.actions;

export const userReducer = userSlice.reducer;
