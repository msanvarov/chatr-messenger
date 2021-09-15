import { getFirestore } from '@firebase/firestore';

export * from './lib/store';
export * from './lib/hooks';
export * from './lib/auth';
export * from './lib/auth/types';
export * from './lib/channel';
export * from './lib/channel/types';
export * from './lib/layout';
export * from './lib/layout/types';
export * from './lib/user';
export * from './lib/user/types';
export { useGetUsersQuery } from './lib/api/users';
export * from './lib/api/users/types';

export const db = getFirestore();
