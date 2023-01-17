import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "db";

export const incrementStoriesCount = async (
  addedStoriesCount: number
): Promise<void> =>
  updateDoc(doc(db, "metadata", "data"), {
    storiesCount: increment(addedStoriesCount),
  });
