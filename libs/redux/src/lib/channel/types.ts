export interface ICreateChannelPayload {
  name: string;
  memberIds: string[];
  photoURL: string;
  createdAt: number;
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
    content: string;
    author: {
      id: string;
      name: string;
      photoURL: string;
    };
    createdAt: number;
  };
}

export interface IFirestoreChannel {
  photoURL: string;
  createdAt: number;
  messages: IMessage[];
  isDirectMessage: boolean;
  name: Record<string, string>;
  nicknames: INickname[];
  members: string[];
}

export interface IMessage {
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  content: string;
  createdAt: number;
}

export interface INickname {
  setBy: string;
  user: string;
  nickname: string;
}

export interface IChannelState {
  readonly openedChannel: IChannel | null;
  readonly channels: IChannel[];
  readonly loading: boolean;
  readonly error: string | null;
}
