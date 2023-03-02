import { useInfiniteQuery } from "react-query";
import { function as F, array as AMut, readonlyArray as A } from "fp-ts";
import { PrevGame as DBPrevGame } from "db";
import { PrevGame as PrevGameSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";
import { QueryDocumentSnapshot } from "firelordjs";

type Document = DBPrevGame.DocumentRead;
type Response = PrevGameSchema.PrevGameResponse;

const serializePrevGame = (prevGameDoc: Document): Response => ({
  id: prevGameDoc.id,
  userId: prevGameDoc.userId,
  storyId: prevGameDoc.storyId,
  storyTitle: prevGameDoc.storyTitle,
  storyHtml: prevGameDoc.storyHtml,
  score: prevGameDoc.score,
  datePlayed: prevGameDoc.datePlayed.toDate().toISOString(),
});

export const usePrevGamesInfinite = (
  userId: string
): APIUtil.UseInfiniteQuery<
  DBPrevGame.PrevGamesWithCursor<Response, DBPrevGame.PrevGameDocumentMetaType>,
  DBPrevGame.PrevGamesWithCursor<Document, DBPrevGame.PrevGameDocumentMetaType>
> => {
  const {
    data: rawData,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
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
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};
