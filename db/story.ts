import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  FieldValue,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { function as F } from "fp-ts";
import { db } from "db";
import { Story } from "api-schemas";

export interface StoryDocument {
  readonly id: string;
  readonly title: string;
  readonly authorBio: string;
  readonly storyHtml: string;
  readonly storyText: string;
  readonly url: string;
  readonly datePublished: string;
  readonly dateScraped: FieldValue;
}

export const storyConverter: FirestoreDataConverter<StoryDocument> = {
  toFirestore: (body: StoryDocument) => body,
  fromFirestore: (snapshot: QueryDocumentSnapshot): StoryDocument =>
    F.pipe(
      // Force new line
      snapshot,
      (snapshot) => ({ id: snapshot.id, data: snapshot.data() }),
      ({ id, data }): StoryDocument => ({
        id: id,
        title: data.title,
        authorBio: data.authorBio,
        storyHtml: data.storyHtml,
        storyText: data.storyText,
        url: data.url,
        datePublished: data.datePublished,
        dateScraped: data.dateScraped,
      })
    ),
};

export const createStory = async (
  body: Story.StoryBody
): Promise<DocumentReference<StoryDocument>> =>
  F.pipe(
    collection(db, "stories"),
    (collRef) => collRef.withConverter(storyConverter),
    (typedCollRef) =>
      addDoc(typedCollRef, {
        ...body,
        // This is annoying, but in order to use our converter, we must supply an ID here
        id: "This will be overwritten on the server",
        dateScraped: serverTimestamp(),
      })
  );

export const lastStoryTimestamp = async (): Promise<string> => {
  const storiesCollRef = collection(db, "stories").withConverter(
    storyConverter
  );
  const q = query(storiesCollRef, orderBy("datePublished", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]!.data().datePublished;
};

export const getStory = async (
  id: string
): Promise<StoryDocument | undefined> => {
  const docRef = doc(db, "stories", id).withConverter(storyConverter);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : undefined;
};

const initialStoryQueryLimit = 10;

export const getStories = async (
  latest: string | null,
  oldest: string | null
): Promise<readonly StoryDocument[] | undefined> => {
  let localLimit: number = initialStoryQueryLimit;
  let batch: StoryDocument[] = [];
  let snapshot: QuerySnapshot<StoryDocument>;

  const storiesCollRef = collection(db, "stories");

  if (!latest) {
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      limit(initialStoryQueryLimit)
    ).withConverter(storyConverter);
    snapshot = await getDocs(q);
  } else {
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      startAfter(latest),
      limit(initialStoryQueryLimit)
    ).withConverter(storyConverter);
    snapshot = await getDocs(q);
  }

  if (snapshot.docs.length > 0) {
    batch = snapshot.docs.map((doc) => doc.data());
  }

  if (batch.length < 10) {
    localLimit -= batch.length;
    const q = query(
      storiesCollRef,
      orderBy("datePublished", "desc"),
      startAfter(oldest),
      limit(localLimit)
    ).withConverter(storyConverter);
    snapshot = await getDocs(q);
    batch = snapshot.docs.map((doc) => doc.data());
  }

  return batch.length > 0 ? batch : undefined;
};
