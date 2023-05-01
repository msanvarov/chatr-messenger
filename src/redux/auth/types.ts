export interface ILoginPayload {
  email: string;
  password: string;
  persistLogin: boolean;
}

export interface IRegisterPayload {
  email: string;
  password: string;
  name: string;
  picture: string;
}

export enum AuthErrorCodeEnum {
  LOGIN_FAILED,
  REGISTER_FAILED,
  FOGOT_PASSWORD_FAILED,
  LOGOUT_FAILED,
}

export interface IAuthState {
  readonly isAuthenticated: boolean;
  readonly isEmailConfirmed: boolean | null;
  readonly loading: boolean;
  readonly error: {
    code: AuthErrorCodeEnum;
    message: string;
  } | null;
}

export interface IFirebaseUserResponseType {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: IProviderDatum[];
  stsTokenManager: IStsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

export interface IProviderDatum {
  providerId: string;
  uid: string;
  displayName: null;
  email: string;
  phoneNumber: null;
  photoURL: null;
}

export interface IStsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}
