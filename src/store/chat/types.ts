export enum ChatActionTypes {
  CHAT_USER = '@@groups/CHAT_USER',
  ACTIVE_USER = '@@groups/ACTIVE_USER',
  FULL_USER = '@@groups/FULL_USER',
  ADD_LOGGED_USER = '@@groups/ADD_LOGGED_USER',
  CREATE_GROUP = '@@groups/CREATE_GROUP',
}

export interface IActiveUser {
  activeUser: number;
}

export interface IUser {
  id: number;
  name: string;
  profilePicture: string;
  status?: Status;
  unRead: number;
  roomType?: string;
  isGroup: boolean;
  messages: IMessage[];
  isTyping?: boolean;
}

export interface IMessage {
  id: number;
  message?: string;
  time?: string;
  userType?: UserType;
  isImageMessage?: boolean;
  isFileMessage?: boolean;
  isToday?: boolean;
  imageMessage?: IImageMessage[];
  userName?: string;
  fileMessage?: string;
  size?: number;
  isTyping?: boolean;
}

export interface IImageMessage {
  title: string;
  source: string;
}

export enum UserType {
  Receiver = 'receiver',
  Sender = 'sender',
}

export enum Status {
  Away = 'away',
  Offline = 'offline',
  Online = 'online',
}

export interface IGroup {
  groupId: number;
  name: string;
  profilePicture: string;
  isGroup: boolean;
  unRead: number;
  desc: string;
  members: IMember[];
  isNew?: boolean;
}

export interface IMember {
  userId: number;
  name: string;
  profilePicture: string;
  role: null | string;
}

export interface IContact {
  id: number;
  name: string;
}

export interface IChatState {
  readonly activeUser: number;
  readonly users: IUser[];
  readonly groups: IGroup[];
  readonly contacts: IContact[];
}
