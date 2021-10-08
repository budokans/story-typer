import { Fragment, useRef, FC } from "react";
import { useInfiniteQuery } from "react-query";
import { Divider, Text } from "@chakra-ui/react";
import { Archive } from "@/components/Archive";
import { Spinner } from "@/components/Spinner";
import { queryFavorites } from "@/lib/db";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const FavoritesContainer: FC = () => {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "favorites",
    async ({ pageParam = null }) => {
      const res = await queryFavorites(pageParam);
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
            {page.favorites.map((favorite, idx) => (
              <Archive.Card key={idx}>
                <Archive.CardHeader id={idx}>
                  <Archive.CardTitle>{favorite.storyTitle}</Archive.CardTitle>
                  <Archive.CardDate dateString={favorite.dateFavorited} />
                  <Archive.CloseCardIcon id={idx} />
                </Archive.CardHeader>
                <Archive.CardExpandedSection id={idx}>
                  <Divider mt={4} />
                  <Archive.FullStory story={favorite.storyHtml} />
                  <Divider my={4} />
                  <Archive.Buttons>
                    <Archive.PlayAgainButton storyId={favorite.storyId} />
                    <Archive.DeleteFavoriteButton
                      storyDetails={{
                        storyId: favorite.storyId,
                        storyTitle: favorite.storyTitle,
                        storyHtml: favorite.storyHtml,
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
      <div ref={loadMoreRef}>
        {isFetchingNextPage || isFetching ? (
          <Spinner />
        ) : hasNextPage ? (
          <Text>Load more</Text>
        ) : data?.pages[0].favorites.length === 0 ? (
          <Text>No favorites found.</Text>
        ) : data && data?.pages[0].favorites.length < 10 ? null : (
          <Text>No more results.</Text>
        )}
      </div>
    </>
  );
};
