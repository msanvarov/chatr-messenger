import { Reducer } from 'redux';
import { ILayoutState, LayoutActionTypes } from './types';

export const startingState: ILayoutState = {
  activeTab: 'chat',
  userSidebar: false,
  chatRecipient: 'Sal Anvarov',
};

const reducer: Reducer<ILayoutState> = (state = startingState, action) => {
  switch (action.type) {
    case LayoutActionTypes.SET_ACTIVE_TAB: {
      return { ...state, activeTab: action.payload };
    }
    case LayoutActionTypes.OPEN_USER_PROFILE_SIDEBAR:
      return {
        ...state,
        userSidebar: true,
      };

    case LayoutActionTypes.CLOSE_USER_PROFILE_SIDEBAR:
      return {
        ...state,
        userSidebar: false,
      };

    case LayoutActionTypes.SET_CHAT_RECIPIENT_IN_OPEN_CHAT:
      return {
        ...state,
        conversationName: action.payload,
      };
    default: {
      return state;
    }
  }
};

export { reducer as layoutReducer };
