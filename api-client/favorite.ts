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
import { MetaType, QueryDocumentSnapshot } from "firelordjs";
import { Favorite as DBFavorite, Error as DBError } from "db";
import { Favorite as FavoriteSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";
import { User as UserContext } from "context";

export type Document = DBFavorite.DocumentRead;
export type StoryData = FavoriteSchema.StoryData;
export type Body = FavoriteSchema.FavoriteBody;
export type Response = FavoriteSchema.FavoriteResponse;
export type FavoritesWithCursor<
  A,
  R extends MetaType
> = DBFavorite.FavoritesWithCursor<A, R>;

export const serializeFavorite = (favoriteDoc: Document): Response => ({
  id: favoriteDoc.id,
  userId: favoriteDoc.userId,
  storyId: favoriteDoc.storyId,
  storyTitle: favoriteDoc.storyTitle,
  storyHtml: favoriteDoc.storyHtml,
  dateFavorited: favoriteDoc.dateFavorited.toDate().toISOString(),
});

type FavoritesQueryString = "favorites";
type FavoritesQueryKey = [FavoritesQueryString, string, string];

export const useFavorite = (
  storyId: string
): APIUtil.UseQuery<Response | undefined> => {
  const { id: userId } = UserContext.useUserContext();

  const {
    data: rawData,
    error,
    status,
  } = useQuery<
    Document | undefined,
    DBError.DBError,
    Document | undefined,
    FavoritesQueryKey
  >(["favorites", userId, storyId], async () =>
    DBFavorite.getFavorite(userId!, storyId)
  );

  if (status === "loading") return { _tag: "loading" };

  return {
    _tag: "settled",
    data: F.pipe(
      error,
      (error) => (error ? E.left(error) : E.right(rawData)),
      E.map((data) => (data ? serializeFavorite(data) : undefined))
    ),
  };
};

export const useAddFavorite = (): {
  readonly mutateAsync: (
    storyDetails: StoryData
  ) => TE.TaskEither<DBError.DBError, string>;
  readonly isLoading: boolean;
} => {
  const { id: userId } = UserContext.useUserContext();
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation<
    string,
    DBError.DBError,
    Body,
    Response | readonly Response[]
  >((favorite: Body) => DBFavorite.createFavorite(favorite), {
    onSuccess: () => queryClient.invalidateQueries("favorites"),
  });

  return {
    mutateAsync: useCallback(
      (storyDetails: StoryData) =>
        F.pipe(
          storyDetails,
          (storyDetails): Body => ({
            userId,
            ...storyDetails,
          }),
          FavoriteSchema.FavoriteBody.encode,
          (encodedBody) =>
            TE.tryCatch(
              () => addFavoriteMutation.mutateAsync(encodedBody),
              // Note: This is not fully type-safe as we're assuming that we build
              // a DBError in the db, as we do at the time of writing.
              (error) => error as DBError.DBError
            )
        ),
      [userId, addFavoriteMutation]
    ),
    isLoading: addFavoriteMutation.isLoading,
  };
};

export const useDeleteFavorite = (): {
  readonly mutateAsync: (id: string) => TE.TaskEither<DBError.DBError, void>;
  readonly isLoading: boolean;
} => {
  const queryClient = useQueryClient();

  const deleteFavoriteMutation = useMutation<
    void,
    DBError.DBError,
    string,
    Response | readonly Response[]
  >((id: string) => DBFavorite.deleteFavorite(id), {
    onSuccess: () => queryClient.invalidateQueries("favorites"),
  });

  return {
    mutateAsync: useCallback(
      (id: string) =>
        TE.tryCatch(
          () => deleteFavoriteMutation.mutateAsync(id),
          // Note: This is not fully type-safe as we're assuming that we build
          // a DBError in the db, as we do at the time of writing.
          (error) => error as DBError.DBError
        ),
      [deleteFavoriteMutation]
    ),
    isLoading: deleteFavoriteMutation.isLoading,
  };
};

export const useFavoritesInfinite = (
  userId: string
): APIUtil.UseInfiniteQuery<
  FavoritesWithCursor<Response, DBFavorite.FavoriteDocumentMetaType>,
  FavoritesWithCursor<Document, DBFavorite.FavoriteDocumentMetaType>
> => {
  const {
    data: rawData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    FavoritesWithCursor<Document, DBFavorite.FavoriteDocumentMetaType>,
    DBError.DBError,
    FavoritesWithCursor<Document, DBFavorite.FavoriteDocumentMetaType>,
    FavoritesQueryString
  >(
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
