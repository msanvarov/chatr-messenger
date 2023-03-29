export interface IMessage {
  //   channelId: string;
  // Id comes from the document id
  id: string;
  // author: {
  //   id: string;
  //   name: string; // comes from displayName
  //   photoURL: string;
  // };
  user: string; // user id
  text: string;
  edited?: boolean;
  timestamp: string;
  reactions?: { [emoji: string]: string[] }; // Keys represent emojis, values are arrays of user IDs who reacted with the emoji
  replies?: IMessage[];
}

export interface IMessageReactionPayload {
  channelId: string;
  messageId: string;
  userId: string;
  emoji: string;
}

export interface ICreateMessagePayload extends Omit<IMessage, 'id'> {
  channelId: string;
}

export interface IReplyMessagePayload extends ICreateMessagePayload {
  messageId: string;
}

export interface IChannelMessagesState {
  readonly messages: IMessage[];
  readonly loading: boolean;
  readonly error: string | null;
}
