import { Fragment, useRef, ReactElement } from "react";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, FavoriteButton, Spinner } from "@/components";
import { useIntersectionObserver } from "@/hooks";
import { useUserContext } from "@/context/user";
import { usePrevGamesInfinite } from "api-client/prev-game";

export const PrevGamesContainer = (): ReactElement => {
  const user = useUserContext();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePrevGamesInfinite(user?.uid);
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
      {data?.pages.map((page, idx) => (
        <Fragment key={idx}>
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

      {/* Infinite Scroll */}
      <div ref={loadMoreRef} style={{ margin: "4rem 0 2rem" }}>
        {isFetching || isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <Text>Load more</Text>
        ) : data?.pages[0].prevGames.length === 0 ? (
          <Text>No favorites found.</Text>
        ) : data && data.pages[0].prevGames.length < 10 ? null : (
          <Text>No more results.</Text>
        )}
      </div>
    </>
  );
};
