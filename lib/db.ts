import { firebase } from "./firebase";
import {
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentData,
} from "@firebase/firestore-types";
import { PrevGame, Story, StoryWithId, User } from "../interfaces";

const db = firebase.firestore();

export const queryUser = async (uid: string): Promise<User | undefined> => {
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();
  return doc.exists ? (doc.data() as User) : undefined;
};

export const getUser = async (uid: string): Promise<User> => {
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();
  return doc.data() as User;
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

export const queryStories = async (
  startAfter: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  batch: StoryWithId[];
  last: QueryDocumentSnapshot<DocumentData>;
}> => {
  let snapshot: QuerySnapshot<DocumentData>;

  if (startAfter) {
    snapshot = await db
      .collection("stories")
      .orderBy("datePublished", "desc")
      .startAfter(startAfter.data().datePublished)
      .limit(10)
      .get();
  } else {
    snapshot = await db
      .collection("stories")
      .orderBy("datePublished", "desc")
      .limit(10)
      .get();
  }

  const last = snapshot.docs[snapshot.docs.length - 1];

  const batch = snapshot.docs.map((doc) => {
    const story = doc.data() as Story;
    return {
      uid: doc.id,
      ...story,
    } as StoryWithId;
  });

  return { batch, last };
};

export const createPrevGame = async (game: PrevGame): Promise<void> => {
  await db.collection("prevGames").add(game);
};
