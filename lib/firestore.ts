import "firebase/firestore";
import { User } from "../interfaces";
import { firebase } from "./firebase";

const firestore = firebase.firestore();

export const createUser = (uid: string, data: User): Promise<void> => {
  return firestore.collection("users").doc(uid).set({ data }, { merge: true });
};
