import { Fragment, useRef, ReactElement } from "react";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, FavoriteButton, InfiniteScroll } from "@/components";
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
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

      <InfiniteScroll
        ref={loadMoreRef}
        isFetching={isFetching}
        isFetchingNext={isFetchingNextPage}
        hasNext={hasNextPage}
        data={data?.pages[0].prevGames}
      />
    </>
  );
};
