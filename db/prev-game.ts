import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  FieldValue,
  FirestoreDataConverter,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { function as F } from "fp-ts";
import { db } from "db";
import { PrevGame, Story } from "api-schemas";

export interface PrevGameDocument {
  readonly id: string;
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
  readonly score: number;
  readonly datePlayed: FieldValue;
}

const prevGameConverter: FirestoreDataConverter<PrevGameDocument> = {
  toFirestore: (body: PrevGameDocument) => body,
  fromFirestore: (snapshot: QueryDocumentSnapshot): PrevGameDocument =>
    F.pipe(
      // Force new line
      snapshot,
      (snapshot) => ({ id: snapshot.id, data: snapshot.data() }),
      ({ id, data }): PrevGameDocument => ({
        id: id,
        userId: data.userId,
        storyId: data.storyId,
        storyTitle: data.storyTitle,
        storyHtml: data.storyHtml,
        score: data.score,
        datePlayed: data.datePlayed,
      })
    ),
};

export const buildGame = (
  userId: string,
  story: Story.StoryResponse,
  wpm: number
): PrevGame.PrevGameBody => ({
  userId: userId,
  storyId: story.id,
  storyTitle: story.title,
  storyHtml: story.storyHtml,
  score: wpm,
});

export const createPrevGame = async (
  body: PrevGame.PrevGameBody
): Promise<DocumentReference<PrevGameDocument>> =>
  F.pipe(
    collection(db, "prevGames"),
    (collRef) => collRef.withConverter(prevGameConverter),
    (typedCollRef) =>
      addDoc(typedCollRef, {
        ...body,
        // This is annoying, but in order to use our converter, we must supply an ID here
        id: "This will be overwritten on the server",
        datePlayed: serverTimestamp(),
      })
  );

export const prevGamesQueryLimit = 10;

export interface PrevGamesWithCursor<A, R> {
  readonly prevGames: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getPrevGames = async (
  userId: string,
  last: QueryDocumentSnapshot<PrevGameDocument> | null
): Promise<PrevGamesWithCursor<PrevGameDocument, PrevGameDocument>> => {
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

  const querySnapshot = await getDocs(
    query(queryRef.withConverter(prevGameConverter))
  );
  const prevGames = querySnapshot.docs.map((doc) => doc.data());

  const cursor =
    querySnapshot.docs.length === 10
      ? querySnapshot.docs[querySnapshot.docs.length - 1]!
      : null;

  return { prevGames, cursor };
};
