import { useRef, ReactElement } from "react";
import { function as F, either as E } from "fp-ts";
import { Divider } from "@chakra-ui/react";
import {
  Archive,
  CenterContent,
  FavoriteButton,
  InfiniteScroll,
  Spinner,
} from "components";
import { useIntersectionObserver } from "hooks";
import { User as UserContext } from "context";
import { PrevGame as PrevGameAPI } from "api-client";
import { ErrorContainer } from "containers";

export const PrevGamesContainer = (): ReactElement => {
  const { id: userId } = UserContext.useUserContext();
  const prevGamesQuery = PrevGameAPI.usePrevGamesInfinite(userId);

  switch (prevGamesQuery._tag) {
    case "loading":
      return (
        <CenterContent observeLayout furtherVerticalOffset={250}>
          <Spinner />
        </CenterContent>
      );
    case "settled":
      return F.pipe(
        prevGamesQuery.data,
        E.match(
          (error) => <ErrorContainer error={error} />,
          (data) => (
            <PrevGames
              data={data}
              isFetching={prevGamesQuery.isFetching}
              fetchNextPage={prevGamesQuery.fetchNextPage}
              hasNextPage={prevGamesQuery.hasNextPage}
            />
          )
        )
      );
  }
};

const PrevGames = ({
  data,
  isFetching,
  fetchNextPage,
  hasNextPage,
}: {
  readonly data: readonly PrevGameAPI.Response[];
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
      {data.map((prevGame, idx) => (
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
      <InfiniteScroll
        ref={loadMoreRef}
        isFetching={isFetching}
        hasNext={hasNextPage}
        data={data}
      />
    </>
  );
};
