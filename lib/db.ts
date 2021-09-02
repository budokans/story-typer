import { PrevGame, Story, StoryWithId, User } from "../interfaces";
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

export const queryStories = async (): Promise<StoryWithId[]> => {
  const snapshot = await db
    .collection("stories")
    .orderBy("datePublished", "desc")
    .limit(10)
    .get();

  // TO DO: return the last document snapshot to pass to the next query cursor clause as well as the documents.
  const stories = snapshot.docs.map((doc) => {
    const story = doc.data() as Story;
    return {
      uid: doc.id,
      ...story,
    } as StoryWithId;
  });

  return stories;
};

export const createPrevGame = async (game: PrevGame): Promise<void> => {
  await db.collection("prevGames").add(game);
};
