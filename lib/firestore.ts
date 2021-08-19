import { Story, User } from "../interfaces";
import { firebase } from "./firebase";

const db = firebase.firestore();

export const queryUser = async (uid: string): Promise<User | undefined> => {
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();
  return doc.exists ? (doc.data() as User) : undefined;
};

export const createUser = async (uid: string, user: User): Promise<void> => {
  db.collection("users").doc(uid).set(user, { merge: true });
};

export const createStory = async (story: Story): Promise<void> => {
  await db
    .collection("stories")
    .doc()
    .set({
      ...story,
      dateScraped: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

const incrementByVal = (val: number) =>
  firebase.firestore.FieldValue.increment(val);

export const incrementStoriesCount = async (
  changeVal: number
): Promise<void> => {
  const metadataRef = db.collection("metadata").doc("data");
  await metadataRef.update({
    storiesCount: incrementByVal(changeVal),
  });
};

export const getLatestTimestamp = async (): Promise<string> => {
  const snapshot = await db
    .collection("stories")
    .orderBy("datePublished", "desc")
    .limit(1)
    .get();

  return snapshot.docs[0].data().datePublished;
};
