import { Fragment, useRef, ReactElement } from "react";
import { useInfiniteQuery } from "react-query";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, Spinner } from "@/components";
import { queryFavorites } from "@/lib/db";
import { useIntersectionObserver } from "@/hooks";
import { useAuthContext } from "@/context/auth";

export const FavoritesContainer = (): ReactElement => {
  const { userId } = useAuthContext();
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
      const res = await queryFavorites(userId!, pageParam);
      return res;
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      refetchOnWindowFocus: false,
      enabled: !!userId,
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
                <Archive.CardHeader>
                  <Archive.CardTitle>{favorite.storyTitle}</Archive.CardTitle>
                  <Archive.CardDate dateString={favorite.dateFavorited} />
                  <Archive.CloseCardIcon />
                </Archive.CardHeader>
                <Archive.CardExpandedSection>
                  <Divider mt={4} />
                  <Archive.Story story={favorite.storyHtml} />
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

      <div ref={loadMoreRef} style={{ margin: "4rem 0 2rem" }}>
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
