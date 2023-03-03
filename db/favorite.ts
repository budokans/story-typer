import {
  addDoc,
  deleteDoc,
  getDocs,
  getFirelord,
  limit,
  MetaType,
  MetaTypeCreator,
  orderBy,
  query,
  QueryDocumentSnapshot,
  ServerTimestamp,
  serverTimestamp,
  startAfter,
  where,
} from "firelordjs";
import { function as F, readonlyArray as A, option as O } from "fp-ts";
import { db, Util as DBUtil, Error as DBError } from "db";

export type FavoriteDocumentMetaType = MetaTypeCreator<
  {
    readonly userId: string;
    readonly storyId: string;
    readonly storyTitle: string;
    readonly storyHtml: string;
    readonly dateFavorited: ServerTimestamp;
  },
  "favorites",
  string
>;
export type DocumentWrite = DBUtil.Write<FavoriteDocumentMetaType>;
export type DocumentRead = DBUtil.Read<FavoriteDocumentMetaType>;

interface CreateFavoriteData {
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
}

export const favorites = getFirelord<FavoriteDocumentMetaType>(db, "favorites");

export const createFavorite: (
  createData: CreateFavoriteData
) => Promise<string> = F.flow(
  (createData): DocumentWrite => ({
    dateFavorited: serverTimestamp(),
    ...createData,
  }),
  (body) =>
    addDoc(favorites.collection(), body)
      .then((res) => res.id)
      .catch(DBError.catchError)
);

export const getFavorite = (
  userId: string,
  storyId: string
): Promise<DocumentRead | undefined> =>
  F.pipe(
    query(
      favorites.collection(),
      where("userId", "==", userId),
      where("storyId", "==", storyId),
      limit(1)
    ),
    (q) =>
      getDocs(q)
        .then(({ docs }) =>
          F.pipe(
            docs,
            A.fromArray,
            A.head,
            O.fold(
              // Force new line
              F.constUndefined,
              DBUtil.buildDocumentRead
            )
          )
        )
        .catch(DBError.catchError)
  );

export interface FavoritesWithCursor<A, R extends MetaType> {
  readonly data: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getFavorites = (params: {
  readonly userId: string;
  readonly last: QueryDocumentSnapshot<FavoriteDocumentMetaType> | null;
  readonly _limit: number;
}): Promise<FavoritesWithCursor<DocumentRead, FavoriteDocumentMetaType>> =>
  F.pipe(
    params,
    ({ userId, last, _limit }) =>
      last
        ? query(
            favorites.collection(),
            orderBy("dateFavorited", "desc"),
            where("userId", "==", userId),
            startAfter(
              last.data({ serverTimestamps: "estimate" }).dateFavorited
            ),
            limit(_limit)
          )
        : query(
            favorites.collection(),
            orderBy("dateFavorited", "desc"),
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

export const deleteFavorite = (id: string): Promise<void> =>
  deleteDoc(favorites.doc(id)).catch(DBError.catchError);
