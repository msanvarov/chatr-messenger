export interface ICreateChannelPayload {
  name: string;
  members: string[];
  photoURL: string;
  createdAt: string;
  isDirectMessage?: boolean;
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

export interface ITypingUser {
  id: string;
  name: string;
  photoURL: string;
}

export interface ILastMessage {
  text: string;
  timestamp: string; // FieldValue
  user: string; // user id
}
export interface IFirestoreChannel {
  photoURL: string;
  createdAt: string;
  isDirectMessage: boolean;
  name: string;
  nicknames: INickname[];
  members: string[];

  typingUsers?: ITypingUser[]; // userId arrays
  // comes from the message collection
  lastMessage?: ILastMessage;
}

export interface INickname {
  setBy: string;
  user: string;
  nickname: string;
}

export interface IChannelState {
  readonly lastOpenedChannel: IChannel | null;
  readonly channels: IChannel[];
  readonly loading: boolean;
  readonly error: string | null;
}
