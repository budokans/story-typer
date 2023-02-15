import { Fragment, useRef, ReactElement } from "react";
import { Divider, Text } from "@chakra-ui/react";
import { Archive, InfiniteScroll } from "@/components";
import { useIntersectionObserver } from "@/hooks";
import { Favorite as FavoriteAPI } from "api-client";
import { useUserContext } from "@/context/user";

export const FavoritesContainer = (): ReactElement => {
  const { id: userId } = useUserContext();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = FavoriteAPI.useFavoritesInfinite(userId);

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
                  <Archive.DeleteFavoriteButton id={favorite.id} />
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
        data={data?.pages[0].favorites}
      />
    </>
  );
};
