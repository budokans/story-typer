import { useInfiniteQuery } from "react-query";
import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { function as F, array as AMut, readonlyArray as A } from "fp-ts";
import { PrevGame as DBPrevGame } from "db";
import { PrevGame as PrevGameSchema } from "api-schemas";
import { UseInfiniteQuery } from "./util";

type Document = DBPrevGame.PrevGameDocument;
type Response = PrevGameSchema.PrevGameResponse;

const serializePrevGame = (prevGameDoc: Document): Response => ({
  id: prevGameDoc.id,
  userId: prevGameDoc.userId,
  storyId: prevGameDoc.storyId,
  storyTitle: prevGameDoc.storyTitle,
  storyHtml: prevGameDoc.storyHtml,
  score: prevGameDoc.score,
  // Sadly, an unavoidable cast as serverTimestamp() returns a FieldValue
  datePlayed: (prevGameDoc.datePlayed as Timestamp).toDate().toISOString(),
});

export const usePrevGamesInfinite = (
  userId: string
): UseInfiniteQuery<
  DBPrevGame.PrevGamesWithCursor<Response, Document>,
  DBPrevGame.PrevGamesWithCursor<Document, Document>
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
    async ({
      pageParam = null,
    }: {
      readonly pageParam?: QueryDocumentSnapshot<Document> | null;
    }) => await DBPrevGame.getPrevGames(userId!, pageParam),
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
              prevGames: F.pipe(page.prevGames, A.map(serializePrevGame)),
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
