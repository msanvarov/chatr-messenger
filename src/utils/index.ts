import _ from 'lodash';
import { IDirectMessageMetadata, IUserMetadata } from '../redux';

export const getDirectMessagingChannelMetadata = (
  uid: string,
  payload?: IDirectMessageMetadata
): IUserMetadata | null => {
  if (!payload) return null;
  const nonUidKey = _.findKey(payload, (value, key) => key !== uid);

  if (nonUidKey) {
    return payload[nonUidKey];
  }
  return null;
};
