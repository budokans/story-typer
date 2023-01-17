import { dbAdmin } from "./firebase-admin";

export const getStoriesCount = async (): Promise<number> => {
  const metadataRef = dbAdmin.collection("metadata").doc("data");
  const doc = await metadataRef.get();
  const storiesCount = doc?.data()?.storiesCount as number;
  return storiesCount || 2000;
};
