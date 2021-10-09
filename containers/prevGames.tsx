import { Fragment, useRef, FC } from "react";
import { useInfiniteQuery } from "react-query";
import { Divider, Text } from "@chakra-ui/react";
import { Archive } from "@/components/Archive";
import { Spinner } from "@/components/Spinner";
import { FavoriteButton } from "@/components/FavoriteButton";
import { queryPrevGames } from "@/lib/db";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const PrevGamesContainer: FC = () => {
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
      const res = await queryPrevGames(pageParam);
      return res;
    },
    {
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

  return (
    <>
      {data ? (
        data.pages.map((page, pageIdx) => (
          <Fragment key={pageIdx}>
            {page.prevGames.map((prevGame, idx) => (
              <Archive.Card key={idx}>
                <Archive.CardHeader id={idx}>
                  <Archive.CardTitle>{prevGame.storyTitle}</Archive.CardTitle>
                  <Archive.CardScore>{prevGame.score}</Archive.CardScore>
                  <Archive.CardDate dateString={prevGame.datePlayed} />
                  <Archive.CloseCardIcon id={idx} />
                </Archive.CardHeader>
                <Archive.CardExpandedSection id={idx}>
                  <Divider mt={4} />
                  <Archive.FullStory story={prevGame.storyHtml} />
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
        ))
      ) : error ? (
        <Text>
          Sorry, that didn&apos;t quite work. Please refresh the page.
        </Text>
      ) : null}

      <div ref={loadMoreRef} style={{ margin: "4rem 0 2rem" }}>
        {isFetchingNextPage || isFetching ? (
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
