import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey:
    import.meta.env.FIREBASE_API_KEY ??
    'AIzaSyBzV-wyw8lxNO1I_ygVtV7oK1IGeY6PZ4g',
  authDomain:
    import.meta.env.FIREBASE_AUTH_DOMAIN ?? 'react-chatr.firebaseapp.com',
  databaseURL:
    import.meta.env.FIREBASE_DATABASE_URL ??
    'https://react-chatr.firebaseio.com',
  projectId: import.meta.env.FIREBASE_PROJECT_ID ?? 'react-chatr',
  storageBucket:
    import.meta.env.FIREBASE_STORAGE_BUCKET ?? 'react-chatr.appspot.com',
  messagingSenderId:
    import.meta.env.FIREBASE_MESSAGING_SENDER_ID ?? '777566481626',
  appId:
    import.meta.env.FIREBASE_APP_ID ??
    '1:777566481626:web:4354ed83681250a27c89e3',
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID ?? 'G-MQYCLMV64F',
});

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.RECAPTCHA_KEY ?? '6Le4LNIlAAAAAM2buOolz45hWQ68sY4jZFGZ53Ly'
  ),
  isTokenAutoRefreshEnabled: true,
});

export const db = getFirestore(app);
export const auth = getAuth(app);
