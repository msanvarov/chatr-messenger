export interface IUserMetadata {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  channels: string[];
  lastOpenedChannel: string | null;
  // bio description
  bio: string | null;
  // user's location
  location: string | null;
  // registerd on
  registeredOn?: string | null;
  // last login
  lastLogin?: string | null;
}

export interface ILastOpenedChannelPayload {
  uid: string;
  channelId: string;
}

export interface IUserState extends IUserMetadata {
  loading: boolean;
  error: string | null;
}
