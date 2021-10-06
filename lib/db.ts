import { firebase } from "./firebase";
import { QuerySnapshot } from "@firebase/firestore-types";
import { Favorite, PrevGame, Story, StoryWithId, User } from "../interfaces";

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

const processStories = (snapshot: QuerySnapshot) => {
  return snapshot.docs.map((doc) => {
    const story = doc.data() as Story;
    return {
      uid: doc.id,
      ...story,
    } as StoryWithId;
  });
};

export const queryStories = async (
  latest: User["newestPlayedStoryPublishedDate"],
  oldest: User["oldestPlayedStoryPublishedDate"]
): Promise<StoryWithId[]> => {
  let limit = 10;
  let batch: StoryWithId[] = [];
  let snapshot;

  if (!latest) {
    snapshot = await db
      .collection("stories")
      .orderBy("datePublished", "desc")
      .limit(limit)
      .get();
  } else {
    snapshot = await db
      .collection("stories")
      .orderBy("datePublished", "asc")
      .startAfter(latest)
      .limit(limit)
      .get();
  }

  if (snapshot.docs.length > 0) {
    const processedStories = processStories(snapshot);
    batch = [...batch, ...processedStories];
  }

  if (batch.length < 10) {
    limit -= batch.length;
    snapshot = await db
      .collection("stories")
      .orderBy("datePublished", "desc")
      .startAfter(oldest)
      .limit(limit)
      .get();
    const processedStories = processStories(snapshot);
    batch = [...batch, ...processedStories];
  }

  return batch;
};

export const queryStory = async (
  id: StoryWithId["uid"]
): Promise<StoryWithId> => {
  const snapshot = await db.collection("stories").doc(id).get();
  const withId = {
    ...(snapshot.data() as Story),
    uid: snapshot.id,
  };
  return withId;
};

export const createPrevGame = async (game: PrevGame): Promise<void> => {
  await db.collection("prevGames").add(game);
};

export const updateUserDataOnWin = async (user: User): Promise<void> => {
  const userRef = db.collection("users").doc(user.uid);
  await userRef.update(user);
};

export const createFavorite = async (favorite: Favorite): Promise<void> => {
  db.collection("favorites").add({
    userId: favorite.userId,
    storyId: favorite.storyId,
    dateFavorited: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const queryFavorite = async (
  userId: User["uid"],
  storyId: StoryWithId["uid"]
): Promise<string | null> => {
  const favoritesRef = db.collection("favorites");
  const queryRef = favoritesRef
    .where("userId", "==", userId)
    .where("storyId", "==", storyId);

  const doc = await queryRef.get();
  return doc.docs.length > 0 ? doc.docs[0].id : null;
};

export const deleteFavorite = async (id: string): Promise<void> => {
  return await db.collection("favorites").doc(id).delete();
};
