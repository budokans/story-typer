import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    }),
  });
}

export { firebaseAdmin };
