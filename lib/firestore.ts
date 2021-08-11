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
