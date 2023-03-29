import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  messages: [],
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
      const messageReply: IMessage = {
        id: '',
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

      return messageReply;
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

      return { messageId, emoji, userId };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const messagesSlice = createSlice({
  name: '@@messages',
  initialState,
  reducers: {
    writeMessage: (state, action) => {
      // Find the message if it exists
      // const messageIndex = state.messages.findIndex(
      //   (message) => message.id === action.payload.id
      // );
      // if (messageIndex !== -1) {
      //   // Update the message if it exists
      //   state.messages[messageIndex] = action.payload as IMessage;
      // }
      //  else {
      //   // Add the message if it does not exist
      state.messages.push(action.payload as IMessage);
      // }
    },
    editMessage: (state, action) => {
      const messageIndex = state.messages.findIndex(
        (message) => message.id === action.payload.id
      );
      if (messageIndex !== -1) {
        // Tracking if the message has been edited
        state.messages[messageIndex] = {
          ...action.payload,
          edited: true,
        };
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
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
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload as IMessage[];
      state.loading = false;
    });
    builder.addCase(reactToMessage.fulfilled, (state, action) => {
      const { messageId, emoji, userId } = action.payload;

      const messageIndex = state.messages.findIndex(
        (message) => message.id === messageId
      );

      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        message.reactions = message.reactions || {};
        message.reactions[emoji] = message.reactions[emoji] || [];
        message.reactions[emoji].push(userId);
      }

      state.loading = false;
    });
    builder.addCase(replyToMessage.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export const { writeMessage, editMessage, removeMessage } =
  messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
