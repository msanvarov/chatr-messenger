export interface ICreateChannelPayload {
  name: string;
  members: string[];
  photoURL: string | null; // Not present on direct message channel
  createdAt: string;
  isDirectMessage?: boolean;
  // For direct messages (key is the userId)
  directMessageMetadata?: Record<
    string,
    {
      name: string;
      photoURL: string;
    }
  >;
}

export interface IDeleteChannelForUserPayload {
  userId: string;
  channelId: string;
}

export interface IChannel extends IFirestoreChannel {
  id: string;
}

export interface IWriteMessageToChannelPayload {
  channelId: string;
  message: {
    text: string;
    author: {
      id: string;
      name: string;
      photoURL: string;
    };
    createdAt: string;
  };
}

export interface IUpdateTypingStatusPayload {
  channelId: string;
  user: ITypingUser;
  isTyping: boolean;
}

export interface ITypingUser extends IUserMetadata {
  id: string;
}

export interface ILastMessage {
  text: string;
  timestamp: string; // FieldValue
  user: string; // user id
}
export interface IFirestoreChannel {
  photoURL: string | null;
  createdAt: string;
  isDirectMessage: boolean;
  name: string;
  nicknames: INickname[];
  members: string[];
  typingUsers?: ITypingUser[]; // userId arrays
  // comes from the message collection
  lastMessage?: ILastMessage;
  // comes from the directMessageMetadata object
  directMessageMetadata?: IDirectMessageMetadata;
}

export interface IUserMetadata {
  name: string;
  photoURL: string;
}
export interface IDirectMessageMetadata {
  [uid: string]: IUserMetadata;
}
export interface INickname {
  setBy: string;
  user: string;
  nickname: string;
}

export interface IChannelState {
  readonly recentlyCreatedChannelId: string | null;
  readonly openedChannel: IChannel | null;
  readonly channels: IChannel[];
  readonly loading: boolean;
  readonly error: string | null;
}
