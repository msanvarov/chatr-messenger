import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { patchUserMetadata, patchUserProfile } from '../firestore-helpers';

import { setUserMetadata } from '../user';
import { IUserMetadata } from '../user/types';
import {
  AuthErrorCodeEnum,
  IAuthState,
  IFirebaseUserResponseType,
  ILoginPayload,
  IRegisterPayload,
} from './types';

const initialState: IAuthState = {
  isAuthenticated: false,
  isEmailConfirmed: null,
  // status is for async thunk operations only (maybe requires a renaming to be clearer)
  loading: false,
  error: null,
};

// async methods for auth logic
export const login = createAsyncThunk(
  '@@auth/login',
  async (
    { email, password, persistLogin }: ILoginPayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      // set persistence type based on flag
      persistLogin
        ? setPersistence(auth, browserLocalPersistence)
        : setPersistence(auth, browserSessionPersistence);

      // authenticate user
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      dispatch(
        setUserMetadata({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      return user.toJSON();
    } catch (e) {
      console.error(e);
      return rejectWithValue('Failed to authenticate user. Please try again.');
    }
  }
);

export const register = createAsyncThunk(
  '@@auth/register',
  async (
    { email, password, name, picture }: IRegisterPayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userMetadataPayload: IUserMetadata = {
        uid: user.uid,
        email,
        displayName: name,
        photoURL: picture,
        channels: [],
        lastOpenedChannel: null,
        bio: null,
        location: null,
        registeredOn: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
      };

      await Promise.all([
        patchUserMetadata(user.uid, userMetadataPayload),
        patchUserProfile({
          displayName: userMetadataPayload.displayName,
          photoURL: userMetadataPayload.photoURL,
        }),
      ]);

      // dispatch thunk to set user metadata
      dispatch(setUserMetadata(userMetadataPayload));

      return user.toJSON();
    } catch (e) {
      console.error(e);
      return rejectWithValue('Failed to register user. Please try again.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  '@@auth/forgotPassword',
  async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  }
);

export const logout = createAsyncThunk(
  '@@auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await signOut(auth);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const authSlice = createSlice({
  name: '@@auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsEmailConfirmed: (state, action: PayloadAction<boolean | null>) => {
      state.isEmailConfirmed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        code: AuthErrorCodeEnum.LOGIN_FAILED,
        message: action.payload as string,
      };
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        code: AuthErrorCodeEnum.REGISTER_FAILED,
        message: action.payload as string,
      };
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        code: AuthErrorCodeEnum.FOGOT_PASSWORD_FAILED,
        message: action.payload as string,
      };
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        code: AuthErrorCodeEnum.LOGOUT_FAILED,
        message: action.payload as string,
      };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.isEmailConfirmed = (
        action.payload as IFirebaseUserResponseType
      ).emailVerified;

      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: any) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.isEmailConfirmed = action.payload.emailVerified;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.isEmailConfirmed = null;
      state.error = null;
    });
  },
});

export const { setIsAuthenticated, setIsEmailConfirmed } = authSlice.actions;

export const authReducer = authSlice.reducer;
