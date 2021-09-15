export interface IUserMetadata {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  channels: string[];
  lastViewedChannel: string | null;
  // bio description
  bio: string | null;
  // user's location
  location: string | null;
}

export interface IUserState extends IUserMetadata {
  loading: boolean;
  error: string | null;
}

export type IUserMetadataPayload = Pick<IUserMetadata, 'uid'> &
  Partial<Omit<IUserMetadata, 'uid'>>;
