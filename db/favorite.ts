import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "db";
import { Favorite } from "interfaces";

const favoritesQueryLimit = 10;

export const createFavorite = async (
  favorite: Favorite
): Promise<DocumentReference<DocumentData>> =>
  addDoc(collection(db, "favorites"), favorite);

export const getFavorite = async (
  userId: string,
  storyId: string
): Promise<string | undefined> => {
  const favoritesRef = collection(db, "favorites");
  const querySnapshot = await getDocs(
    query(
      favoritesRef,
      where("userId", "==", userId),
      where("storyId", "==", storyId)
    )
  );

  if (querySnapshot.docs.length === 0) {
    return undefined;
  }

  return querySnapshot.docs[0].id;
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

export const deleteFavorite = async (id: string): Promise<void> =>
  deleteDoc(doc(db, "favorites", id));
