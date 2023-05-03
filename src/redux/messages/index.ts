import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../firebase';
import {
  IChannelMessagesState,
  ICreateMessagePayload,
  IMessage,
  IMessageReactionPayload,
  IReplyMessagePayload,
} from './types';

const initialState: IChannelMessagesState = {
  messages: {},
  loading: false,
  error: null,
};

// Remark: This is not realtime as it is not a listen for changes. Use for initial load.
export const fetchMessages = createAsyncThunk(
  '@@messages/fetchMessages',
  async (channelId: string, { rejectWithValue }) => {
    try {
      const messageQuery = query(
        collection(db, `channels/${channelId}/messages`),
        orderBy('createdAt')
      );
      const messagesSnapshot = await getDocs(messageQuery);
      const messages = messagesSnapshot.docs.map((doc) => ({
        ...(doc.data() as Partial<IMessage>),
        id: doc.id,
      }));
      return messages as IMessage[];
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const createMessage = createAsyncThunk(
  '@@messages/createMessage',
  async (
    { channelId, user, text, edited = false, timestamp }: ICreateMessagePayload,
    { rejectWithValue }
  ) => {
    try {
      const messagePayload = {
        user,
        text,
        edited,
        timestamp,
      };
      const messagesRef = collection(db, `channels/${channelId}/messages`);
      const messageDocRef = await addDoc(messagesRef, messagePayload);

      return { id: messageDocRef.id, ...messagePayload };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const replyToMessage = createAsyncThunk(
  '@@messages/replyToMessage',
  async (
    {
      channelId,
      messageId,
      user,
      text,
      timestamp: createdAt,
    }: IReplyMessagePayload,
    { rejectWithValue }
  ) => {
    try {
      const messageRef = doc(db, 'channels', channelId, 'messages', messageId);
      const messageReply: ICreateMessagePayload = {
        channelId,
        user,
        text,
        edited: false,
        timestamp: createdAt,
        reactions: {},
        replies: [],
      };

      await updateDoc(messageRef, {
        replies: arrayUnion(messageReply),
      });

      return { messageReply, messageId, channelId };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const reactToMessage = createAsyncThunk(
  '@@messages/reactToMessage',
  async (
    { channelId, messageId, userId, emoji }: IMessageReactionPayload,
    { rejectWithValue }
  ) => {
    try {
      const messageRef = doc(db, `channels/${channelId}/messages`, messageId);
      const reactionKey = `reactions.${emoji}`;

      await updateDoc(messageRef, {
        [reactionKey]: arrayUnion(userId),
      });

      return { messageId, emoji, userId, channelId };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const messagesSlice = createSlice({
  name: '@@messages',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<IMessage>) => {
      if (!state.messages[action.payload.channelId]) {
        state.messages[action.payload.channelId] = [];
      }
      // Search for the action.payload.id in the state.messages[action.payload.channelId] array and only append if it doesn't exist
      if (
        !state.messages[action.payload.channelId].find(
          (message) => message.id === action.payload.id
        )
      ) {
        state.messages[action.payload.channelId].push(action.payload);
      }
    },
    editMessage: (state, action) => {
      const { channelId, id } = action.payload;
      if (state.messages[channelId] && state.messages[channelId][id]) {
        // Tracking if the message has been edited
        Object.assign(state.messages[channelId][id], {
          ...action.payload,
          edited: true,
        });
      }
    },
    removeMessage: (state, action) => {
      const { channelId, id } = action.payload;
      if (state.messages[channelId] && state.messages[channelId][id]) {
        delete state.messages[channelId][id];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(reactToMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(replyToMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(reactToMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(replyToMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { setMessage, editMessage, removeMessage } = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
