export interface IFirebaseUsersAPIResponse {
  users: IUser[];
}

export interface IUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}
