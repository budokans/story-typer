import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "db";
import { Story } from "api-schemas";

const initialStoryQueryLimit = 10;

export const createStory = async (
  story: Story.ScrapedStory
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "stories"), {
    ...story,
    dateScraped: serverTimestamp(),
  });

export const lastStoryTimestamp = async (): Promise<string> => {
  const storiesCollRef = collection(db, "stories");
  const q: Query<DocumentData> = query(
    storiesCollRef,
    orderBy("datePublished", "desc"),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data().dataPublished;
};

// TODO: This particular cast is very dangerous. Remove ASAP.
const withId = (docSnapshot: DocumentSnapshot<DocumentData>): Story.Story => ({
  ...(docSnapshot.data() as Story.Story),
  id: docSnapshot.id,
});

export const getStory = async (id: string): Promise<Story.Story> => {
  const snapshot = await getDoc(doc(db, "stories", id));
  return withId(snapshot);
};

export const getStories = async (
  latest: string | null,
  oldest: string | null
): Promise<Story.Story[]> => {
  let localLimit = initialStoryQueryLimit;
  let batch: Story.Story[] = [];
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
    batch = snapshot.docs.map(withId);
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
    batch = snapshot.docs.map(withId);
  }

  return batch;
};
