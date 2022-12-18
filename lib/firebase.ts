import { initializeApp } from "firebase/app";
import "firebase/firestore";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

export { firebaseApp };
