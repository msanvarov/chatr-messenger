import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { IUser } from '../api/users/types';
import { db } from '../firebase';

import { IUserMetadata } from '../user/types';
import type {
  IChannel,
  IChannelState,
  ICreateChannelPayload,
  IDeleteChannelForUserPayload,
  IUpdateTypingStatusPayload,
} from './types';

const initialState: IChannelState = {
  lastOpenedChannel: null,
  channels: [],
  loading: false,
  error: null,
};

export const createChannel = createAsyncThunk(
  '@@channel/createChannel',
  async (
    {
      name,
      members,
      photoURL,
      createdAt,
      isDirectMessage = false,
    }: ICreateChannelPayload,
    { rejectWithValue }
  ) => {
    try {
      // TODO: Refactor this cancer to use a HashMap and not a encoded JSON string for uniqueness
      const memberIds = members.map(
        (members) => (JSON.parse(members) as IUser).uid
      );

      const channelPayload: Partial<IChannel> = {
        name,
        members: memberIds,
        photoURL,
        createdAt,
        isDirectMessage,
        nicknames: [],
        typingUsers: [],
      };
      const channelRef = await addDoc(
        collection(db, 'channels'),
        channelPayload
      );

      const createWelcomeMessage = async () => {
        const messagePayload = {
          text: `${members
            .map((member) => (JSON.parse(member) as IUser).displayName)
            .join(', ')} have entered the chat`,
          user: 'message-bot', // id of the user
          timestamp: new Date().toISOString(),
        };
        await addDoc(
          collection(db, 'channels', channelRef.id, 'messages'),
          messagePayload
        );
        // update the last message
        await updateDoc(doc(db, 'channels', channelRef.id), {
          lastMessage: messagePayload,
        });
      };

      const updateUsersChannels = async () => {
        const usersRef = collection(db, 'users');
        const usersDataQuery = query(
          usersRef,
          where(documentId(), 'in', memberIds)
        );
        const usersQuerySnapshot = await getDocs(usersDataQuery);

        const updatePromises = usersQuerySnapshot.docs.map((user) =>
          updateDoc(
            doc(usersRef, user.id),
            'channels',
            arrayUnion(channelRef.id)
          )
        );
        await Promise.all(updatePromises);
      };

      await updateUsersChannels();
      await createWelcomeMessage();
      return channelRef.id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchLastOpenedChannelForUser = createAsyncThunk(
  '@@channel/fetchLastOpenedChannelForUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const fetchUserMetadata = async () => {
        const userSnapshot = await getDoc(doc(db, 'users', userId));
        const userMetadata = userSnapshot.data() as Partial<IUserMetadata>;
        return userMetadata.lastOpenedChannel;
      };

      const fetchChannelData = async (channelId: string) => {
        const channelSnapshot = await getDoc(doc(db, 'channels', channelId));
        if (channelSnapshot.exists()) {
          return { ...channelSnapshot.data(), id: channelSnapshot.id };
        } else {
          return rejectWithValue('Channel does not exist');
        }
      };

      const lastOpenedChannel = await fetchUserMetadata();
      if (!lastOpenedChannel)
        return rejectWithValue('No last opened channel found for user');
      const channelData = await fetchChannelData(lastOpenedChannel);

      return channelData;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchChannel = createAsyncThunk(
  '@@channel/fetchChannel',
  async (channelId: string, { rejectWithValue }) => {
    try {
      const channelSnapshot = await getDoc(doc(db, 'channels', channelId));
      if (channelSnapshot.exists()) {
        return {
          id: channelId,
          ...channelSnapshot.data(),
        } as Partial<IChannel>;
      }
      return rejectWithValue('Channel does not exist');
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchChannelsForUser = createAsyncThunk(
  '@@channel/fetchChannelsForUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const channelsRef = collection(db, 'channels');
      const channelsDataQuery = query(
        channelsRef,
        where('members', 'array-contains', userId)
      );

      const channelQuerySnapshot = await getDocs(channelsDataQuery);

      const channelsDocData = channelQuerySnapshot.docs.map((doc) => ({
        ...(doc.data() as IChannel),
        id: doc.id,
      }));

      console.log(channelsDocData);
      return channelsDocData;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

// TODO: Deleting a channel with be automatically performed when the last member leaves
export const deleteUserFromChannel = createAsyncThunk(
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
      return rejectWithValue((e as Error).message);
    }
  }
);

export const updateTypingStatus = createAsyncThunk(
  '@@channel/updateTypingStatus',
  async (
    { channelId, user, isTyping }: IUpdateTypingStatusPayload,
    { rejectWithValue }
  ) => {
    try {
      const channelRef = doc(db, 'channels', channelId);

      await updateDoc(channelRef, {
        typing: isTyping ? arrayUnion(user) : arrayRemove(user),
      });

      return { channelId, user, isTyping };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const channelSlice = createSlice({
  name: '@@channel',
  initialState,
  reducers: {
    setLastOpenedChannel: (state, action: PayloadAction<IChannel>) => {
      state.lastOpenedChannel = action.payload;
    },
    setChannels: (state, action: PayloadAction<IChannel[]>) => {
      state.channels = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChannelsForUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLastOpenedChannelForUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUserFromChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTypingStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChannel.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchChannelsForUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchLastOpenedChannelForUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(deleteUserFromChannel.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(updateTypingStatus.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(fetchChannel.fulfilled, (state, action) => {
      state.lastOpenedChannel = action.payload as IChannel;
      state.loading = false;
    });
    builder.addCase(fetchChannelsForUser.fulfilled, (state, action) => {
      state.channels = action.payload as IChannel[];
      state.loading = false;
    });
    builder.addCase(deleteUserFromChannel.fulfilled, (state, action) => {
      state.channels = state.channels.filter(
        (channel) => channel.id !== action.meta.arg.channelId
      );
      state.loading = false;
    });
    builder.addCase(
      fetchLastOpenedChannelForUser.fulfilled,
      (state, action) => {
        state.lastOpenedChannel = action.payload as IChannel;
        state.loading = false;
      }
    );
    builder.addCase(updateTypingStatus.fulfilled, (state, action) => {
      const { channelId, user: payloadUser, isTyping } = action.payload;
      const channelIndex = state.channels.findIndex(
        (channel) => channel.id === channelId
      );

      if (channelIndex >= 0) {
        const userIndex = state.channels[channelIndex]?.typingUsers?.findIndex(
          (user) => user.id === payloadUser.id
        );

        if (userIndex) {
          if (isTyping) {
            // If the user is typing and not in the typingUsers array, add them
            if (userIndex < 0) {
              state.channels[channelIndex]?.typingUsers?.push(payloadUser);
            }
          } else {
            // If the user is not typing and in the typingUsers array, remove them
            if (userIndex >= 0) {
              state.channels[channelIndex]?.typingUsers?.splice(userIndex, 1);
            }
          }
        }
      }
      state.loading = false;
    });
  },
});

export const { setLastOpenedChannel, setChannels } = channelSlice.actions;

export const channelReducer = channelSlice.reducer;
