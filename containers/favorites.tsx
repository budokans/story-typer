import { Fragment, useRef, ReactElement } from "react";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, Spinner } from "@/components";
import { useIntersectionObserver } from "@/hooks";
import { useUserContext } from "@/context/user";
import { useFavoritesInfinite } from "api-client/favorite";

export const FavoritesContainer = (): ReactElement => {
  const user = useUserContext();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFavoritesInfinite(user?.uid);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
      ))}

      {/* Infinite Scroll */}
      <div ref={loadMoreRef} style={{ margin: "4rem 0 2rem" }}>
        {isFetching || isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <Text>Load more</Text>
        ) : data?.pages[0].favorites.length === 0 ? (
          <Text>No favorites found.</Text>
        ) : data && data.pages[0].favorites.length < 10 ? null : (
          <Text>No more results.</Text>
        )}
      </div>
    </>
  );
};
