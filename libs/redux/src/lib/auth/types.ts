export interface ILoginPayload {
  email: string;
  password: string;
  keepLoggedOn: boolean;
}

export interface IRegisterPayload {
  email: string;
  password: string;
  name: string;
  picture: string;
}

export interface IAuthState {
  readonly isAuthenticated: boolean;
  readonly emailVerified: boolean | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export interface FirebaseJWT {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
}

export interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

export interface Identities {
  email: string[];
}
