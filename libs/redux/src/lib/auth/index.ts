import {
  signOut,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { IAuthState, ILoginPayload, IRegisterPayload } from './types';
import { setUserMetadata } from '../user';

const auth = getAuth();

const initialState: IAuthState = {
  isAuthenticated: false,
  emailVerified: null,
  // status is for async thunk operations only (maybe requires a renaming to be clearer)
  loading: false,
  error: null,
};

// async methods for auth logic
export const login = createAsyncThunk(
  '@@auth/login',
  async (
    { email, password, keepLoggedOn }: ILoginPayload,
    { rejectWithValue }
  ) => {
    try {
      // set persistence type based on flag
      keepLoggedOn
        ? setPersistence(auth, browserLocalPersistence)
        : setPersistence(auth, browserSessionPersistence);

      // authenticate user
      const {
        user: { emailVerified },
      } = await signInWithEmailAndPassword(auth, email, password);

      return {
        emailVerified,
      };
    } catch (e) {
      return rejectWithValue(e.message as string);
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

      const { uid, emailVerified } = user;

      // dispatch thunk to set user metadata
      dispatch(
        setUserMetadata({
          uid,
          email,
          displayName: name,
          photoURL: picture,
          channels: [],
          lastViewedChannel: null,
          bio: null,
          location: null,
        })
      );

      return {
        emailVerified,
      };
    } catch (e) {
      return rejectWithValue(e.message as string);
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
      return rejectWithValue(e.message as string);
    }
  }
);

export const authSlice = createSlice({
  name: '@@auth',
  initialState,
  reducers: {
    onLogin: (state) => {
      state.isAuthenticated = true;
    },
    resetErrorState: (state) => {
      state.error = null;
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
      state.error = action.payload as string;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.emailVerified = action.payload.emailVerified;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.emailVerified = action.payload.emailVerified;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.emailVerified = null;
    });
  },
});

export const { onLogin, resetErrorState } = authSlice.actions;

export const authReducer = authSlice.reducer;
