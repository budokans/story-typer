import { function as F } from "fp-ts";
import {
  addDoc,
  getDocs,
  getFirelord,
  limit,
  MetaType,
  MetaTypeCreator,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  ServerTimestamp,
  startAfter,
  where,
} from "firelordjs";
import { firelordDb, Util } from "./";
import { Story } from "api-schemas";

export type PrevGameDocumentMetaType = MetaTypeCreator<
  {
    readonly userId: string;
    readonly storyId: string;
    readonly storyTitle: string;
    readonly storyHtml: string;
    readonly score: number;
    readonly datePlayed: ServerTimestamp;
  },
  "prevGames",
  string
>;
export type DocumentWrite = Util.Write<PrevGameDocumentMetaType>;
export type DocumentRead = Util.Read<PrevGameDocumentMetaType>;
export const prevGames = getFirelord<PrevGameDocumentMetaType>(
  firelordDb,
  "prevGames"
);

interface CreatePrevGameData {
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
  readonly score: number;
}

export const buildGame = (
  userId: string,
  story: Story.StoryResponse,
  wpm: number
): CreatePrevGameData => ({
  userId: userId,
  storyId: story.id,
  storyTitle: story.title,
  storyHtml: story.storyHtml,
  score: wpm,
});

export const createPrevGame: (
  createData: CreatePrevGameData
) => Promise<string> = F.flow(
  (createData): DocumentWrite => ({
    datePlayed: serverTimestamp(),
    ...createData,
  }),
  (body) =>
    addDoc(prevGames.collection(), body)
      .then((res) => res.id)
      .catch((e: unknown) => {
        throw new Error(String(e));
      })
);

export const prevGamesQueryLimit = 10;

export interface PrevGamesWithCursor<A, R extends MetaType> {
  readonly data: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getPrevGames: ({
  userId,
  last,
}: {
  readonly userId: string;
  readonly last: QueryDocumentSnapshot<PrevGameDocumentMetaType> | null;
}) => Promise<PrevGamesWithCursor<DocumentRead, PrevGameDocumentMetaType>> =
  F.flow(
    // Force new line
    ({ userId, last }) =>
      last
        ? query(
            prevGames.collection(),
            orderBy("datePlayed", "desc"),
            where("userId", "==", userId),
            startAfter(last.data({ serverTimestamps: "estimate" }).datePlayed),
            limit(prevGamesQueryLimit)
          )
        : query(
            prevGames.collection(),
            orderBy("datePlayed", "desc"),
            where("userId", "==", userId),
            limit(prevGamesQueryLimit)
          ),
    (q) =>
      getDocs(q)
        .then((querySnapshot) => ({
          data: querySnapshot.docs.map(Util.buildDocumentRead),
          cursor:
            querySnapshot.size === prevGamesQueryLimit
              ? querySnapshot.docs[querySnapshot.size - 1]!
              : null,
        }))
        .catch((e: unknown) => {
          throw new Error(String(e));
        })
  );
