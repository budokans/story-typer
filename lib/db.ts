import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
  increment,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  deleteDoc,
  Query,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { Favorite, PrevGame, Story, StoryWithId, User } from "../interfaces";

const db = getFirestore(firebaseApp);

export const getUser = async (uid: string): Promise<User> => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.data() as User;
};

export const createUser = async (uid: string, user: User): Promise<void> =>
  setDoc(doc(db, "users", uid), user, { merge: true });

export const createStory = async (
  story: Story
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "stories"), {
    ...story,
    dateScraped: serverTimestamp(),
  });

const incrementByVal = (val: number) => increment(val);

export const incrementStoriesCount = async (changeVal: number): Promise<void> =>
  updateDoc(doc(db, "metadata", "data"), {
    storiesCount: incrementByVal(changeVal),
  });

export const getLatestTimestamp = async (): Promise<string> => {
  const storiesCollRef = collection(db, "stories");
  const q: Query<DocumentData> = query(
    storiesCollRef,
    orderBy("datePublished", "desc"),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data().dataPublished;
};

const storiesWithIds = (snapshot: QuerySnapshot) =>
  snapshot.docs.map((doc) => {
    const story = doc.data() as Story;
    return {
      uid: doc.id,
      ...story,
    } as StoryWithId;
  });

const initialStoryQueryLimit = 10;

export const getStories = async (
  latest: string | null,
  oldest: string | null
): Promise<StoryWithId[]> => {
  let localLimit = initialStoryQueryLimit;
  let batch: StoryWithId[] = [];
  let snapshot: QuerySnapshot;

  const storiesCollRef = collection(db, "stories");

  if (!latest) {
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      limit(localLimit)
    );
    snapshot = await getDocs(q);
  } else {
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      startAfter(latest),
      limit(localLimit)
    );
    snapshot = await getDocs(q);
  }

  if (snapshot.docs.length > 0) {
    const processedStories = storiesWithIds(snapshot);
    batch = [...batch, ...processedStories];
  }

  if (batch.length < 10) {
    localLimit -= batch.length;
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      startAfter(oldest),
      limit(localLimit)
    );
    snapshot = await getDocs(q);
    const processedStories = storiesWithIds(snapshot);
    batch = [...batch, ...processedStories];
  }

  return batch;
};

export const getStory = async (id: string): Promise<StoryWithId> => {
  const snapshot = await getDoc(doc(db, "stories", id));
  const withId = {
    ...(snapshot.data() as Story),
    uid: snapshot.id,
  };
  return withId;
};

export const createPrevGame = async (
  game: PrevGame
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "prevGames"), game);

export const updateUserDataOnWin = async (user: User): Promise<void> =>
  updateDoc(doc(db, "users", user.uid), { ...user });

export const createFavorite = async (
  favorite: Favorite
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "favorites"), favorite);

export const getFavorite = async (
  userId: string,
  storyId: string
): Promise<string> => {
  const favoritesRef = collection(db, "favorites");
  const querySnapshot = await getDocs(
    query(
      favoritesRef,
      where("userId", "==", userId),
      where("storyId", "==", storyId)
    )
  );
  return querySnapshot.docs[0].id;
};

export const deleteFavorite = async (id: string): Promise<void> =>
  deleteDoc(doc(db, "favorites", id));

const prevGamesQueryLimit = 10;

export const getPrevGames = async (
  userId: string,
  last: QueryDocumentSnapshot<DocumentData>
): Promise<{
  prevGames: PrevGame[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  let queryRef: Query<DocumentData>;
  const prevGamesCollRef = collection(db, "prevGames");

  if (!last) {
    queryRef = query(
      prevGamesCollRef,
      orderBy("datePlayed", "desc"),
      where("userId", "==", userId),
      limit(prevGamesQueryLimit)
    );
  } else {
    queryRef = query(
      prevGamesCollRef,
      orderBy("datePlayed", "desc"),
      where("userId", "==", userId),
      startAfter(last.data().datePlayed),
      limit(prevGamesQueryLimit)
    );
  }

  const querySnapshot = await getDocs(query(queryRef));
  const prevGames = querySnapshot.docs.map(
    (prevGame) => prevGame.data() as PrevGame
  );

  const cursor =
    querySnapshot.docs.length === 10
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { prevGames, cursor };
};

export const getFavorites = async (
  userId: string,
  last: QueryDocumentSnapshot<DocumentData>
): Promise<{
  favorites: Favorite[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  let queryRef: Query<DocumentData>;
  const favoritesCollRef = collection(db, "favorites");

  if (!last) {
    queryRef = query(
      favoritesCollRef,
      orderBy("dateFavorited", "desc"),
      where("userId", "==", userId),
      limit(prevGamesQueryLimit)
    );
  } else {
    queryRef = query(
      favoritesCollRef,
      orderBy("dateFavorited", "desc"),
      where("userId", "==", userId),
      startAfter(last.data().dateFavorited),
      limit(prevGamesQueryLimit)
    );
  }

  const querySnapshot = await getDocs(query(queryRef));
  const favorites = querySnapshot.docs.map(
    (favorite) => favorite.data() as Favorite
  );

  const cursor =
    querySnapshot.docs.length === 10
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { favorites, cursor };
};
