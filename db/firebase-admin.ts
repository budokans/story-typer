import * as firebaseAdmin from "firebase-admin";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firelord";
import serviceAccount from "../serviceAccount.json";

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp(
    {
      credential: cert(serviceAccount as firebaseAdmin.ServiceAccount),
    },
    "admin"
  );
}

export const dbAdmin = getFirestore();
