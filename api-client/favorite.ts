import {
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  function as F,
  array as AMut,
  readonlyArray as A,
  either as E,
  taskEither as TE,
} from "fp-ts";
import { Favorite as DBFavorite } from "db";
import { Favorite as FavoriteSchema } from "api-schemas";
import { UseInfiniteQuery } from "./util";
import { useUserContext } from "@/context/user";

export type Document = DBFavorite.FavoriteDocument;
export type Body = FavoriteSchema.FavoriteBody;
export type Response = FavoriteSchema.FavoriteResponse;

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

export const useFavorite = (
  storyId: string
): {
  readonly data: E.Either<unknown, Response>;
  readonly isLoading: boolean;
} => {
  const { id: userId } = useUserContext();

  const {
    data: rawData,
    error,
    isLoading,
  } = useQuery(["favorites", userId, storyId], async () =>
    DBFavorite.getFavorite(userId!, storyId)
  );

  return {
    data: F.pipe(
      // Force new line
      rawData,
      E.fromNullable(error),
      E.map(serializeFavorite)
    ),
    isLoading,
  };
};

export const useAddFavorite = (): ((
  storyDetails: FavoriteSchema.StoryData
) => TE.TaskEither<unknown, DocumentReference<Document>>) => {
  const { id: userId } = useUserContext();
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation(
    async (favorite: Body) => DBFavorite.createFavorite(favorite),
    {
      onSuccess: () => queryClient.invalidateQueries("favorites"),
    }
  );

  return (storyDetails: FavoriteSchema.StoryData) =>
    F.pipe(
      storyDetails,
      (storyDetails) => ({
        userId,
        ...storyDetails,
      }),
      FavoriteSchema.FavoriteBody.encode,
      (encodedBody) =>
        TE.tryCatch(
          () => addFavoriteMutation.mutateAsync(encodedBody),
          (error) => error
        )
    );
};

export const useDeleteFavorite = (): ((
  id: string
) => TE.TaskEither<unknown, void>) => {
  const queryClient = useQueryClient();

  const deleteFavoriteMutation = useMutation(
    async (id: string) => DBFavorite.deleteFavorite(id),
    {
      onSuccess: () => queryClient.invalidateQueries("favorites"),
    }
  );

  return (id: string) =>
    TE.tryCatch(
      () => deleteFavoriteMutation.mutateAsync(id),
      (error) => error
    );
};

export const useFavoritesInfinite = (
  userId: string
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
