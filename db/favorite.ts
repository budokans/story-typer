import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  FirestoreDataConverter,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { function as F } from "fp-ts";
import { db } from "db";
import { Favorite } from "api-schemas";

export interface FavoriteDocument {
  readonly id: string;
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
  readonly dateFavorited: FieldValue;
}

export const favoriteConverter: FirestoreDataConverter<FavoriteDocument> = {
  toFirestore: (body: FavoriteDocument) => body,
  fromFirestore: (snapshot: QueryDocumentSnapshot): FavoriteDocument =>
    F.pipe(
      // Force new line
      snapshot,
      (snapshot) => ({ id: snapshot.id, data: snapshot.data() }),
      ({ id, data }): FavoriteDocument => ({
        id: id,
        userId: data.userId,
        storyId: data.storyId,
        storyTitle: data.storyTitle,
        storyHtml: data.storyHtml,
        dateFavorited: data.dateFavorited,
      })
    ),
};

export const createFavorite = async (
  body: Favorite.FavoriteBody
): Promise<DocumentReference<FavoriteDocument>> =>
  F.pipe(
    collection(db, "favorites"),
    (collRef) => collRef.withConverter(favoriteConverter),
    (typedCollRef) =>
      addDoc(typedCollRef, {
        ...body,
        // This is annoying, but in order to use our converter, we must supply an ID here
        id: "This will be overwritten on the server",
        dateFavorited: serverTimestamp(),
      })
  );

export const getFavorite = async (
  userId: string,
  storyId: string
): Promise<FavoriteDocument | undefined> => {
  const favoritesRef = collection(db, "favorites");
  const querySnapshot = await getDocs(
    query(
      favoritesRef,
      where("userId", "==", userId),
      where("storyId", "==", storyId),
      limit(1)
    ).withConverter(favoriteConverter)
  );

  return querySnapshot.size === 1 ? querySnapshot.docs[0].data() : undefined;
};

const favoritesQueryLimit = 10;

export interface FavoriteWithCursor<A, R> {
  readonly favorites: readonly A[];
  readonly cursor: QueryDocumentSnapshot<R> | null;
}

export const getFavorites = async (
  userId: string,
  last: QueryDocumentSnapshot<FavoriteDocument> | null
): Promise<{
  favorites: readonly FavoriteDocument[];
  cursor: QueryDocumentSnapshot<FavoriteDocument> | null;
}> => {
  let queryRef: Query<DocumentData>;
  const favoritesCollRef = collection(db, "favorites");

  if (!last) {
    queryRef = query(
      favoritesCollRef,
      orderBy("dateFavorited", "desc"),
      where("userId", "==", userId),
      limit(favoritesQueryLimit)
    );
  } else {
    queryRef = query(
      favoritesCollRef,
      orderBy("dateFavorited", "desc"),
      where("userId", "==", userId),
      startAfter(last.data().dateFavorited),
      limit(favoritesQueryLimit)
    );
  }

  const querySnapshot = await getDocs(
    query(queryRef.withConverter(favoriteConverter))
  );
  const favorites = querySnapshot.docs.map((doc) => doc.data());

  const cursor =
    querySnapshot.docs.length === 10
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { favorites, cursor };
};

export const deleteFavorite = async (id: string): Promise<void> =>
  deleteDoc(doc(db, "favorites", id));
