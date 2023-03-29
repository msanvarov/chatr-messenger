import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ActiveTab, ILayoutState } from './types';

const initialState: ILayoutState = {
  activeTab: 'chat',
  userSidebar: false,
  layoutColorMode: 'light',
};

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
    setLayoutColorMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.layoutColorMode = action.payload;
    },
  },
});

export const { setActiveTab, toggleUserSidebar, setLayoutColorMode} = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
