import { useRef, ReactElement } from "react";
import { function as F, either as E } from "fp-ts";
import { Divider } from "@chakra-ui/react";
import { Archive, CenterContent, InfiniteScroll, Spinner } from "components";
import { useIntersectionObserver } from "hooks";
import { Favorite as FavoriteAPI } from "api-client";
import { User as UserContext } from "context";

export const FavoritesContainer = (): ReactElement => {
  const { id: userId } = UserContext.useUserContext();
  const favoritesQuery = FavoriteAPI.useFavoritesInfinite(userId);

  switch (favoritesQuery._tag) {
    case "loading":
      return (
        <CenterContent observeLayout furtherVerticalOffset={250}>
          <Spinner />
        </CenterContent>
      );
    case "settled":
      return F.pipe(
        favoritesQuery.data,
        E.match(
          (error) => {
            console.error(error);
            //TODO: Error page
            return <p>{error}</p>;
          },
          (data) => (
            <Favorites
              data={data}
              isFetching={favoritesQuery.isFetching}
              fetchNextPage={favoritesQuery.fetchNextPage}
              hasNextPage={favoritesQuery.hasNextPage}
            />
          )
        )
      );
  }
};

const Favorites = ({
  data,
  isFetching,
  fetchNextPage,
  hasNextPage,
}: {
  readonly data: readonly FavoriteAPI.Response[];
  readonly isFetching: boolean;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean | undefined;
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <>
      {data.map((favorite, idx) => (
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
      <InfiniteScroll
        ref={loadMoreRef}
        isFetching={isFetching}
        hasNext={hasNextPage}
        data={data}
      />
    </>
  );
};
