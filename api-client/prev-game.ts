import { useInfiniteQuery } from "react-query";
import { function as F, array as AMut, readonlyArray as A } from "fp-ts";
import { PrevGame as DBPrevGame, Error as DBError } from "db";
import { PrevGame as PrevGameSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";
import { MetaType, QueryDocumentSnapshot } from "firelordjs";

export type Body = PrevGameSchema.PrevGameBody;
export type Document = DBPrevGame.DocumentRead;
export type Response = PrevGameSchema.PrevGameResponse;
export type PrevGamesWithCursor<
  A,
  R extends MetaType
> = DBPrevGame.PrevGamesWithCursor<A, R>;

const serializePrevGame = (prevGameDoc: Document): Response => ({
  id: prevGameDoc.id,
  userId: prevGameDoc.userId,
  storyId: prevGameDoc.storyId,
  storyTitle: prevGameDoc.storyTitle,
  storyHtml: prevGameDoc.storyHtml,
  score: prevGameDoc.score,
  datePlayed: prevGameDoc.datePlayed.toDate().toISOString(),
});

type PrevGameQueryString = "prevGames";

export const usePrevGamesInfinite = (
  userId: string
): APIUtil.UseInfiniteQuery<
  PrevGamesWithCursor<Response, DBPrevGame.PrevGameDocumentMetaType>,
  PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>
> => {
  const {
    data: rawData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>,
    DBError.DBError,
    PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>,
    PrevGameQueryString
  >(
    "prevGames",
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

  return {
    data: rawData
      ? {
          pages: F.pipe(
            rawData.pages,
            AMut.map((page) => ({
              data: F.pipe(page.data, A.map(serializePrevGame)),
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
