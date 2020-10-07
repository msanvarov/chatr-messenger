export type ActiveTab = 'chat' | 'profile' | 'group' | 'contacts' | 'settings';

export enum LayoutActionTypes {
  SET_ACTIVE_TAB = '@@layout/SET_ACTIVE_TAB',
  OPEN_USER_PROFILE_SIDEBAR = '@@layout/OPEN_USER_PROFILE_SIDEBAR',
  CLOSE_USER_PROFILE_SIDEBAR = '@@layout/CLOSE_USER_PROFILE_SIDEBAR',
  SET_CHAT_RECIPIENT_IN_OPEN_CHAT = '@@layout/SET_CHAT_RECIPIENT_IN_OPEN_CHAT',
}

export interface ILayoutState {
  readonly activeTab: ActiveTab;
  userSidebar: boolean;
  chatRecipient: string;
}
