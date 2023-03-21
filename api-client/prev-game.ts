import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useCallback } from "react";
import {
  function as F,
  readonlyArray as A,
  taskEither as TE,
  either as E,
} from "fp-ts";
import { MetaType, QueryDocumentSnapshot } from "firelordjs";
import { PrevGame as DBPrevGame, Error as DBError } from "db";
import { PrevGame as PrevGameSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";

export type Body = PrevGameSchema.PrevGameBody;
export type Document = DBPrevGame.DocumentRead;
export type Response = PrevGameSchema.PrevGameResponse;
export type PrevGamesWithCursor<
  A,
  R extends MetaType
> = DBPrevGame.PrevGamesWithCursor<A, R>;

export const useAddPrevGame = (): {
  readonly mutateAsync: (body: Body) => TE.TaskEither<DBError.DBError, string>;
  readonly isLoading: boolean;
} => {
  const queryClient = useQueryClient();

  const addPrevGameMutation = useMutation<
    string,
    DBError.DBError,
    Body,
    PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>
  >((body: Body) => DBPrevGame.createPrevGame(body), {
    onSuccess: () => queryClient.invalidateQueries("prev-games"),
  });

  return {
    mutateAsync: useCallback(
      (body: Body) =>
        F.pipe(
          // Force new line
          body,
          PrevGameSchema.PrevGameBody.encode,
          (encodedBody) =>
            TE.tryCatch(
              () => addPrevGameMutation.mutateAsync(encodedBody),
              // Note: This is not fully type-safe as we're assuming that we build
              // a DBError in the db, as we do at the time of writing.
              (error) => error as DBError.DBError
            )
        ),
      [addPrevGameMutation]
    ),
    isLoading: addPrevGameMutation.isLoading,
  };
};

const serializePrevGame = (prevGameDoc: Document): Response => ({
  id: prevGameDoc.id,
  userId: prevGameDoc.userId,
  storyId: prevGameDoc.storyId,
  storyTitle: prevGameDoc.storyTitle,
  storyHtml: prevGameDoc.storyHtml,
  score: prevGameDoc.score,
  datePlayed: prevGameDoc.datePlayed.toDate().toISOString(),
});

type PrevGamesQueryKey = "prev-games";

export const usePrevGamesInfinite = (
  userId: string
): APIUtil.UseArchiveInfinite<
  DBError.DBError,
  PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>,
  readonly Response[]
> => {
  const {
    data: rawData,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>,
    DBError.DBError,
    PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>,
    PrevGamesQueryKey
  >(
    "prev-games",
    ({
      pageParam = null,
    }: {
      readonly pageParam?: QueryDocumentSnapshot<DBPrevGame.PrevGameDocumentMetaType> | null;
    }) =>
      DBPrevGame.getPrevGames({
        userId: userId!,
        last: pageParam,
        _limit: APIUtil.defaultInfiniteQueryLimit,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return { _tag: "loading" };

  return {
    _tag: "settled",
    data: F.pipe(
      rawData,
      E.fromNullable(
        error ?? new DBError.Unknown("Unknown error. Is the query disabled?")
      ),
      E.map(({ pages }) =>
        F.pipe(
          pages,
          A.chain(({ data }) => data),
          A.map(serializePrevGame)
        )
      )
    ),
    isFetching,
    fetchNextPage,
    hasNextPage,
  };
};
