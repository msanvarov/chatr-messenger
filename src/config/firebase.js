import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBzV-wyw8lxNO1I_ygVtV7oK1IGeY6PZ4g',
  authDomain: 'react-chatr.firebaseapp.com',
  databaseURL: 'https://react-chatr.firebaseio.com',
  projectId: 'react-chatr',
  storageBucket: 'react-chatr.appspot.com',
  messagingSenderId: '777566481626',
  appId: '1:777566481626:web:4354ed83681250a27c89e3',
  measurementId: 'G-MQYCLMV64F',
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
