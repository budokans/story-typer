import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
  useEffect,
  useCallback,
} from "react";
import {
  option as O,
  function as F,
  readonlyArray as A,
  io as IO,
} from "fp-ts";
import { ChildrenProps } from "components";
import { Story as StoryAPI, Util as APIUtil } from "api-client";

interface StoryContext {
  readonly stories: readonly StoryAPI.Response[];
  readonly setStories: Dispatch<SetStateAction<readonly StoryAPI.Response[]>>;
  readonly isLoading: boolean;
  readonly fetchNext: () => void;
  readonly gameCount: number;
  readonly setGameCount: Dispatch<SetStateAction<number>>;
  readonly leastRecentStoryPublishedDate: O.Option<string>;
}

const storiesContext = createContext<O.Option<StoryContext>>(O.none);

export const StoriesLoader = ({ children }: ChildrenProps): ReactElement => {
  const [gameCount, setGameCount] = useState(1);
  const [stories, setStories] = useState<readonly StoryAPI.Response[]>([]);
  const {
    data: leastRecentStoryPublishedDate,
    isLoading: leastRecentStoryPublishedDateIsLoading,
    error: leastRecentStoryPublishedDateError,
  } = StoryAPI.useLeastRecentStoryPublishedDate();

  const { error, isFetching, fetchNextPage } = StoryAPI.useStoriesInfinite({
    limit: APIUtil.defaultInfiniteQueryLimit,
    options: {
      enabled: false,
      onSuccess: (data) =>
        F.pipe(
          data?.pages,
          A.last,
          O.match(
            // Force new line
            IO.of(F.constVoid),
            ({ data }) =>
              F.pipe(
                // Force new line
                data,
                A.map(StoryAPI.serializeStory),
                (serialized): IO.IO<void> =>
                  () =>
                    setStories([...stories, ...serialized])
              )
          ),
          (unsafePerformIO) => unsafePerformIO()
        ),
    },
  });

  const fetchNext = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  useEffect(() => {
    if (stories.length === 0 && !isFetching && !error) {
      fetchNextPage();
    }
  }, [stories.length, isFetching, error, fetchNextPage]);

  if (error || leastRecentStoryPublishedDateError) {
    error && console.error(error);
    leastRecentStoryPublishedDateError &&
      console.error(leastRecentStoryPublishedDateError);

    return (
      <p>
        Sorry, we are having trouble loading the stories. Please try refreshing
        the page.
      </p>
    );
  }

  return (
    <storiesContext.Provider
      value={O.some({
        stories,
        setStories,
        isLoading:
          isFetching ||
          leastRecentStoryPublishedDateIsLoading ||
          (stories.length === 0 && !error),
        fetchNext,
        gameCount,
        setGameCount,
        leastRecentStoryPublishedDate,
      })}
    >
      {children}
    </storiesContext.Provider>
  );
};

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
