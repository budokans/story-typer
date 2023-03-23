import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firelord";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    }),
  });
}

export const dbAdmin = getFirestore();
