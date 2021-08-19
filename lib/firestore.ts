import { Story, User } from "../interfaces";
import { firebase } from "./firebase";

const firestore = firebase.firestore();

export const queryUser = async (uid: string): Promise<User | undefined> => {
  const userRef = firestore.collection("users").doc(uid);
  const doc = await userRef.get();
  return doc.exists ? (doc.data() as User) : undefined;
};

export const createUser = async (uid: string, user: User): Promise<void> => {
  firestore.collection("users").doc(uid).set(user, { merge: true });
};

export const createStory = async (story: Story): Promise<void> => {
  await firestore
    .collection("stories")
    .doc()
    .set({
      ...story,
      dateScraped: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const incrementDbCount = async (
  collection: string,
  docId: string,
  fieldName: string,
  changeVal: number
): Promise<void> => {
  const docRef = firestore.collection(collection).doc(docId);
  try {
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      const newCount = doc.data()?.[fieldName] + changeVal;
      transaction.update(docRef, { [fieldName]: newCount });
      console.log(`Success: ${fieldName} incremented by ${changeVal}`);
    });
  } catch (error) {
    console.error(error);
  }
};

export const getLatestTimestamp = async (): Promise<string> => {
  const snapshot = await firestore
    .collection("stories")
    .orderBy("datePublished", "desc")
    .limit(1)
    .get();

  return snapshot.docs[0].data().datePublished;
};
