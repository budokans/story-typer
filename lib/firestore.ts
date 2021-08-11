import { Story, User } from "../interfaces";
import { firebase } from "./firebase";

const firestore = firebase.firestore();

export const createUser = (uid: string, data: User): void => {
  firestore.collection("users").doc(uid).set({ data }, { merge: true });
};

export const createStory = (story: Story): void => {
  firestore
    .collection("stories")
    .doc()
    .set({
      ...story,
      dateScraped: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const getLatestTimestamp = async (): Promise<string> => {
  const snapshot = await firestore
    .collection("stories")
    .orderBy("datePublished", "desc")
    .limit(1)
    .get();

  return snapshot.docs[0].data().datePublished;
};
