import { Fragment, useRef, ReactElement } from "react";
import { useInfiniteQuery } from "react-query";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, FavoriteButton, Spinner } from "@/components";
import { PrevGame as DBPrevGame } from "db";
import { useIntersectionObserver } from "@/hooks";
import { useUserContext } from "@/context/user";

export const PrevGamesContainer = (): ReactElement => {
  const user = useUserContext();
  const userId = user?.uid;
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "prevGames",
    async ({ pageParam = null }) => {
      const res = await DBPrevGame.getPrevGames(userId!, pageParam);
      return res;
    },
    {
      enabled: !!userId,
      getNextPageParam: (lastPage) => lastPage.cursor,
      refetchOnWindowFocus: false,
    }
  );

  const loadMoreRef = useRef(null);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  if (error) {
    console.error(error);
    return (
      <Text>Sorry, that didn&apos;t quite work. Please refresh the page.</Text>
    );
  }

  return (
    <>
      {data?.pages.map((page, pageIdx) => (
        <Fragment key={pageIdx}>
          {page.prevGames.map((prevGame, idx) => (
            <Archive.Card key={idx}>
              <Archive.CardHeader>
                <Archive.CardTitle>{prevGame.storyTitle}</Archive.CardTitle>
                <Archive.CardScore>{prevGame.score}</Archive.CardScore>
                <Archive.CardDate dateString={prevGame.datePlayed} />
                <Archive.CloseCardIcon />
              </Archive.CardHeader>
              <Archive.CardExpandedSection>
                <Divider mt={4} />
                <Archive.Story story={prevGame.storyHtml} />
                <Divider my={4} />
                <Archive.Buttons>
                  <Archive.PlayAgainButton storyId={prevGame.storyId} />
                  <FavoriteButton
                    storyDetails={{
                      storyId: prevGame.storyId,
                      storyTitle: prevGame.storyTitle,
                      storyHtml: prevGame.storyHtml,
                    }}
                  />
                </Archive.Buttons>
              </Archive.CardExpandedSection>
            </Archive.Card>
          ))}
        </Fragment>
      ))}

      <div ref={loadMoreRef} style={{ margin: "4rem 0 2rem" }}>
        {isFetching || isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <Text>Load more</Text>
        ) : data?.pages[0].prevGames.length === 0 ? (
          <Text>No previous games found.</Text>
        ) : data && data?.pages[0].prevGames.length < 10 ? null : (
          <Text>No more results.</Text>
        )}
      </div>
    </>
  );
};
