import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "db";
import { PrevGame, Story } from "api-schemas";

export const buildGame = (
  userId: string,
  story: Story.Story,
  wpm: number
): PrevGame.PrevGame => ({
  userId: userId,
  storyId: story.id,
  storyTitle: story.title,
  storyHtml: story.storyHtml,
  datePlayed: new Date().toISOString(),
  score: wpm,
});

export const createPrevGame = async (
  game: PrevGame.PrevGame
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "prevGames"), game);

const prevGamesQueryLimit = 10;

export const getPrevGames = async (
  userId: string,
  last: QueryDocumentSnapshot<DocumentData>
): Promise<{
  prevGames: PrevGame.PrevGame[];
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
    (prevGame) => prevGame.data() as PrevGame.PrevGame
  );

  const cursor =
    querySnapshot.docs.length === 10
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { prevGames, cursor };
};
