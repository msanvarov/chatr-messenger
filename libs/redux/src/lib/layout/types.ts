export type ActiveTab =
  | 'chat'
  | 'profile'
  | 'channels'
  | 'contacts'
  | 'settings';

export interface ILayoutState {
  readonly activeTab: ActiveTab;
  userSidebar: boolean;
}
