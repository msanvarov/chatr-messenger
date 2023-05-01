import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ActiveTab, ILayoutState } from './types';

const initialState: ILayoutState = {
  activeTab: 'chat',
  userSidebar: false,
  layoutColorMode: 'light',
  loading: false,
  error: null,
};

export const setLayoutColorMode = createAsyncThunk(
  '@@layout/setLayoutColorMode',
  async (colorMode: 'light' | 'dark', { rejectWithValue }) => {
    try {
      document.body.setAttribute('data-layout-mode', colorMode);
      return colorMode;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const layoutSlice = createSlice({
  name: '@@layout',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    toggleUserSidebar: (state) => {
      state.userSidebar = !state.userSidebar;
    },
    // setLayoutColorMode: (state, action: PayloadAction<'light' | 'dark'>) => {
    //   state.layoutColorMode = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(setLayoutColorMode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setLayoutColorMode.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(setLayoutColorMode.fulfilled, (state, action) => {
      state.layoutColorMode = action.payload;
      state.loading = false;
    });
  },
});

export const { setActiveTab, toggleUserSidebar } = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
