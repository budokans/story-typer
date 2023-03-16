import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
  useCallback,
} from "react";
import {
  option as O,
  function as F,
  readonlyArray as A,
  readonlyNonEmptyArray as NEA,
  io as IO,
} from "fp-ts";
import { useMediaQuery } from "@chakra-ui/react";
import { ChildrenProps, Game } from "components";
import { Story as StoryAPI, Util as APIUtil } from "api-client";
import { GameContainer } from "containers";

interface StoryContext {
  readonly stories: readonly StoryAPI.Response[];
  readonly setStories: Dispatch<SetStateAction<readonly StoryAPI.Response[]>>;
  readonly currentStory: StoryAPI.Response;
  readonly fetchNext: IO.IO<void>;
  readonly currentStoryIdx: number;
  readonly setCurrentStoryIdx: Dispatch<SetStateAction<number>>;
  readonly leastRecentStoryPublishedDate: string;
}

const storiesContext = createContext<O.Option<StoryContext>>(O.none);

export const StoriesLoader = ({ children }: ChildrenProps): ReactElement => {
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [stories, setStories] = useState<readonly StoryAPI.Response[]>([]);
  const {
    data: leastRecentStoryPublishedDate,
    isLoading: leastRecentStoryPublishedDateIsLoading,
    error: leastRecentStoryPublishedDateError,
  } = StoryAPI.useLeastRecentStoryPublishedDate();

  const { error, isFetching, fetchNextPage } = StoryAPI.useStoriesInfinite({
    limit: APIUtil.defaultInfiniteQueryLimit,
    options: {
      onSuccess: (data) =>
        F.pipe(
          data.pages,
          A.last,
          O.chain(({ data }) => (A.isNonEmpty(data) ? O.some(data) : O.none)),
          O.match(
            () => () => fetchNextPage(),
            F.flow(
              NEA.map(StoryAPI.serializeStory),
              (serialized) => () =>
                setStories((prevStories) => [...prevStories, ...serialized])
            )
          ),
          (unsafePerformIO) => unsafePerformIO()
        ),
    },
  });

  const fetchNext = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  //TODO: Tidy up this mess.

  if (isFetching || leastRecentStoryPublishedDateIsLoading) {
    // TODO: Render appropriate loading UI depending on route
    return (
      <GameContainer.GameWrapper>
        <Game.Skeleton isLargeViewport={viewportIsWiderThan768} />
      </GameContainer.GameWrapper>
    );
  }

  if (error) {
    console.error(error);
    return <p>Error page</p>;
  }

  if (leastRecentStoryPublishedDateError) {
    console.error(leastRecentStoryPublishedDateError);
    return <p>Error page</p>;
  }

  if (A.isEmpty(stories)) console.error("No stories were found.");

  if (!leastRecentStoryPublishedDate)
    console.error("No leastRecentStoryPublishedDate found.");

  const currentStory = stories[currentStoryIdx];
  if (!currentStory) console.error("Current story is undefined.");

  if (
    error ||
    leastRecentStoryPublishedDateError ||
    A.isEmpty(stories) ||
    !leastRecentStoryPublishedDate ||
    !currentStory
  ) {
    return storiesErrorContent;
  }

  return (
    <storiesContext.Provider
      value={O.some({
        stories,
        setStories,
        currentStory,
        fetchNext,
        currentStoryIdx,
        setCurrentStoryIdx,
        leastRecentStoryPublishedDate,
      })}
    >
      {children}
    </storiesContext.Provider>
  );
};

const storiesErrorContent = (
  <p>
    Sorry, we are having trouble loading the stories. Please try refreshing the
    page. If that fails, please contact the creator.
  </p>
);

export const useStoriesContext = (): StoryContext => {
  const context = useContext(storiesContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useStoriesContext was called where storiesContext does not exist."
        );
      },
      (context) => context
    )
  );
};
