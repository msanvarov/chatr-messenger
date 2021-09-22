import _ from 'lodash';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { IUserMetadataPayload, IUserState } from './types';
import {
  updateFirestoreUserMetadata,
  getUserMetadataFromFirebase,
  updateFirebaseUserProfile,
} from './helpers';

const initialState: IUserState = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  channels: [],
  lastViewedChannel: null,
  bio: null,
  location: null,
  loading: false,
  error: null,
};

export const getUserMetadata = createAsyncThunk(
  '@@user/getUserMetadata',
  async (uid: string, { rejectWithValue }) => {
    try {
      const userMetadata = await getUserMetadataFromFirebase(uid);
      return { ...userMetadata, uid };
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

export const setUserMetadata = createAsyncThunk(
  '@@user/setUserMetadata',
  async (
    { uid, ...userMetadata }: IUserMetadataPayload,
    { rejectWithValue }
  ) => {
    try {
      // set profile metadata for display name and photo url while writing to firestore
      await Promise.all([
        updateFirebaseUserProfile(userMetadata),
        updateFirestoreUserMetadata(uid, userMetadata),
      ]);
      return { ...userMetadata, uid };
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

const userSlice = createSlice({
  name: '@@user',
  initialState,
  reducers: {
    setLastViewedChannel: (state, action: PayloadAction<string>) => {
      state.lastViewedChannel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setUserMetadata.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserMetadata.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(setUserMetadata.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(getUserMetadata.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(setUserMetadata.fulfilled, (state, action) => {
      state.loading = false;
      _.forEach(_.keys(action.payload), (key) => {
        state[key] = action.payload[key];
      });
    });
    builder.addCase(getUserMetadata.fulfilled, (state, action) => {
      state.loading = false;
      _.forEach(_.keys(action.payload), (key) => {
        state[key] = action.payload[key];
      });
    });
  },
});

export const { setLastViewedChannel } = userSlice.actions;

export const userReducer = userSlice.reducer;
