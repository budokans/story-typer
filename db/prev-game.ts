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
import { db, Util as DBUtil, Error as DBError } from "db";

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
export type DocumentWrite = DBUtil.Write<PrevGameDocumentMetaType>;
export type DocumentRead = DBUtil.Read<PrevGameDocumentMetaType>;
export const prevGames = getFirelord<PrevGameDocumentMetaType>(db, "prevGames");

interface CreatePrevGameData {
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
  readonly score: number;
}

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
      .catch(DBError.catchError)
);

export interface PrevGamesWithCursor<A, R extends MetaType> {
  readonly data: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getPrevGames = (params: {
  readonly userId: string;
  readonly last: QueryDocumentSnapshot<PrevGameDocumentMetaType> | null;
  readonly _limit: number;
}): Promise<PrevGamesWithCursor<DocumentRead, PrevGameDocumentMetaType>> =>
  F.pipe(
    params,
    ({ userId, last, _limit }) =>
      last
        ? query(
            prevGames.collection(),
            orderBy("datePlayed", "desc"),
            where("userId", "==", userId),
            startAfter(last.data({ serverTimestamps: "estimate" }).datePlayed),
            limit(_limit)
          )
        : query(
            prevGames.collection(),
            orderBy("datePlayed", "desc"),
            where("userId", "==", userId),
            limit(_limit)
          ),
    (q) =>
      getDocs(q)
        .then((querySnapshot) => ({
          data: querySnapshot.docs.map(DBUtil.buildDocumentRead),
          cursor:
            querySnapshot.size === params._limit
              ? querySnapshot.docs[querySnapshot.size - 1]!
              : null,
        }))
        .catch(DBError.catchError)
  );
