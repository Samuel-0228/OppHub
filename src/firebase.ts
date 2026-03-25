import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigFile from '../firebase-applet-config.json';

type FirebaseConfigShape = {
  apiKey: string;
  appId: string;
  authDomain: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
  firestoreDatabaseId?: string;
  measurementId?: string;
};

const isUsableValue = (value?: string) => Boolean(value && value.trim() && value !== 'PLACEHOLDER');

const configFromEnv: FirebaseConfigShape = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID ?? '',
};

const configFromFile = firebaseConfigFile as FirebaseConfigShape;

const resolvedConfig: FirebaseConfigShape = {
  apiKey: isUsableValue(configFromEnv.apiKey) ? configFromEnv.apiKey : configFromFile.apiKey,
  appId: isUsableValue(configFromEnv.appId) ? configFromEnv.appId : configFromFile.appId,
  authDomain: isUsableValue(configFromEnv.authDomain) ? configFromEnv.authDomain : configFromFile.authDomain,
  messagingSenderId: isUsableValue(configFromEnv.messagingSenderId) ? configFromEnv.messagingSenderId : configFromFile.messagingSenderId,
  projectId: isUsableValue(configFromEnv.projectId) ? configFromEnv.projectId : configFromFile.projectId,
  storageBucket: isUsableValue(configFromEnv.storageBucket) ? configFromEnv.storageBucket : configFromFile.storageBucket,
  firestoreDatabaseId: isUsableValue(configFromEnv.firestoreDatabaseId)
    ? configFromEnv.firestoreDatabaseId
    : configFromFile.firestoreDatabaseId,
  measurementId: configFromFile.measurementId,
};

const requiredFields: Array<keyof FirebaseConfigShape> = [
  'apiKey',
  'appId',
  'authDomain',
  'messagingSenderId',
  'projectId',
  'storageBucket',
];

const missingFields = requiredFields.filter((field) => !isUsableValue(resolvedConfig[field]));

if (missingFields.length > 0) {
  throw new Error(
    `Firebase configuration is incomplete. Add VITE_FIREBASE_* values in .env or update firebase-applet-config.json. Missing: ${missingFields.join(', ')}`
  );
}

const app = initializeApp(resolvedConfig);

export const db = resolvedConfig.firestoreDatabaseId
  ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

export default app;
