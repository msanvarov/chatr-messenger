import _ from 'lodash';
import {
  IDirectMessageMetadata,
  IDirectMessagingChannelMetadata,
} from '../redux';

export const getDirectMessagingChannelMetadata = (
  uid: string,
  payload?: IDirectMessageMetadata
): IDirectMessagingChannelMetadata | null => {
  if (!payload) return null;
  const nonUidKey = _.findKey(payload, (value, key) => key !== uid);

  if (nonUidKey) {
    return payload[nonUidKey];
  }
  return null;
};
