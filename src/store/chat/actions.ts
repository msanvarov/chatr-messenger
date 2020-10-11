import { ChatActionTypes } from './types';

export const chatUser = () => ({
  type: ChatActionTypes.CHAT_USER,
});

export const activeUser = (userId: number) => ({
  type: ChatActionTypes.ACTIVE_USER,
  payload: userId,
});

export const setFullUser = (fullUser: any) => ({
  type: ChatActionTypes.FULL_USER,
  payload: fullUser,
});

export const addLoggedinUser = (userData: any) => ({
  type: ChatActionTypes.ADD_LOGGED_USER,
  payload: userData,
});

export const createGroup = (groupData: any) => ({
  type: ChatActionTypes.CREATE_GROUP,
  payload: groupData,
});
