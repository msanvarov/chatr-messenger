export interface IFirestoreChannelMessage {
  user: string; // user id
  text: string;
  edited?: boolean;
  timestamp: string;
}
export interface IMessage extends IFirestoreChannelMessage {
  channelId: string;
  id: string;
  // TODO: Should be in the user object
  displayName: string; // comes from displayName
  photoURL: string;
  reactions?: { [emoji: string]: string[] }; // Keys represent emojis, values are arrays of user IDs who reacted with the emoji
  replies?: IMessage[];
}

export interface IMessageReactionPayload {
  channelId: string;
  messageId: string;
  userId: string;
  emoji: string;
}

export interface ICreateMessagePayload
  extends Omit<IMessage, 'id' | 'displayName' | 'photoURL'> {
  channelId: string;
}

export interface IReplyMessagePayload extends ICreateMessagePayload {
  messageId: string;
}

export interface IChannelMessagesState {
  readonly messages: Record<string, IMessage[]>;
  readonly loading: boolean;
  readonly error: string | null;
}
