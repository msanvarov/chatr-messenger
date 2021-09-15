import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  documentId,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {
  IChannel,
  IChannelState,
  ICreateChannelPayload,
  IDeleteChannelForUserPayload,
  IWriteMessageToChannelPayload,
} from './types';
import { getUserMetadataFromFirebase } from '../user/helpers';
import { IUserMetadata } from '../user/types';

const db = getFirestore();

const initialState: IChannelState = {
  openedChannel: null,
  channels: [],
  loading: false,
  error: null,
};

export const writeMessageToChannel = createAsyncThunk(
  '@@channel/writeMessageToChannel',
  async (
    { channelId, message }: IWriteMessageToChannelPayload,
    { rejectWithValue }
  ) => {
    try {
      await updateDoc(
        doc(db, 'channels', channelId),
        'messages',
        arrayUnion(message)
      );
    } catch (e) {
      rejectWithValue(e.message as string);
    }
  }
);

export const createChannel = createAsyncThunk(
  '@@channel/createChannel',
  async (
    {
      name,
      memberIds,
      photoURL,
      createdAt,
      isDirectMessage = false,
    }: ICreateChannelPayload,
    { rejectWithValue }
  ) => {
    try {
      const channelRef = await addDoc(collection(db, 'channels'), {
        name,
        members: memberIds,
        photoURL,
        createdAt,
        isDirectMessage,
        nicknames: [],
        messages: [],
      });
      // iterate through the users and add the channelId to their channelIds
      const usersRef = collection(db, 'users');
      const usersDataQuery = query(
        usersRef,
        where(documentId(), 'in', memberIds)
      );
      const usersQuerySnapshot = await getDocs(usersDataQuery);

      usersQuerySnapshot.forEach(async (user) => {
        await updateDoc(
          doc(usersRef, user.id),
          'channels',
          arrayUnion(channelRef.id)
        );
      });
      return channelRef.id;
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

export const fetchLastOpenedChannelForUser = createAsyncThunk(
  '@@channel/fetchLastOpenedChannelForUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await getDoc(doc(db, 'users', userId));
      const { lastViewedChannel } = user.data() as IUserMetadata;
      console.log(lastViewedChannel);
      const channel = await getDoc(doc(db, 'channels', lastViewedChannel!));
      return { ...channel.data(), id: channel.id };
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

export const fetchChannel = createAsyncThunk(
  '@@channel/fetchChannel',
  async (channelId: string, { rejectWithValue }) => {
    try {
      const docSnap = await getDoc(doc(db, 'channels', channelId));
      if (docSnap.exists()) {
        return { id: channelId, ...docSnap.data() } as IChannel;
      }
      return rejectWithValue('Channel does not exist');
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

export const fetchChannels = createAsyncThunk(
  '@@channel/fetchChannels',
  async (userId: string, { rejectWithValue }) => {
    try {
      // fetching channels for user
      const { channels: channelIds } = await getUserMetadataFromFirebase(
        userId
      );
      if (channelIds.length >= 1) {
        const channelsRef = collection(db, 'channels');
        const channelsDataQuery = query(
          channelsRef,
          where(documentId(), 'in', channelIds)
        );
        const channelQuerySnapshot = await getDocs(channelsDataQuery);
        // TODO fix typing
        const channelsDocData: any[] = [];
        channelQuerySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());
          channelsDocData.push({ id: doc.id, ...doc.data() });
        });
        return channelsDocData;
      }
      return [];
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

// TODO Deleting a channel with be automatically performed when the last member leaves
export const deleteChannelForUser = createAsyncThunk(
  '@@channel/deleteChannelForUser',
  async (
    { channelId, userId }: IDeleteChannelForUserPayload,
    { rejectWithValue }
  ) => {
    try {
      const removeUserFromChannel = updateDoc(doc(db, 'channels', channelId), {
        members: arrayRemove(userId),
      });
      const removeChannelFromUser = updateDoc(doc(db, 'users', userId), {
        channels: arrayRemove(channelId),
      });
      return await Promise.all([removeUserFromChannel, removeChannelFromUser]);
    } catch (e) {
      return rejectWithValue(e.message as string);
    }
  }
);

export const channelSlice = createSlice({
  name: '@@channel',
  initialState,
  reducers: {
    setOpenedChannel: (state, action: PayloadAction<IChannel>) => {
      state.openedChannel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChannels.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLastOpenedChannelForUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChannel.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchChannels.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchLastOpenedChannelForUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchChannel.fulfilled, (state, action) => {
      state.openedChannel = action.payload as IChannel;
      state.loading = false;
    });
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels = action.payload as IChannel[];
      state.loading = false;
    });
    builder.addCase(
      fetchLastOpenedChannelForUser.fulfilled,
      (state, action) => {
        state.openedChannel = action.payload as IChannel;
        state.loading = false;
      }
    );
  },
});

export const { setOpenedChannel } = channelSlice.actions;

export const channelReducer = channelSlice.reducer;
