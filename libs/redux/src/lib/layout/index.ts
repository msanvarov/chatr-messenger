import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ILayoutState, ActiveTab } from './types';

const initialState: ILayoutState = {
  activeTab: 'chat',
  userSidebar: false,
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
  },
});

export const { setActiveTab, toggleUserSidebar } = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
