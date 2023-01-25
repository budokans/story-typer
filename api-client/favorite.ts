import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { useInfiniteQuery } from "react-query";
import { function as F, array as AMut, readonlyArray as A } from "fp-ts";
import { Favorite as DBFavorite } from "db";
import { Favorite as FavoriteSchema } from "api-schemas";
import { UseInfiniteQuery } from "./util";

type Document = DBFavorite.FavoriteDocument;
type Response = FavoriteSchema.FavoriteResponse;

export const serializeFavorite = (favoriteDoc: Document): Response => ({
  id: favoriteDoc.id,
  userId: favoriteDoc.userId,
  storyId: favoriteDoc.storyId,
  storyTitle: favoriteDoc.storyTitle,
  storyHtml: favoriteDoc.storyHtml,
  // Sadly, an unavoidable cast as serverTimestamp() returns a FieldValue
  dateFavorited: (favoriteDoc.dateFavorited as Timestamp)
    .toDate()
    .toISOString(),
});

export const useFavoritesInfinite = (
  userId: string | undefined
): UseInfiniteQuery<
  DBFavorite.FavoriteWithCursor<Response, Document>,
  DBFavorite.FavoriteWithCursor<Document, Document>
> => {
  const {
    data: rawData,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "favorites",
    async ({
      pageParam = null,
    }: {
      readonly pageParam?: QueryDocumentSnapshot<Document> | null;
    }) => await DBFavorite.getFavorites(userId!, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      refetchOnWindowFocus: false,
      enabled: !!userId,
    }
  );

  return {
    data: rawData
      ? {
          pages: F.pipe(
            rawData.pages,
            AMut.map((page) => ({
              favorites: F.pipe(page.favorites, A.map(serializeFavorite)),
              cursor: page.cursor,
            }))
          ),
          pageParams: rawData.pageParams,
        }
      : undefined,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};
