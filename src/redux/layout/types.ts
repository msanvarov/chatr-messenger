export type ActiveTab =
  | 'chat'
  | 'profile'
  | 'channels'
  | 'contacts'
  | 'settings';

export interface ILayoutState {
  readonly activeTab: ActiveTab;
  readonly layoutColorMode: 'light' | 'dark';
  readonly userSidebar: boolean;
  readonly loading: boolean;
  readonly error: string | null;
}
