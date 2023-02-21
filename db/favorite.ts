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
import { function as F, array as AMut, option as O } from "fp-ts";
import { firelordDb } from "db";

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
export type DocumentWrite = FavoriteDocumentMetaType["write"];
export type DocumentRead = FavoriteDocumentMetaType["read"] & {
  readonly id: string;
};

interface CreateFavoriteData {
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
}

export const favorites = getFirelord<FavoriteDocumentMetaType>(
  firelordDb,
  "favorites"
);

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
      .catch((e: unknown) => {
        throw new Error(String(e));
      })
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
            AMut.head,
            O.fold(
              // Force new line
              F.constUndefined,
              (docSnapshot) => ({
                id: docSnapshot.id,
                ...docSnapshot.data({ serverTimestamps: "estimate" }),
              })
            )
          )
        )
        .catch((e: unknown) => {
          throw new Error(String(e));
        })
  );

const favoritesQueryLimit = 10;

export interface FavoritesWithCursor<A, R extends MetaType> {
  readonly data: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getFavorites: ({
  userId,
  last,
}: {
  readonly userId: string;
  readonly last: QueryDocumentSnapshot<FavoriteDocumentMetaType> | null;
}) => Promise<FavoritesWithCursor<DocumentRead, FavoriteDocumentMetaType>> =
  F.flow(
    // Force new line
    ({ userId, last }) =>
      last
        ? query(
            favorites.collection(),
            orderBy("dateFavorited", "desc"),
            where("userId", "==", userId),
            startAfter(
              last.data({ serverTimestamps: "estimate" }).dateFavorited
            ),
            limit(favoritesQueryLimit)
          )
        : query(
            favorites.collection(),
            orderBy("dateFavorited", "desc"),
            where("userId", "==", userId),
            limit(favoritesQueryLimit)
          ),
    (q) =>
      getDocs(q)
        .then((querySnapshot) => ({
          data: querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data({ serverTimestamps: "estimate" }),
          })),
          cursor:
            querySnapshot.size === favoritesQueryLimit
              ? querySnapshot.docs[querySnapshot.size - 1]!
              : null,
        }))
        .catch((e: unknown) => {
          throw new Error(String(e));
        })
  );

export const deleteFavorite = (id: string): Promise<void> =>
  deleteDoc(favorites.doc(id)).catch((e: unknown) => {
    throw new Error(String(e));
  });
