import { useState, FC, Fragment, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { Divider, Spinner, Text } from "@chakra-ui/react";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";
import { FavoriteButton } from "@/components/FavoriteButton";
import { queryPrevGames } from "@/lib/db";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Previous: FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  const {
    status,
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
    <Page>
      <Archive>
        <Archive.BackToGameButton />
        <Archive.PageTitle>Previously...</Archive.PageTitle>
        <Archive.Toggles value={listType} onSetValue={handleToggleValue} />
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
                      <FavoriteButton storyId={prevGame.storyId} />
                    </Archive.Buttons>
                  </Archive.CardExpandedSection>
                </Archive.Card>
              ))}
            </Fragment>
          ))
        ) : error ? (
          <Text>
            Sorry, that didn&apos;t quite work. Please refresh and try again
          </Text>
        ) : null}

        <div ref={loadMoreRef}>
          {isFetchingNextPage || isFetching ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="brand.500"
              size="xl"
            />
          ) : hasNextPage ? (
            <Text>Load more</Text>
          ) : (
            <Text>No more results</Text>
          )}
        </div>
      </Archive>
    </Page>
  );
};

export default Previous;
