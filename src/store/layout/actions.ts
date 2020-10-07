import { LayoutActionTypes, ActiveTab } from './types';

export const setActiveTab = (activeTab: ActiveTab) => ({
  type: LayoutActionTypes.SET_ACTIVE_TAB,
  payload: activeTab,
});

export const openUserSidebar = () => ({
  type: LayoutActionTypes.OPEN_USER_PROFILE_SIDEBAR,
});

export const closeUserSidebar = () => ({
  type: LayoutActionTypes.CLOSE_USER_PROFILE_SIDEBAR,
});

export const setconversationNameInOpenChat = (chatRecipient: string) => ({
  type: LayoutActionTypes.SET_CHAT_RECIPIENT_IN_OPEN_CHAT,
  payload: chatRecipient,
});
