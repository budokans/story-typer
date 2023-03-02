import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useCallback } from "react";
import {
  function as F,
  array as AMut,
  readonlyArray as A,
  either as E,
  taskEither as TE,
} from "fp-ts";
import { QueryDocumentSnapshot } from "firelordjs";
import { Favorite as DBFavorite } from "db";
import { Favorite as FavoriteSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";
import { User as UserContext } from "context";

export type Document = DBFavorite.DocumentRead;
export type Body = FavoriteSchema.FavoriteBody;
export type Response = FavoriteSchema.FavoriteResponse;

export const serializeFavorite = (favoriteDoc: Document): Response => ({
  id: favoriteDoc.id,
  userId: favoriteDoc.userId,
  storyId: favoriteDoc.storyId,
  storyTitle: favoriteDoc.storyTitle,
  storyHtml: favoriteDoc.storyHtml,
  dateFavorited: favoriteDoc.dateFavorited.toDate().toISOString(),
});

export const useFavorite = (
  storyId: string
): {
  readonly data: E.Either<unknown, Response>;
  readonly isLoading: boolean;
} => {
  const { id: userId } = UserContext.useUserContext();

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
) => TE.TaskEither<unknown, string>) => {
  const { id: userId } = UserContext.useUserContext();
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation(
    async (favorite: Body) => DBFavorite.createFavorite(favorite),
    {
      onSuccess: () => queryClient.invalidateQueries("favorites"),
    }
  );

  return useCallback(
    (storyDetails: FavoriteSchema.StoryData) =>
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
      ),
    [userId, addFavoriteMutation]
  );
};

export const useDeleteFavorite = (): ((
  id: string
) => TE.TaskEither<unknown, void>) => {
  const queryClient = useQueryClient();

  const deleteFavoriteMutation = useMutation(
    (id: string) => DBFavorite.deleteFavorite(id),
    {
      onSuccess: () => queryClient.invalidateQueries("favorites"),
    }
  );

  return useCallback(
    (id: string) =>
      TE.tryCatch(
        () => deleteFavoriteMutation.mutateAsync(id),
        (error) => error
      ),
    [deleteFavoriteMutation]
  );
};

export const useFavoritesInfinite = (
  userId: string
): APIUtil.UseInfiniteQuery<
  DBFavorite.FavoritesWithCursor<Response, DBFavorite.FavoriteDocumentMetaType>,
  DBFavorite.FavoritesWithCursor<Document, DBFavorite.FavoriteDocumentMetaType>
> => {
  const {
    data: rawData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "favorites",
    ({
      pageParam = null,
    }: {
      readonly pageParam?: QueryDocumentSnapshot<DBFavorite.FavoriteDocumentMetaType> | null;
    }) =>
      DBFavorite.getFavorites({
        userId: userId!,
        last: pageParam,
        _limit: APIUtil.defaultInfiniteQueryLimit,
      }),
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
              data: F.pipe(page.data, A.map(serializeFavorite)),
              cursor: page.cursor,
            }))
          ),
          pageParams: rawData.pageParams,
        }
      : undefined,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  };
};
