import { firebaseAdmin } from "./firebase-admin";

const db = firebaseAdmin.firestore();

export const getStoriesCount = async (): Promise<number> => {
  const metadataRef = db.collection("metadata").doc("data");
  const doc = await metadataRef.get();
  const storiesCount = doc?.data()?.storiesCount as number;
  return storiesCount || 2000;
};
